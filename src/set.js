// Error properties are not enumerable
export const setNonEnumProp = (object, propName, value) => {
  Object.defineProperty(object, propName, {
    value,
    writable: true,
    enumerable: false,
    configurable: true,
  })
}
