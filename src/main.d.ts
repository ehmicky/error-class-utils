/**
 *
 * @example
 * ```js
 * ```
 */
export function ponyfillCause(error: Error, parameters?: unknown): void

/**
 *
 * @example
 * ```js
 * ```
 */
export function ensureCorrectClass(error: Error, newTarget: Function): void

/**
 * Parameters passed to `new CustomError('message', params)`
 */
export interface ErrorParams {
  [param: string | symbol]: unknown
}

/**
 *
 * @example
 * ```js
 * ```
 */
export function sanitizeProperties<
  ErrorParamsArg extends ErrorParams = ErrorParams,
>(props?: ErrorParamsArg): ErrorParamsArg

/**
 * Error class name
 */
export type ErrorName = `${string}Error`

/**
 *
 * @example
 * ```js
 * ```
 */
export function setErrorName(ErrorClass: Function, name: ErrorName): void
