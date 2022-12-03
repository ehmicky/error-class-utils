[![Node](https://img.shields.io/badge/-Node.js-808080?logo=node.js&colorA=404040&logoColor=66cc33)](https://www.npmjs.com/package/error-class-utils)
[![Browsers](https://img.shields.io/badge/-Browsers-808080?logo=firefox&colorA=404040)](https://unpkg.com/error-class-utils?module)
[![TypeScript](https://img.shields.io/badge/-Typed-808080?logo=typescript&colorA=404040&logoColor=0096ff)](/src/main.d.ts)
[![Codecov](https://img.shields.io/badge/-Tested%20100%25-808080?logo=codecov&colorA=404040)](https://codecov.io/gh/ehmicky/error-class-utils)
[![Minified size](https://img.shields.io/bundlephobia/minzip/error-class-utils?label&colorA=404040&colorB=808080&logo=webpack)](https://bundlephobia.com/package/error-class-utils)
[![Mastodon](https://img.shields.io/badge/-Mastodon-808080.svg?logo=mastodon&colorA=404040&logoColor=9590F9)](https://fosstodon.org/@ehmicky)
[![Medium](https://img.shields.io/badge/-Medium-808080.svg?logo=medium&colorA=404040)](https://medium.com/@ehmicky)

Properly create error classes.

Useful utilities when creating custom error classes.

# Features

- Ponyfill
  [`error.cause`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)
  on
  [older Node.js and browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause#browser_compatibility)
- Properly [set `error.name`](#seterrornameerrorclass-name)
- Fix [issues](#ensurecorrectclasserror-newtarget) when `Error` has been
  polyfilled

# Example

<!-- eslint-disable fp/no-this, fp/no-class, fp/no-mutating-assign -->

```js
import {
  ensureCorrectClass,
  ponyfillCause,
  setErrorName,
} from 'error-class-utils'

export class CustomError extends Error {
  constructor(message, parameters) {
    super(message, parameters)

    // Fix some issues when `Error` has been polyfilled
    ensureCorrectClass(this, new.target)

    // Ponyfill `error.cause` on old Node.js/browsers
    ponyfillCause(this, parameters)
  }
}

// Properly set `error.name` as a non-enumerable and inherited property
setErrorName(CustomError, 'CustomError')
```

```js
import { CustomError } from './errors.js'

const cause = new Error('innerMessage')
const error = new CustomError('message', { cause })
console.log(error instanceof CustomError) // true
console.log(error.name) // 'CustomError'
console.log(error.cause) // Error: innerMessage ...
```

# Install

```bash
npm install error-class-utils
```

This package works in both Node.js >=14.18.0 and
[browsers](https://raw.githubusercontent.com/ehmicky/dev-tasks/main/src/browserslist).
It is an ES module and must be loaded using
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

class CustomError extends Error {
  constructor(message, parameters) {
    super(message, parameters)
    ensureCorrectClass(this, new.target)
  }
}

// Thanks to `ensureCorrectClass()`, this is now always true even when
// `Error` has been polyfilled
console.log(new CustomError('message') instanceof CustomError) // true
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

## setErrorName(ErrorClass, name)

`ErrorClass` `typeof Error`\
`name` `string`\
_Return value_: `void`

Set an `ErrorClass`'s
[`name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/name).

This must be performed on an error class, not instance. Unlike setting
`this.name = '...'` inside an error's constructor, this follows the native
`Error` classes' pattern where `error.name`:

- Ends with the `Error` suffix
- Matches the
  [constructor's `name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name)
- Is
  [inherited](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)
- Is
  [non-enumerable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)

<!-- eslint-disable fp/no-class -->

```js
import { setErrorName } from 'error-class-utils'

class CustomError extends Error {}
setErrorName(CustomError, 'CustomError')

console.log(CustomError.name) // 'CustomError'
console.log(CustomError.prototype.name) // 'CustomError'

const error = new CustomError('message')
console.log(error.name) // 'CustomError'
console.log(Object.keys(error).includes('name')) // false
```

# Related projects

- [`modern-errors`](https://github.com/ehmicky/modern-errors): Handle errors in
  a simple, stable, consistent way
- [`error-custom-class`](https://github.com/ehmicky/error-custom-class): Create
  one error class
- [`error-serializer`](https://github.com/ehmicky/error-serializer): Convert
  errors to/from plain objects
- [`normalize-exception`](https://github.com/ehmicky/normalize-exception):
  Normalize exceptions/errors
- [`is-error-instance`](https://github.com/ehmicky/is-error-instance): Check if
  a value is an `Error` instance
- [`merge-error-cause`](https://github.com/ehmicky/merge-error-cause): Merge an
  error with its `cause`
- [`set-error-class`](https://github.com/ehmicky/set-error-class): Properly
  update an error's class
- [`set-error-message`](https://github.com/ehmicky/set-error-message): Properly
  update an error's message
- [`wrap-error-message`](https://github.com/ehmicky/wrap-error-message):
  Properly wrap an error's message
- [`set-error-props`](https://github.com/ehmicky/set-error-props): Properly
  update an error's properties
- [`set-error-stack`](https://github.com/ehmicky/set-error-stack): Properly
  update an error's stack
- [`error-cause-polyfill`](https://github.com/ehmicky/error-cause-polyfill):
  Polyfill `error.cause`
- [`handle-cli-error`](https://github.com/ehmicky/handle-cli-error): 💣 Error
  handler for CLI applications 💥
- [`log-process-errors`](https://github.com/ehmicky/log-process-errors): Show
  some ❤ to Node.js process errors
- [`error-http-response`](https://github.com/ehmicky/error-http-response):
  Create HTTP error responses
- [`winston-error-format`](https://github.com/ehmicky/winston-error-format): Log
  errors with Winston

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
<table><tr><td align="center"><a href="https://fosstodon.org/@ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/error-class-utils/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/error-class-utils/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>
 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
