import type { CompInterface } from '@/types'

export const compositions: CompInterface[] = [],
  currentFrame = 0

/**
 *
 */
export function registerComposition(comp: CompInterface) {
  compositions.push(comp)
}
export default class ProjectInterface {
  content?: ProjectInterface
  createEffectsInterface?: (val: any, _interface?: ProjectInterface) => any
  registerEffectsInterface?: (val: any, _interface?: ProjectInterface) => any
  registerMaskInterface?: (val: any, _interface?: ProjectInterface) => any
  shapeInterface?: ProjectInterface
  text?: ProjectInterface
  textInterface?: ProjectInterface
  constructor(name?: string) {
    let i = 0
    const { length } = compositions
    while (i < length) {
      if (compositions[i].data && compositions[i].data.nm === name) {
        if (compositions[i].prepareFrame && compositions[i].data.xt) {
          compositions[i].prepareFrame?.(currentFrame)
        }
        for (const [key, value] of Object.entries(
          compositions[i].compInterface
        )) {
          ProjectInterface[key as keyof typeof ProjectInterface] = value
        }
        break
      }
      i++
    }
  }
}
