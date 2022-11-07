import { expectType, expectError } from 'tsd'

import { ponyfillCause, ensureCorrectClass, setErrorName } from 'error-class-utils'

const error = new Error('test')

expectType<void>(ponyfillCause(error))
ponyfillCause(error, {})
ponyfillCause(error, null)
expectError(ponyfillCause({}, {}))

expectType<void>(ensureCorrectClass(error, Error))
expectError(ensureCorrectClass(error))
expectError(ensureCorrectClass(error, null))
expectError(ensureCorrectClass({}, Error))

expectType<void>(setErrorName(Error, 'TestError'))
expectError(setErrorName(Error))
expectError(setErrorName(Error, 'Test'))
expectError(setErrorName(Error, 'testerror'))
expectError(setErrorName(error, 'TestError'))
