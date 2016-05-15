const Editor = require('./')

const editor = new Editor()
editor.addBlockType(require('./text'))
document.body.appendChild(editor.element)
