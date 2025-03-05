import type { Constructor } from '@/types'

/**
 *
 */
function extendPrototype<T>(
  sources: (() => void)[],
  destination: Constructor<T>
) {
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

export { extendPrototype, getDescriptor, createProxyFunction }
