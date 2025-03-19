/**
 *
 */
function extendPrototype(sources: any[], destination: any) {
  const { length } = sources
  for (let i = 0; i < length; i++) {
    const jLen = Object.getOwnPropertyNames(sources[i].prototype).length
    for (let j = 0; j < jLen; j++) {
      ;(destination.prototype as any)[
        Object.getOwnPropertyNames(sources[i].prototype)[j]
      ] = (sources[i].prototype as any)[
        Object.getOwnPropertyNames(sources[i].prototype)[j]
      ]
    }
  }
}

/**
 *
 */
function getDescriptor(object: object, prop: string) {
  return Object.getOwnPropertyDescriptor(object, prop)
}

export { extendPrototype, getDescriptor }
