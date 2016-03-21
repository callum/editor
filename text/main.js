const hyperx = require('hyperx')
const hx = hyperx(require('virtual-dom/h'))

module.exports = text

function text (editor, state) {
  const errors = editor.validateBlock(state.id)
  if (errors && errors.length) console.log(errors)

  return hx`<textarea
    oninput=${handleInput}
    onkeydown=${handleKeyDown}
    value=${state.data.text}></textarea>`

  function handleInput (event) {
    editor.updateBlock(state.id, { text: event.target.value })
  }

  function handleKeyDown (event) {
    console.log(event.keyCode)

    if (event.keyCode === 13) {
      editor._app.store({ type: 'SHOW_TOOLBAR', blockId: state.id })
      event.preventDefault()
    }
  }
}
