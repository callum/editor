const yo = require('yo-yo')

module.exports = text

function text (editor, block) {
  const errors = block.validate()
  if (errors && errors.length) console.log(errors)

  return yo`<textarea autofocus oninput=${handleInput} onkeydown=${handleKeyDown}>${block.data.text}</textarea>`

  function handleInput (event) {
    block.updateData({ text: event.target.value })
  }

  function handleKeyDown (event) {
    if (event.keyCode === 13) {
      editor.showToolbar(block.id)
      event.preventDefault()
    }
  }
}
