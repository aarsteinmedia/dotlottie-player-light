import type { CompInterface } from '@/types'

export default class ProjectInterface {
  static compositions: CompInterface[] = []
  static currentFrame = 0
  content?: ProjectInterface
  createEffectsInterface?: (val: any, _interface?: ProjectInterface) => any
  registerEffectsInterface?: (val: any, _interface?: ProjectInterface) => any
  registerMaskInterface?: (val: any, _interface?: ProjectInterface) => any
  shapeInterface?: ProjectInterface
  text?: ProjectInterface
  textInterface?: ProjectInterface
  constructor(name?: string) {
    let i = 0
    const { length } = ProjectInterface.compositions
    while (i < length) {
      if (
        ProjectInterface.compositions[i].data &&
        ProjectInterface.compositions[i].data.nm === name
      ) {
        if (
          ProjectInterface.compositions[i].prepareFrame &&
          ProjectInterface.compositions[i].data.xt
        ) {
          ProjectInterface.compositions[i].prepareFrame?.(
            ProjectInterface.currentFrame
          )
        }
        for (const [key, value] of Object.entries(
          ProjectInterface.compositions[i].compInterface
        )) {
          ProjectInterface[key as keyof typeof ProjectInterface] = value
        }
        break
      }
      i++
    }
  }
  static registerComposition(comp: CompInterface) {
    this.compositions.push(comp)
  }
}
