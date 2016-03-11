const assert = require('assert')
const defined = require('defined')
const equal = require('deep-equal')
const hyperx = require('hyperx')
const validator = require('is-my-json-valid')
const vapp = require('virtual-app')
const vdom = require('virtual-dom')
const xtend = require('xtend')

const CREATE_BLOCK = 'CREATE_BLOCK'
const UPDATE_BLOCK = 'UPDATE_BLOCK'
const DELETE_BLOCK = 'DELETE_BLOCK'

const hx = hyperx(vdom.h)

module.exports = Editor

/**
* Create an editor
* @param {Object} [initialState] - optional initial state
* @example
* const editor = new Editor()
*/
function Editor (initialState) {
  const state = defined(initialState, { blocks: [] })
  this._blockTypes = new Map()
  this._validators = new Map()
  this._app = vapp(vdom)
  this._render = this._app.start(modifier, state)
}

/**
* Get editor DOM tree
* @name tree
* @memberof Editor
* @type {Object}
* @example
* const editor = new Editor()
* document.body.appendChild(editor.tree)
*/
Object.defineProperty(Editor.prototype, 'tree', {
  get () {
    this.state.blocks.forEach(function (block) {
      const errors = this.validateBlock(block.id)
      if (errors.length) {
        const error = errors[0]
        throw `${error.field} ${error.message} at block with id '${block.id}'`
      }
    }, this)
    return this._render(main.bind(null, this))
  }
})

/**
* Get editor state
* @name state
* @memberof Editor
* @type {Object}
* @example
* const editor = new Editor()
* editor.state
*/
Object.defineProperty(Editor.prototype, 'state', {
  get () {
    return this._app.store.getState()
  }
})

/**
* Add block type
* @param {Object} blockType
* @param {string} blockType.name – block type name
* @param {string} blockType.version – block type version
* @param {Function} blockType.main – block type function
* @param {Object} blockType.schema – block type schema
* @param {Object} blockType.initialData – block type initial data
* @example
* const editor = new Editor()
* editor.addBlockType(require('editor/text'))
*/
Editor.prototype.addBlockType = function addBlockType (blockType) {
  assert.equal(typeof blockType.name, 'string', 'name must be a string')
  assert.equal(typeof blockType.version, 'string', 'version must be a string')
  assert.equal(typeof blockType.main, 'function', 'main must be a function')
  assert.equal(typeof blockType.schema, 'object', 'schema must be an object')
  assert.equal(typeof blockType.initialData, 'object', 'initial data must be an object')
  this._blockTypes.set(blockType.name, blockType)
  this._validators.set(blockType.name, validator(blockType.schema))
}

/**
* Create block
* @param {string} name – block type name
* @example
* const editor = new Editor()
* editor.createBlock('text')
*/
Editor.prototype.createBlock = function createBlock (name) {
  const blockType = this._getBlockType(name)
  this._app.store({
    type: CREATE_BLOCK,
    name: blockType.name,
    version: blockType.version,
    data: blockType.initialData
  })
}

/**
* Delete block
* @param {number} id - id of the block to delete
* @example
* const editor = new Editor()
* editor.deleteBlock(123)
*/
Editor.prototype.deleteBlock = function deleteBlock (id) {
  assert.equal(typeof id, 'number', 'id must be a number')
  this._app.store({ type: DELETE_BLOCK, id })
}

/**
* Update block data
* @param {number} id - id of the block to update
* @param {Object} data
* @example
* const editor = new Editor()
* editor.updateBlock(123, { text: 'abc' })
*/
Editor.prototype.updateBlock = function updateBlock (id, data) {
  assert.equal(typeof id, 'number', 'id must be a number')
  assert.equal(typeof data, 'object', 'data must be an object')
  this._app.store({ type: UPDATE_BLOCK, id, data })
}

/**
* Validate block data
* @param {number} id - id of the block to validate
* @return {Boolean|Array} an array of errors if there are any, otherwise `true`
* @example
* const editor = new Editor()
* editor.validateBlock(123)
*/
Editor.prototype.validateBlock = function validateBlock (id) {
  assert.equal(typeof id, 'number', 'id must be a number')
  const block = this.state.blocks.find(function (block) {
    return block.id === id
  })
  const blockType = this._getBlockType(block.name)
  if (equal(block.data, blockType.initialData)) return true
  const validate = this._validators.get(blockType.name)
  validate(block.data)
  if (validate.errors && validate.errors.length) return validate.errors
  return true
}

Editor.prototype._getBlockType = function getBlockType (name) {
  assert(this._blockTypes.has(name), `unknown block type with name '${name}'`)
  return this._blockTypes.get(name)
}

function modifier (action, state) {
  if (action.type === CREATE_BLOCK) {
    return {
      blocks: [].concat(state.blocks, [{
        id: Date.now(),
        name: action.name,
        version: action.version,
        data: action.data
      }])
    }
  }

  if (action.type === UPDATE_BLOCK) {
    return {
      blocks: state.blocks.map(function (block) {
        if (block.id === action.id) {
          return xtend(block, { data: xtend(block.data, action.data) })
        }
        return block
      })
    }
  }

  if (action.type === DELETE_BLOCK) {
    return {
      blocks: state.blocks.filter(function (block) {
        return block.id !== action.id
      })
    }
  }
}

function main (editor, state) {
  return hx`<main>
    ${state.blocks.map(block.bind(null, editor))}
    ${toolbar(editor, hx, state)}
  </main>`
}

function toolbar (editor, state) {
  const blockTypes = Array.from(editor._blockTypes.values())

  return blockTypes.map(function (blockType) {
    return hx`<button onclick=${createBlock.bind(null, blockType.name)}>
      Create ${blockType.name} block
    </button>`
  })

  function createBlock (name) {
    editor.createBlock(name)
  }
}

function block (editor, state) {
  const blockType = editor._blockTypes.get(state.name)

  return hx`<section>
    ${blockType.main(editor, state)}
    <button onclick=${deleteBlock}>Delete block</button>
  </section>`

  function deleteBlock () {
    editor.deleteBlock(state.id)
  }
}
