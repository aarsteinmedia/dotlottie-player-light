import type { LottieComp } from '@/types'

interface Project {
  compositions: any[]
  currentFrame: number
}

const ProjectInterface = (function () {
  /**
   *
   */
  function registerComposition(this: Project, comp: LottieComp) {
    this.compositions.push(comp)
  }

  return function () {
    /**
     *
     */
    function _thisProjectFunction(this: Project, name: string) {
      let i = 0
      const len = this.compositions.length
      while (i < len) {
        if (
          this.compositions[i].data &&
          this.compositions[i].data.nm === name
        ) {
          if (
            this.compositions[i].prepareFrame &&
            this.compositions[i].data.xt
          ) {
            this.compositions[i].prepareFrame(this.currentFrame)
          }
          return this.compositions[i].compInterface
        }
        i++
      }
      return null
    }

    // @ts-expect-error: ignore
    _thisProjectFunction.compositions = []
    _thisProjectFunction.currentFrame = 0

    _thisProjectFunction.registerComposition = registerComposition

    return _thisProjectFunction
  }
})()

export default ProjectInterface
