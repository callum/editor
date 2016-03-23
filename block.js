const assert = require('assert')
const equal = require('deep-equal')

module.exports = Block

/**
* Instantiate a block
* @param {Object} editor - associated editor instance
* @param {Object} block - plain block object
* @example
* const editor = new Editor()
*/
function Block (editor, block) {
  assert.equal(typeof block, 'object', 'block must be an object')
  for (var p in block) {
    if (block.hasOwnProperty(p)) Object.defineProperty(this, p, { value: block[p] })
  }
  this.editor = editor
}

/**
* Focus block
* @example
* const editor = new Editor()
* const block = editor.blocks.find(b => b.id === 123)
* block.focus()
*/
Block.prototype.focus = function focus () {
  this.editor._emit({ type: 'FOCUS_BLOCK', id: this.id })
}

/**
* Blur block
* @example
* const editor = new Editor()
* const block = editor.blocks.find(b => b.id === 123)
* block.blur()
*/
Block.prototype.blur = function blur () {
  this.editor._emit({ type: 'blur_block', id: this.id })
}

/**
* Update block data
* @param {Object} data
* @example
* const editor = new Editor()
* const block = editor.blocks.find(b => b.id === 123)
* block.updateData({ text: 'abc' })
*/
Block.prototype.updateData = function updateData (data) {
  assert.equal(typeof data, 'object', 'data must be an object')
  this.editor._emit({
    type: 'update_block_data',
    version: this.version,
    id: this.id,
    data
  })
}

/**
* Update block state
* @param {Object} state
* @example
* const editor = new Editor()
* const block = editor.blocks.find(b => b.id === 123)
* block.updateState({ edit: true })
*/
Block.prototype.updateState = function updateState (state) {
  assert.equal(typeof state, 'object', 'state must be an object')
  this.editor._emit({
    type: 'update_block_state',
    version: this.version,
    id: this.id,
    state
  })
}

/**
* Validate block data
* @return {Boolean|Array} an array of errors if there are any, otherwise `true`
* @example
* const editor = new Editor()
* const block = editor.blocks.find(b => b.id === 123)
* block.validate()
*/
Block.prototype.validate = function validate () {
  const blockType = this.editor._getBlockType(this.name)
  if (equal(this.data, blockType.initialData)) return true
  const check = this.editor._validators.get(blockType.name)
  check(this.data)
  if (check.errors && check.errors.length) return check.errors
  return true
}
