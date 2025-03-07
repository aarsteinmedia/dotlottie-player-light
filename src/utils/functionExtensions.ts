// import type { Constructor } from '@/types'

/**
 *
 */
function applyMixins(derivedCtor: any, constructors: any[]) {
  const { length: len } = constructors
  for (let i = 0; i < len; i++) {
    const { length: jLen } = Object.getOwnPropertyNames(
      constructors[i].prototype
    )
    for (let j = 0; j < jLen; j++) {
      Object.defineProperty(
        derivedCtor.prototype,
        constructors[i].prototype[j],
        Object.getOwnPropertyDescriptor(
          constructors[i].prototype,
          constructors[i].prototype[j]
        ) || Object.create(null)
      )
    }
  }
}

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

/**
 *
 */
function createProxyFunction<T = unknown>(prototype: T) {
  function ProxyFunction() {}
  ProxyFunction.prototype = prototype
  return ProxyFunction
}

export { applyMixins, extendPrototype, getDescriptor, createProxyFunction }
