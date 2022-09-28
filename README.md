<h2 align='center'>
 React async lazy list (WIP)
</h2>

<h3 align='center'>
A lite, customizable and fast async list render component for React.
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

## Install

```bash
npm i react-async-lazy-list
```

or

```bash
yarn add react-async-lazy-list
```

## Usage

```jsx
import React from 'react'
import LazyList from 'react-async-lazy-list'

function App() {
  return (
    <div>
      <LazyList renderer={() => {}}/>
    </div>
  )
}
```

### Properties

Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
`renderer`|Function|yes|[]|

-----

## Contributing
---

Fee free to open a pull request with detailed title/description about the feature.

For reporting any bug/issues make sure to add a detailed bug reproduction process(a sandbox link if possible) in the description.
## License

MIT © [sawrozpdl](https://github.com/sawrozpdl)