import {
  expectType,
  expectError,
  expectAssignable,
  expectNotAssignable,
} from 'tsd'

import {
  ponyfillCause,
  ensureCorrectClass,
  ErrorParams,
  sanitizeProperties,
  setErrorName,
} from './main.js'

const error = new Error('test')

expectType<void>(ponyfillCause(error))
ponyfillCause(error, {})
ponyfillCause(error, null)
expectError(ponyfillCause({}, {}))

expectType<void>(ensureCorrectClass(error, Error))
expectError(ensureCorrectClass(error))
expectError(ensureCorrectClass(error, null))
expectError(ensureCorrectClass({}, Error))

expectType<ErrorParams>(sanitizeProperties())
sanitizeProperties({})
expectAssignable<ErrorParams>({})
sanitizeProperties({ prop: true })
expectAssignable<ErrorParams>({ prop: true })
const symbol = Symbol('test')
sanitizeProperties({ [symbol]: true })
expectAssignable<ErrorParams>({ [symbol]: true })
expectError(sanitizeProperties(null))
expectNotAssignable<ErrorParams>(null)
expectType<1>(sanitizeProperties({ a: 1 } as const).a)

expectType<void>(setErrorName(Error, 'TestError'))
expectError(setErrorName(Error))
expectError(setErrorName(Error, 'Test'))
expectError(setErrorName(Error, 'testerror'))
expectError(setErrorName(error, 'TestError'))
