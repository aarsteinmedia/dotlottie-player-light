// import type AnimationItem from '@/animation/AnimationItem'
import type { ElementInterface } from '@/types'

// TODO: Fix this
// class ProjectInterface {
//   static compositions: ElementInterface[] = []
//   static currentFrame = 0
//   constructor(name?: string) {
//     let i = 0
//     const len = ProjectInterface.compositions.length
//     while (i < len) {
//       if (
//         ProjectInterface.compositions[i].data &&
//         ProjectInterface.compositions[i].data.nm === name
//       ) {
//         if (
//           ProjectInterface.compositions[i].prepareFrame &&
//           ProjectInterface.compositions[i].data.xt
//         ) {
//           ProjectInterface.compositions[i].prepareFrame!(
//             ProjectInterface.currentFrame
//           )
//         }
//         ProjectInterface.compositions[i].compInterface
//         break
//       }
//       i++
//     }
//   }

//   static registerComposition(comp: ElementInterface) {
//     ProjectInterface.compositions.push(comp)
//   }
// }

// interface ProjectInterface extends AnimationItem {}

const ProjectInterface = (() => {
  /**
   *
   */
  function registerComposition(this: any, comp: ElementInterface) {
    this.compositions.push(comp)
  }

  return () => {
    /**
     *
     */
    function _thisProjectFunction(this: any, name: string) {
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

    _thisProjectFunction.compositions = [] as any[]
    _thisProjectFunction.currentFrame = 0

    _thisProjectFunction.registerComposition = registerComposition

    return _thisProjectFunction
  }
})()

export default ProjectInterface
