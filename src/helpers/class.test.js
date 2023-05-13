// eslint-disable-next-line ava/no-ignored-test-files
import test from 'ava'
import { ensureCorrectClass } from 'error-class-utils'
import { each } from 'test-each'

const TestError = class extends Error {
  constructor(...args) {
    super(...args)
    // eslint-disable-next-line fp/no-this
    ensureCorrectClass(this, new.target)
    // eslint-disable-next-line fp/no-this, fp/no-mutation
    this.one = true
  }
}
const testError = new TestError('test')
const ChildError = class extends TestError {}
const childError = new ChildError('test')

each(
  [
    { error: testError, CustomErrorClass: TestError },
    { error: childError, CustomErrorClass: ChildError },
  ],
  ({ title }, { error, CustomErrorClass }) => {
    test(`Polyfilled error keeps constructor behavior | ${title}`, (t) => {
      t.true(error.one)
    })

    test(`Polyfilled error is instanceof Error | ${title}`, (t) => {
      t.true(error instanceof Error)
    })

    test(`Polyfilled error is instanceof custom Error | ${title}`, (t) => {
      t.true(error instanceof TestError)
    })

    test(`Polyfilled error has right constructor | ${title}`, (t) => {
      t.is(error.constructor, CustomErrorClass)
    })
  },
)

test('Polyfilled error can be subclassed', (t) => {
  t.true(childError instanceof ChildError)
})

const invalidNewTarget = () => {}
// eslint-disable-next-line fp/no-mutation
invalidNewTarget.prototype = { constructor: true }

test('Handles invalid prototype.constructor', (t) => {
  const error = new Error('test')
  error.constructor = Error
  ensureCorrectClass(error, invalidNewTarget)
  t.is(error.constructor, Error)
})

each(
  [[{}, Error], [childError], [childError, null], [childError, () => {}]],
  ({ title }, args) => {
    test(`Validate the arguments | ${title}`, (t) => {
      t.throws(ensureCorrectClass.bind(undefined, ...args))
    })
  },
)
