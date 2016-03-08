const Editor = require('./')

const editor = new Editor({
  blocks: [
    { id: 0, name: 'text', data: { text: 'foo' } },
    { id: 1, name: 'text', data: { text: 'bar' } },
    { id: 2, name: 'text', data: { text: 'baz' } }
  ]
})
editor.addBlockType(require('./text'))
document.body.appendChild(editor.tree)
