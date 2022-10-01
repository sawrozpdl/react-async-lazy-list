<h2 align='center'>
 React async lazy list (Beta)
</h2>

<h3 align='center'>
A lite, customizable and fast async list render component powered by windowing implementation for React 
</h3>

---

<p align="center">
  <a href="https://www.npmjs.com/package/react-async-lazy-list">
    <img alt= "NPM" src="https://img.shields.io/npm/v/react-async-lazy-list.svg">
  </a>
  <a href="https://standardjs.com">
    <img alt="JavaScript Style Guide" src="https://img.shields.io/badge/code_style-standard-brightgreen.svg">
  </a>
  <a href="https://github.com/sawrozpdl/react-async-lazy-list/actions?query=workflow%3A%22Node.js+CI%22">
    <img alt="Github Actions CI Status" src="https://github.com/sawrozpdl/react-async-lazy-list/actions/workflows/main.yml/badge.svg">
  </a>
  <a href="https://codeclimate.com/github/sawrozpdl/react-async-lazy-list/maintainability">
    <img alt= "Maintainability" src="https://api.codeclimate.com/v1/badges/a99a88d28ad37a79dbf6/maintainability">
  </a>
</p>

## Demo

![demo-gif](https://media1.tenor.com/images/9b11aebc9852b575a2eb5f8505403a30/tenor.gif)

[View on gh-pages](https://sawrozpdl.github.io/react-async-lazy-list)
## Installation

```bash
npm i react-async-lazy-list
```

or

```bash
yarn add react-async-lazy-list
```

## Usage

```tsx
import React from 'react'
import LazyList from 'react-async-lazy-list'

const BUFFER_SIZE = 10; // Size of data to load/pre-load

const loadData = (idx: number): Promise<Node[]> =>
  fetchData("some_url", {
    page: (idx + 1),
    size: BUFFER_SIZE 
  })

function App() {
  return (
    <div>
       <LazyList
          classes={
            root: "lazy-list-container"
          }
          dataLoader={loadData}
          renderFunction={
            (node: Node) => <NodeItem node={node} />
          }
          dividerComponent={<Divider />}
          loadingComponent={
            <Loader
              height="80"
              width="100%"
            />
          }
          footerComponent={
            <Footer label="No more records!" />
          }
        />
    </div>
  )
}
```

### Properties

Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
`dataLoader`|Function|yes|-|function to fetch a Node array in batch.
`renderFunction`|Function|yes|-|function to render a Node
`classes`|Object|no|-|
`options`|Object|no|-| Basic configuration


-----
as well as custom components like 
`footerComponent`, `dividerComponent` and `loadingComponent`  (all optional tho no defaults as of now)

Supported classNames (`props.classes`)
- root
- loadingContainer
- nodeContainer
- groupContainer
- footerContainer

----

### Options
Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
`bufferOffset`|number|no|50|Pre fetch/buffer size in pixels
`scrollThrottle`|number|no|60|Limit scroll event process with at most 1 fires every X ms.

## Description
This component uses windowing techniques to virtualize huge lists with minium renders. the user gets to decide the number of data to render each time instead of height assumptions and thus, this supports more flexibility when it comes to leaf components of any sizes/kinds.

## Contributing
---

Fee free to open a pull request with detailed title/description about the feature.

For reporting any bug/issues make sure to add a detailed bug reproduction process(a sandbox link if possible) in the description.
## License

MIT © [sawrozpdl](https://github.com/sawrozpdl)