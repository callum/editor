const yo = require('yo-yo')

module.exports = text

function text (editor, state) {
  const errors = editor.validateBlock(state.id)
  if (errors && errors.length) console.log(errors)

  const textarea = yo`<textarea
    oninput=${handleInput}
    onkeydown=${handleKeyDown}
    onfocus=${handleFocus}
    onblur=${handleBlur}>${state.data.text}</textarea>`

  if (editor.state.focus === state.id) textarea.focus()

  return textarea

  function handleInput (event) {
    editor.updateBlock(state.id, { text: event.target.value })
  }

  function handleKeyDown (event) {
    if (event.keyCode === 13) {
      editor.showToolbar(state.id)
      event.preventDefault()
    }
  }

  function handleFocus () {
    editor.focusBlock(state.id)
  }

  function handleBlur () {
    editor.defocusBlock()
  }
}
