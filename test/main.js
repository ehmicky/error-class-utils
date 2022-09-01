import test from 'ava'
import errorClassUtils from 'error-class-utils'

test('Dummy test', (t) => {
  t.true(errorClassUtils(true))
})
