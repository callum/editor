# editor

-   [x] block schema and validation
-   [x] CRUD blocks
-   [x] documented public API
-   [x] self-contained editor constructor
-   [x] state-driven user interface
-   [x] versioned block types
-   [ ] block type primitives
-   [ ] block type state management
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

Create an editor

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

**Examples**

```javascript
const editor = new Editor()
editor.addBlockType(require('editor/text'))
```

#### createBlock

Create block

**Parameters**

-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – block type name

**Examples**

```javascript
const editor = new Editor()
editor.createBlock('text')
```

#### deleteBlock

Delete block

**Parameters**

-   `id` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** id of the block to delete

**Examples**

```javascript
const editor = new Editor()
editor.deleteBlock(123)
```

#### updateBlock

Update block data

**Parameters**

-   `id` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** id of the block to update
-   `data` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

**Examples**

```javascript
const editor = new Editor()
editor.updateBlock(123, { text: 'abc' })
```

#### validateBlock

Validate block data

**Parameters**

-   `id` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** id of the block to validate

**Examples**

```javascript
const editor = new Editor()
editor.validateBlock(123)
```

Returns **([Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)\|[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array))** an array of errors if there are any, otherwise `true`

#### state

Get editor state

**Examples**

```javascript
const editor = new Editor()
editor.state
```

#### tree

Get editor DOM tree

**Examples**

```javascript
const editor = new Editor()
document.body.appendChild(editor.tree)
```
