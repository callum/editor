const yo = require('yo-yo')

module.exports = text

function text (editor, block) {
  const errors = block.validate()
  if (errors && errors.length) console.log(errors)

  const textarea = yo`<textarea>${block.data.text}</textarea>`
  textarea.oninput = handleInput
  textarea.onkeydown = handleKeyDown
  textarea.onfocus = block.focus.bind(block)
  textarea.onblur = block.blur.bind(block)

  if (editor.state.focus === block.id) textarea.focus()

  return textarea

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
