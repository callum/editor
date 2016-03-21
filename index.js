const assert = require('assert')
const defined = require('defined')
const emitter = require('store-emitter')
const equal = require('deep-equal')
const validator = require('is-my-json-valid')
const xtend = require('xtend')
const yo = require('yo-yo')

const CREATE_BLOCK = 'CREATE_BLOCK'
const UPDATE_BLOCK = 'UPDATE_BLOCK'
const DELETE_BLOCK = 'DELETE_BLOCK'
const FOCUS_BLOCK = 'FOCUS_BLOCK'
const DEFOCUS_BLOCK = 'DEFOCUS_BLOCK'
const SHOW_TOOLBAR = 'SHOW_TOOLBAR'
const HIDE_TOOLBAR = 'HIDE_TOOLBAR'

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
  this._emitter = emitter(modifier, state)
  this._emit = this._emitter
  this._emitter.on('*', handleUpdate.bind(this))

  function handleUpdate (_, state) {
    yo.update(this.element, main(this, state))
  }
}

/**
* Get editor DOM element
* @name element
* @memberof Editor
* @type {Object}
* @example
* const editor = new Editor()
* document.body.appendChild(editor.element)
*/
Object.defineProperty(Editor.prototype, 'element', {
  get () {
    if (typeof this._element !== 'undefined') return this._element
    this.state.blocks.forEach(function (block) {
      const errors = this.validateBlock(block.id)
      if (errors.length) {
        const error = errors[0]
        throw new Error(`${error.field} ${error.message} at block with id '${block.id}'`)
      }
    }, this)
    this._element = main(this, this.state)
    return this._element
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
    return this._emitter.getState()
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
* @param {number} afterBlockId – id of block to insert after
* @return {number} id of the block
* @example
* const editor = new Editor()
* editor.createBlock('text')
*/
Editor.prototype.createBlock = function createBlock (name, afterBlockId) {
  const blockType = this._getBlockType(name)
  const id = Date.now()
  this._emit({
    type: CREATE_BLOCK,
    name: blockType.name,
    version: blockType.version,
    data: blockType.initialData,
    id,
    afterBlockId
  })
  return id
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
  this._emit({ type: DELETE_BLOCK, id })
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
  this._emit({ type: UPDATE_BLOCK, id, data })
}

/**
* Focus block
* @param {number} id - id of block to focus
* @example
* const editor = new Editor()
* editor.focusBlock(123)
*/
Editor.prototype.focusBlock = function focusBlock (id) {
  assert.equal(typeof id, 'number', 'id must be a number')
  this._emit({ type: FOCUS_BLOCK, id })
}

/**
* Defocus block
* @example
* const editor = new Editor()
* editor.defocusBlock()
*/
Editor.prototype.defocusBlock = function defocusBlock () {
  this._emit({ type: DEFOCUS_BLOCK })
}

/**
* Show toolbar
* @param {number} afterBlockId - id of the block to insert after
* @example
* const editor = new Editor()
* editor.showToolbar(123)
*/
Editor.prototype.showToolbar = function showToolbar (afterBlockId) {
  assert.equal(typeof afterBlockId, 'number', 'afterBlockId must be a number')
  this._emit({ type: SHOW_TOOLBAR, afterBlockId })
}

/**
* Hide toolbar
* @example
* const editor = new Editor()
* editor.hideToolbar()
*/
Editor.prototype.hideToolbar = function hideToolbar () {
  this._emit({ type: HIDE_TOOLBAR })
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
    var targetIndex = state.blocks.length
    if (typeof action.afterBlockId !== 'undefined') {
      targetIndex = state.blocks.findIndex(function (block) {
        return block.id === action.afterBlockId
      }) + 1
    }
    return xtend(state, {
      blocks: state.blocks.slice(0, targetIndex)
        .concat([{
          id: action.id,
          name: action.name,
          version: action.version,
          data: action.data
        }])
        .concat(state.blocks.slice(targetIndex))
    })
  }

  if (action.type === UPDATE_BLOCK) {
    return xtend(state, {
      blocks: state.blocks.map(function (block) {
        if (block.id === action.id) {
          return xtend(block, { data: xtend(block.data, action.data) })
        }
        return block
      })
    })
  }

  if (action.type === DELETE_BLOCK) {
    return xtend(state, {
      blocks: state.blocks.filter(function (block) {
        return block.id !== action.id
      })
    })
  }

  if (action.type === FOCUS_BLOCK) {
    return xtend(state, { focus: action.id })
  }

  if (action.type === DEFOCUS_BLOCK) {
    return xtend(state, { focus: null })
  }

  if (action.type === SHOW_TOOLBAR) {
    return xtend(state, { toolbar: action.afterBlockId })
  }

  if (action.type === HIDE_TOOLBAR) {
    return xtend(state, { toolbar: null })
  }
}

function main (editor, state) {
  return yo`<main>
    ${state.blocks.map(function (b) {
      var bar
      if (editor.state.toolbar === b.id) bar = toolbar(editor, state, b.id)
      return yo`<div>
        ${block(editor, b)}
        ${bar}
      </div>`
    })}
  </main>`
}

function block (editor, state) {
  const blockType = editor._blockTypes.get(state.name)

  return yo`<section>
    ${blockType.main(editor, state)}
    <button onclick=${deleteBlock}>Delete block</button>
  </section>`

  function deleteBlock () {
    editor.deleteBlock(state.id)
  }
}

function toolbar (editor, state, afterBlockId) {
  const blockTypes = Array.from(editor._blockTypes.values())

  return yo`<div>
    ${blockTypes.map(function (blockType, i) {
      const button = yo`<button onclick=${createBlock.bind(null, blockType.name)}>
        Create ${blockType.name} block
      </button>`
      if (i === 0) button.focus()
      return button
    })}
  </div>`

  function createBlock (name) {
    const id = editor.createBlock(name, afterBlockId)
    editor.hideToolbar()
    editor.focusBlock(id)
  }
}
