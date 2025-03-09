import type { CompInterface } from '@/types'

export default class ProjectInterface {
  compInterface: CompInterface | null = null
  compositions: CompInterface[] = []
  currentFrame = 0
  constructor(name?: string) {
    let i = 0
    const len = this.compositions.length
    while (i < len) {
      if (this.compositions[i].data && this.compositions[i].data.nm === name) {
        if (this.compositions[i].prepareFrame && this.compositions[i].data.xt) {
          this.compositions[i].prepareFrame?.(this.currentFrame)
        }
        this.compInterface = this.compositions[i].compInterface
        break
      }
      i++
    }
  }
  registerComposition(comp: CompInterface) {
    this.compositions.push(comp)
  }
}

// const ProjectInterface = (() => {
//   /**
//    *
//    */
//   function registerComposition(this: any, comp: CompInterface) {
//     this.compositions.push(comp)
//   }

//   return () => {
//     /**
//      *
//      */
//     function _thisProjectFunction(this: any, name: string) {
//       let i = 0
//       const len = this.compositions.length
//       while (i < len) {
//         if (
//           this.compositions[i].data &&
//           this.compositions[i].data.nm === name
//         ) {
//           if (
//             this.compositions[i].prepareFrame &&
//             this.compositions[i].data.xt
//           ) {
//             this.compositions[i].prepareFrame(this.currentFrame)
//           }
//           return this.compositions[i].compInterface
//         }
//         i++
//       }
//       return null
//     }

//     _thisProjectFunction.compositions = [] as any[]
//     _thisProjectFunction.currentFrame = 0

//     _thisProjectFunction.registerComposition = registerComposition

//     return _thisProjectFunction
//   }
// })()

// export default ProjectInterface
