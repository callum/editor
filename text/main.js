const hyperx = require('hyperx')
const hx = hyperx(require('virtual-dom/h'))

module.exports = text

function text (editor, state) {
  const errors = editor.validateBlock(state.data, 'text')
  if (errors) console.log(errors)

  return hx`<textarea oninput=${updateBlock} value=${state.data.text}></textarea>`

  function updateBlock (event) {
    editor.updateBlock(state.id, { text: event.target.value })
  }
}
