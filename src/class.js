import { isObject } from './is_object.js'
import { validateError } from './validate.js'

// If the global `Error` class was monkey-patched, it is likely to return an
// `Error` instance.
//   - Returning a value from a constructor is a bad practice since it changes
//     the prototype of the new instance.
//   - This means `instanceof` or `constructor` checks will fail, and child
//     prototype properties will not be inherited
// A common library that does this is `error-cause` which polyfills
// `error.cause`.
// We fix this by detecting such situation and re-setting the prototype.
// We use `new.target` so that this works even if `CustomErrorClass` is
// subclassed itself.
export const ensureCorrectClass = function (error, newTarget) {
  validateError(error)
  validateNewTarget(newTarget)

  const newTargetProto = newTarget.prototype

  if (Object.getPrototypeOf(error) !== newTargetProto) {
    // eslint-disable-next-line fp/no-mutating-methods
    Object.setPrototypeOf(error, newTargetProto)
  }

  if (
    typeof newTargetProto.constructor === 'function' &&
    error.constructor !== newTargetProto.constructor
  ) {
    // eslint-disable-next-line fp/no-delete
    delete error.constructor
  }
}

const validateNewTarget = function (newTarget) {
  if (newTarget === undefined) {
    throw new TypeError(
      "This must be called directly inside the class's constructor.",
    )
  }

  if (typeof newTarget !== 'function' || !isObject(newTarget.prototype)) {
    throw new TypeError('The second argument must be `new.target`.')
  }
}
