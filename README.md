# editor

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

[index.js:24-37](https://github.com/callum/editor-prototype/blob/94cdf4b522a278f885dee0bf85a3d599a2fc308a/index.js#L24-L37 "Source code on GitHub")

Create an editor

**Parameters**

-   `initialState` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** optional initial state

**Examples**

```javascript
const editor = new Editor()
```

#### addBlockType

[index.js:51-58](https://github.com/callum/editor-prototype/blob/94cdf4b522a278f885dee0bf85a3d599a2fc308a/index.js#L51-L58 "Source code on GitHub")

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

[index.js:67-75](https://github.com/callum/editor-prototype/blob/94cdf4b522a278f885dee0bf85a3d599a2fc308a/index.js#L67-L75 "Source code on GitHub")

Create block

**Parameters**

-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** – block type name

**Examples**

```javascript
const editor = new Editor()
editor.createBlock('text')
```

#### deleteBlock

[index.js:84-87](https://github.com/callum/editor-prototype/blob/94cdf4b522a278f885dee0bf85a3d599a2fc308a/index.js#L84-L87 "Source code on GitHub")

Delete block

**Parameters**

-   `id` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** id of the block to delete

**Examples**

```javascript
const editor = new Editor()
editor.deleteBlock(123)
```

#### updateBlock

[index.js:97-101](https://github.com/callum/editor-prototype/blob/94cdf4b522a278f885dee0bf85a3d599a2fc308a/index.js#L97-L101 "Source code on GitHub")

Update block data

**Parameters**

-   `id` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** id of the block to update
-   `data` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

**Examples**

```javascript
const editor = new Editor()
editor.updateBlock(123, { text: 'abc' })
```

#### validate

[index.js:110-116](https://github.com/callum/editor-prototype/blob/94cdf4b522a278f885dee0bf85a3d599a2fc308a/index.js#L110-L116 "Source code on GitHub")

Validate all block data

**Examples**

```javascript
const editor = new Editor()
editor.validate()
```

Returns **[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

#### validateBlock

[index.js:129-143](https://github.com/callum/editor-prototype/blob/94cdf4b522a278f885dee0bf85a3d599a2fc308a/index.js#L129-L143 "Source code on GitHub")

Validate block data

**Parameters**

-   `block` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `block.data` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** data to validate
    -   `block.name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** name of the block type to validate against

**Examples**

```javascript
const editor = new Editor()
const block = { name: 'text', data: { text: 'abc' } }
editor.validateBlock(block)
```

Returns **([Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)\|[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array))** an array of errors if there are any, otherwise `true`
