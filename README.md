[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/error-class-utils.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/error-class-utils)
[![TypeScript](https://img.shields.io/badge/-typed-brightgreen?logo=typescript&colorA=gray&logoColor=0096ff)](/src/main.d.ts)
[![Node](https://img.shields.io/node/v/error-class-utils.svg?logo=node.js&logoColor=66cc33)](https://www.npmjs.com/package/error-class-utils)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-brightgreen.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-brightgreen.svg?logo=medium)](https://medium.com/@ehmicky)

Properly create error classes.

Set of utilities that are useful when creating custom error classes.

# Features

# Example

<!-- eslint-disable fp/no-this, fp/no-class -->

```js
import {
  ensureCorrectClass,
  ponyfillCause,
  setErrorName,
  sanitizeProperties,
} from 'error-class-utils'

export class CustomError extends Error {
  constructor(message, parameters) {
    super(message, parameters)
    ensureCorrectClass(this, new.target)
    ponyfillCause(this, parameters)
    const props = sanitizeProperties(parameters?.props)
    // eslint-disable-next-line fp/no-mutating-assign
    Object.assign(this, props)
  }
}
setErrorName(CustomError, name)
```

```js
import { CustomError } from './errors.js'

const cause = new Error('causeMessage')
const error = new CustomError('exampleMessage', {
  cause,
  props: { example: true },
})
console.log(error instanceof CustomError) // true
console.log(error.name) // 'CustomError'
console.log(error.cause) // Error: causeMessage ...
console.log(error.example) // true
```

# Install

```bash
npm install error-class-utils
```

This package is an ES module and must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`.

# API

## ensureCorrectClass(error, new.target)

`error` `Error`\
`new.target` `typeof Error`\
_Return value_: `void`

Some `Error` polyfills (such as
[`es-shims/error-cause`](https://github.com/es-shims/error-cause)) prevent
extending from it. This fixes it.

The second argument must be
[`new.target`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target).
This must be called directly inside a class constructor, after
[`super(message, parameters)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super).

<!-- eslint-disable fp/no-class, fp/no-this -->

```js
import { ensureCorrectClass } from 'error-class-utils'

export class CustomError extends Error {
  constructor(message, parameters) {
    super(message, parameters)
    ensureCorrectClass(this, new.target)
  }
}

// Thanks to `ensureCorrectClass()`, this is now always true even when
// `Error` has been polyfilled
console.log(new CustomError('message', { cause }) instanceof CustomError)
```

## ponyfillCause(error, parameters?)

`error` `Error`\
`parameters` `ErrorParams?`\
_Return value_: `void`

Ponyfills
[`error.cause`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)
on
[older Node.js and browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause#browser_compatibility).

This must be called inside a class constructor, after
[`super(message, parameters)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super).

<!-- eslint-disable fp/no-class, fp/no-this -->

```js
import { ponyfillCause } from 'error-class-utils'

class CustomError extends Error {
  constructor(message, parameters) {
    super(message, parameters)
    ponyfillCause(this, parameters)
  }
}

try {
  throw new Error('innerMessage')
} catch (cause) {
  // Works on any platforms thanks to ponyfill
  const error = new CustomError('message', { cause })
  console.log(error.cause.message) // 'innerMessage'
}
```

## sanitizeProperties(properties?)

`properties` `ErrorParams?`\
_Return value_: `ErrorParams`

Sanitize a `properties` object meant to be set as error properties. A copy of
`properties` is returned excluding any property that:

- Overrides core error properties (like
  [`message`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message))
- Pollutes prototype (like
  [`toString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/toString))
- Is
  [non-enumerable or inherited](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)
- Throws when being retrieved, due to invalid
  [getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)
  or
  [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

<!-- eslint-disable fp/no-class, fp/no-this, fp/no-get-set -->

```js
import { sanitizeProperties } from 'error-class-utils'

class CustomError extends Error {
  constructor(message, parameters) {
    super(message, parameters)
    // eslint-disable-next-line fp/no-mutating-assign
    Object.assign(this, sanitizeProperties(parameters?.props))
  }
}

const error = new CustomError('exampleMessage', {
  props: {
    example: true,
    message: 'ignoredMessage',
    toString: () => 'prototypePollution',
    get unsafeProperty() {
      throw new Error('unsafe property')
    },
  },
})
console.log(error.example) // true
console.log(error.message) // 'exampleMessage'
console.log(error.toString()) // 'CustomError: exampleMessage'
```

## setErrorName(ErrorClass, name)

`ErrorClass` `typeof Error`\
`name` `string`\
_Return value_: `void`

Set an `ErrorClass`'s
[`name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/name).

This must be performed on an error class, not instance. Unlike using `this.name`
inside an error's constructor, this follows the pattern used by the native
`Error` classes where `error.name` should:

- End with the `Error` suffix
- Match the
  [constructor's `name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name)
- Be
  [inherited](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)
- Be
  [non-enumerable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)

<!-- eslint-disable fp/no-class -->

```js
import { setErrorName } from 'error-class-utils'

class CustomError extends Error {}
setErrorName(CustomError, 'CustomError')

console.log(CustomError.name) // 'CustomError'
console.log(CustomError.prototype.name) // 'CustomError'

const error = new Error('test')
console.log(error.name) // 'CustomError'
console.log(Object.keys(error).includes('name')) // false
```

# Related projects

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<!--
<table><tr><td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/error-class-utils/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/error-class-utils/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>
 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
