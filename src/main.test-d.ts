import { expectType, expectAssignable } from 'tsd'

import errorClassUtils, { Options } from './main.js'

expectType<object>(errorClassUtils(true))

errorClassUtils(true, {})
expectAssignable<Options>({})
