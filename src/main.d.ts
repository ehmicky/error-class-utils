/**
 * Some `Error` polyfills (such as
 * [`es-shims/error-cause`](https://github.com/es-shims/error-cause)) prevent
 * extending from it. This fixes it.
 *
 * The second argument must be
 * [`new.target`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target).
 * This must be called directly inside a class constructor, after
 * [`super(message, parameters)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super).
 *
 * @example
 * ```js
 * class CustomError extends Error {
 *   constructor(message, parameters) {
 *     super(message, parameters)
 *     ensureCorrectClass(this, new.target)
 *   }
 * }
 *
 * // Thanks to `ensureCorrectClass()`, this is now always true even when
 * // `Error` has been polyfilled
 * console.log(new CustomError('message') instanceof CustomError) // true
 * ```
 */
export function ensureCorrectClass(error: Error, newTarget: Function): void

/**
 * Ponyfills
 * [`error.cause`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)
 * on
 * [older Node.js and browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause#browser_compatibility).
 *
 * This must be called inside a class constructor, after
 * [`super(message, parameters)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super).
 *
 * @example
 * ```js
 * class CustomError extends Error {
 *   constructor(message, parameters) {
 *     super(message, parameters)
 *     ponyfillCause(this, parameters)
 *   }
 * }
 *
 * try {
 *   throw new Error('innerMessage')
 * } catch (cause) {
 *   // Works on any platforms thanks to ponyfill
 *   const error = new CustomError('message', { cause })
 *   console.log(error.cause.message) // 'innerMessage'
 * }
 * ```
 */
export function ponyfillCause(error: Error, parameters?: unknown): void

/**
 * Parameters passed to `new CustomError('message', params)`
 */
export interface ErrorParams {
  [param: string | symbol]: unknown
}

/**
 * Sanitize a `properties` object meant to be set as error properties.
 * A shallow copy of `properties` is returned excluding any property that:
 *
 *  - Overrides core error properties (like
 *    [`message`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message))
 *  - Pollutes prototype (like
 *    [`toString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/toString))
 *  - Is
 *    [non-enumerable or inherited](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)
 *
 * @example
 * ```js
 * class CustomError extends Error {
 *   constructor(message, parameters) {
 *     super(message, parameters)
 *     Object.assign(this, sanitizeProperties(parameters?.props))
 *   }
 * }
 *
 * const error = new CustomError('message', {
 *   props: {
 *     example: true,
 *     message: 'ignoredMessage',
 *     toString: () => 'prototypePollution',
 *   },
 * })
 * console.log(error.example) // true
 * console.log(error.message) // 'message'
 * console.log(error.toString()) // not 'prototypePollution'
 * ```
 */
export function sanitizeProperties<
  ErrorParamsArg extends ErrorParams = ErrorParams,
>(properties?: ErrorParamsArg): ErrorParamsArg

/**
 * Error class name
 */
export type ErrorName = `${string}Error`

/**
 * Set an `ErrorClass`'s
 * [`name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/name).
 *
 * This must be performed on an error class, not instance. Unlike setting
 * `this.name = '...'` inside an error's constructor, this follows the native
 * `Error` classes' pattern where `error.name`:
 *
 *  - Ends with the `Error` suffix
 *  - Matches the
 *    [constructor's `name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name)
 *  - Is
 *    [inherited](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)
 *  - Is
 *    [non-enumerable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties)
 *
 * @example
 * ```js
 * class CustomError extends Error {}
 * setErrorName(CustomError, 'CustomError')
 *
 * console.log(CustomError.name) // 'CustomError'
 * console.log(CustomError.prototype.name) // 'CustomError'
 *
 * const error = new CustomError('message')
 * console.log(error.name) // 'CustomError'
 * console.log(Object.keys(error).includes('name')) // false
 * ```
 */
export function setErrorName(ErrorClass: Function, name: ErrorName): void
