type Factory = (elem: any, data?: unknown) => void

const ShapeModifiers = (function () {
  const modifiers: Record<string, Factory> = {}

  /**
   *
   */
  function registerModifier(nm: string, factory: Factory) {
    if (!modifiers[nm]) {
      modifiers[nm] = factory
    }
  }

  /**
   *
   */
  function getModifier(nm: string, elem?: any, data?: unknown) {
    return new (modifiers as any)[nm](elem, data)
  }

  return {
    getModifier,
    registerModifier,
  }
})()

export default ShapeModifiers
