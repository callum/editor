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

function Editor (initialState) {
  const state = defined(initialState, { blocks: [] })
  this._blockTypes = new Map()
  this._validators = new Map()
  this._app = vapp(vdom)

  const render = this._app.start(modifier, state)
  Object.defineProperty(this, 'tree', {
    get () {
      assert(this.validate(), 'invalid block data')
      return render(main.bind(null, this))
    }
  })
}

Editor.prototype.validate = function validate () {
  const state = this._app.store.getState()
  for (var block of state.blocks) {
    if (this.validateBlock(block.data, block.name) !== null) return false
  }
  return true
}

Editor.prototype.addBlockType = function addBlockType (blockType) {
  assert.equal(typeof blockType.name, 'string', 'name must be a string')
  assert.equal(typeof blockType.version, 'string', 'version must be a string')
  assert.equal(typeof blockType.main, 'function', 'main must be a function')
  assert.equal(typeof blockType.schema, 'object', 'schema must be an object')
  assert.equal(typeof blockType.initialData, 'object', 'initial data must be an object')
  this._blockTypes.set(blockType.name, blockType)
}

Editor.prototype.createBlock = function createBlock (name) {
  const blockType = this._getBlockType(name)
  this._app.store({
    type: CREATE_BLOCK,
    name: blockType.name,
    version: blockType.version,
    data: blockType.initialData
  })
}

Editor.prototype.updateBlock = function updateBlock (id, data) {
  assert.equal(typeof id, 'number', 'id must be a number')
  assert.equal(typeof data, 'object', 'data must be an object')
  this._app.store({ type: UPDATE_BLOCK, id, data })
}

Editor.prototype.deleteBlock = function deleteBlock (id) {
  assert.equal(typeof id, 'number', 'id must be a number')
  this._app.store({ type: DELETE_BLOCK, id })
}

Editor.prototype.validateBlock = function validateBlock (data, name) {
  assert.equal(typeof data, 'object', 'data must be an object')
  const blockType = this._getBlockType(name)
  if (equal(data, blockType.initialData)) return null
  var validate = this._validators.get(blockType)
  if (!validate) {
    validate = validator(blockType.schema)
    this._validators.set(blockType, validate)
  }
  validate(data)
  return validate.errors
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
