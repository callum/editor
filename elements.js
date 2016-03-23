const yo = require('yo-yo')

module.exports.block = block
module.exports.main = main
module.exports.toolbar = toolbar

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

function main (editor, state) {
  if (!editor.blocks.length) return yo`<main>${toolbar(editor, state)}</main>`

  return yo`<main>
    ${editor.blocks.map(function (b) {
      var bar
      if (editor.state.toolbar === b.id) bar = toolbar(editor, state, b.id)
      return yo`<div>
        ${block(editor, b)}
        ${bar}
      </div>`
    })}
  </main>`
}

function toolbar (editor, state, position) {
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
    const id = editor.createBlock(name, position)
    editor.hideToolbar()
    editor._emit({ type: 'focus_block', id })
  }
}
