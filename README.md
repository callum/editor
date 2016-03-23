# editor

-   [x] block schema and validation
-   [x] CRUD blocks
-   [x] documented public API
-   [x] self-contained editor constructor
-   [x] state-driven user interface
-   [x] versioned block types
-   [x] block type state management
-   [ ] block type primitives
-   [ ] contributing guide
-   [ ] customisable styling
-   [ ] i18n
-   [ ] rich-text editing
-   [ ] tests
-   [ ] undo

## example

```js
const Editor = require('editor')

const editor = new Editor({
  blocks: [
    { id: 0, name: 'text', data: { text: 'hello' } },
    { id: 1, name: 'text', data: { text: 'world' } },
  ]
})
editor.addBlockType(require('./text'))
document.body.appendChild(editor.tree)
```

## api

### Editor

Instantiate an editor

**Parameters**

-   `initialState` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** optional initial state

**Examples**

```javascript
const editor = new Editor()
```

#### addBlockType

Add block type

**Parameters**

-   `blockType` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `blockType.name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – block type name
    -   `blockType.version` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – block type version
    -   `blockType.main` **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)** – block type function
    -   `blockType.schema` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** – block type schema
    -   `blockType.initialData` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** – block type initial data
    -   `blockType.initialState` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** – block type initial state

**Examples**

```javascript
const editor = new Editor()
editor.addBlockType(require('editor/text'))
```

#### createBlock

Create block

**Parameters**

-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – block type name
-   `position` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** – id of block to position after

**Examples**

```javascript
const editor = new Editor()
editor.createBlock('text')
```

Returns **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** id of the block

#### deleteBlock

Delete block

**Parameters**

-   `id` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** id of the block to delete

**Examples**

```javascript
const editor = new Editor()
editor.deleteBlock(123)
```

#### hideToolbar

Hide toolbar

**Examples**

```javascript
const editor = new Editor()
editor.hideToolbar()
```

#### showToolbar

Show toolbar

**Parameters**

-   `position` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** id of the block to position after

**Examples**

```javascript
const editor = new Editor()
editor.showToolbar(123)
```

#### blocks

Get blocks

**Examples**

```javascript
const editor = new Editor()
editor.blocks
```

#### element

Get editor DOM element

**Examples**

```javascript
const editor = new Editor()
document.body.appendChild(editor.element)
```

#### state

Get editor state

**Examples**

```javascript
const editor = new Editor()
editor.state
```

### Block

Instantiate a block

**Parameters**

-   `editor` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** associated editor instance
-   `block` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** plain block object

**Examples**

```javascript
const editor = new Editor()
```

#### blur

Blur block

**Examples**

```javascript
const editor = new Editor()
const block = editor.blocks.find(b => b.id === 123)
block.blur()
```

#### focus

Focus block

**Examples**

```javascript
const editor = new Editor()
const block = editor.blocks.find(b => b.id === 123)
block.focus()
```

#### updateData

Update block data

**Parameters**

-   `data` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

**Examples**

```javascript
const editor = new Editor()
const block = editor.blocks.find(b => b.id === 123)
block.updateData({ text: 'abc' })
```

#### updateState

Update block state

**Parameters**

-   `state` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

**Examples**

```javascript
const editor = new Editor()
const block = editor.blocks.find(b => b.id === 123)
block.updateState({ edit: true })
```

#### validate

Validate block data

**Examples**

```javascript
const editor = new Editor()
const block = editor.blocks.find(b => b.id === 123)
block.validate()
```

Returns **([Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)\|[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array))** an array of errors if there are any, otherwise `true`
