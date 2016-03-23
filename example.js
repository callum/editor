const Editor = require('./')

const editor = new Editor()
window.editor = editor
editor.addBlockType(require('./text'))
document.body.appendChild(editor.element)
