const xtend = require('xtend')

module.exports = modifier

function modifier (action, state) {
  if (action.type === 'SHOW_TOOLBAR') {
    return xtend(state, { toolbar: action.position })
  }

  if (action.type === 'HIDE_TOOLBAR') {
    return xtend(state, { toolbar: null })
  }

  if (action.type === 'CREATE_BLOCK') {
    var targetIndex = state.blocks.length
    if (typeof action.position !== 'undefined') {
      targetIndex = state.blocks.findIndex(function (block) {
        return block.id === action.position
      }) + 1
    }
    return xtend(state, {
      blocks: state.blocks.slice(0, targetIndex)
        .concat([{
          id: action.id,
          name: action.name,
          version: action.version,
          data: action.data,
          state: action.state
        }])
        .concat(state.blocks.slice(targetIndex))
    })
  }

  if (action.type === 'DELETE_BLOCK') {
    return xtend(state, {
      blocks: state.blocks.filter(function (block) {
        return block.id !== action.id
      })
    })
  }

  if (action.type === 'UPDATE_BLOCK_DATA') {
    return xtend(state, {
      blocks: state.blocks.map(function (block) {
        if (block.id === action.id) {
          return xtend(block, {
            version: action.version,
            data: xtend(block.data, action.data)
          })
        }
        return block
      })
    })
  }

  if (action.type === 'UPDATE_BLOCK_STATE') {
    return xtend(state, {
      blocks: state.blocks.map(function (block) {
        if (block.id === action.id) {
          return xtend(block, {
            version: action.version,
            state: xtend(block.state, action.state)
          })
        }
        return block
      })
    })
  }

  if (action.type === 'FOCUS_BLOCK') {
    return xtend(state, { focus: action.id })
  }

  if (action.type === 'BLUR_BLOCK') {
    return xtend(state, { focus: null })
  }
}
