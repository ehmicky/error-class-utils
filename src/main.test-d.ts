import {
  ponyfillCause,
  ensureCorrectClass,
  setErrorName,
} from 'error-class-utils'
import { expectType } from 'tsd'

const error = new Error('test')

expectType<void>(ponyfillCause(error))
ponyfillCause(error, {})
ponyfillCause(error, null)
// @ts-expect-error
ponyfillCause({}, {})

expectType<void>(ensureCorrectClass(error, Error))
// @ts-expect-error
ensureCorrectClass(error)
// @ts-expect-error
ensureCorrectClass(error, null)
// @ts-expect-error
ensureCorrectClass({}, Error)

expectType<void>(setErrorName(Error, 'TestError'))
// @ts-expect-error
setErrorName(Error)
// @ts-expect-error
setErrorName(Error, 'Test')
// @ts-expect-error
setErrorName(Error, 'testerror')
// @ts-expect-error
setErrorName(error, 'TestError')
