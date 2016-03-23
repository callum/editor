const xtend = require('xtend')

module.exports = modifier

function modifier (action, state) {
  if (action.type === 'show_toolbar') {
    state.toolbar = action.position
  }

  if (action.type === 'hide_toolbar') {
    state.toolbar = null
  }

  if (action.type === 'create_block') {
    var targetIndex = state.blocks.length
    if (typeof action.position !== 'undefined') {
      targetIndex = state.blocks.findIndex(function (b) {
        return b.id === action.position
      }) + 1
    }
    state.blocks.splice(targetIndex, 0, {
      id: action.id,
      name: action.name,
      version: action.version,
      data: action.data,
      state: action.state
    })
  }

  if (action.type === 'delete_block') {
    state.blocks = state.blocks.filter(function (b) {
      return b.id !== action.id
    })
  }

  if (action.type === 'update_block_data') {
    const block = state.blocks.find(function (b) {
      return b.id === action.id
    })
    block.data = xtend(block.data, action.data)
  }

  if (action.type === 'update_block_state') {
    const block = state.blocks.find(function (b) {
      return b.id === action.id
    })
    block.state = xtend(block.state, action.state)
  }

  if (action.type === 'focus_block') {
    state.focus = action.id
  }

  if (action.type === 'blur_block') {
    state.focus = null
  }

  return state
}
