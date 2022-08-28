export const validateError = function (error) {
  if (!(error instanceof Error)) {
    throw new TypeError(`First argument must be an error instance: ${error}`)
  }
}
