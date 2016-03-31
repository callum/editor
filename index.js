const assert = require('assert')
const defined = require('defined')
const emitter = require('store-emitter')
const validator = require('is-my-json-valid')
const yo = require('yo-yo')
const Block = require('./block')
const elements = require('./elements')
const modifier = require('./modifier')

module.exports = Editor

/**
* Instantiate an editor
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
    // use requestAnimationFrame to reduce the number of calls to this
    yo.update(this.element, elements.main(this, state))
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
    if (typeof this._element === 'undefined') {
      this._element = elements.main(this, this.state)
    }
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
* Get blocks
* @name blocks
* @memberof Editor
* @type {Array}
* @example
* const editor = new Editor()
* editor.blocks
*/
Object.defineProperty(Editor.prototype, 'blocks', {
  get () {
    return this.state.blocks.map(function (b) {
      return new Block(this, b)
    }, this)
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
* @param {Object} blockType.initialState – block type initial state
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
  assert.equal(typeof blockType.initialState, 'object', 'initial state must be an object')
  this._blockTypes.set(blockType.name, blockType)
  this._validators.set(blockType.name, validator(blockType.schema))
}

/**
* Show toolbar
* @param {number} position - id of the block to position after
* @example
* const editor = new Editor()
* editor.showToolbar(123)
*/
Editor.prototype.showToolbar = function showToolbar (position) {
  assert.equal(typeof position, 'number', 'position must be a number')
  this._emit({ type: 'show_toolbar', position })
}

/**
* Hide toolbar
* @example
* const editor = new Editor()
* editor.hideToolbar()
*/
Editor.prototype.hideToolbar = function hideToolbar () {
  this._emit({ type: 'hide_toolbar' })
}

/**
* Create block
* @param {string} name – block type name
* @param {number} position – id of block to position after
* @return {number} id of the block
* @example
* const editor = new Editor()
* editor.createBlock('text')
*/
Editor.prototype.createBlock = function createBlock (name, position) {
  const blockType = this._getBlockType(name)
  const id = Date.now()
  this._emit({
    type: 'create_block',
    name: blockType.name,
    version: blockType.version,
    data: blockType.initialData,
    state: blockType.initialState,
    id,
    position
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
  this._emit({ type: 'delete_block', id })
}

Editor.prototype._getBlockType = function getBlockType (name) {
  assert(this._blockTypes.has(name), `unknown block type with name '${name}'`)
  return this._blockTypes.get(name)
}
