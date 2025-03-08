import type { AnimationData, VectorProperty } from '@/types'

export default class SlotManager {
  animationData: AnimationData
  constructor(animationData: AnimationData) {
    this.animationData = animationData
  }
  getProp(data: VectorProperty) {
    if (
      data.sid &&
      this.animationData.slots &&
      this.animationData.slots[data.sid]
    ) {
      return Object.assign(data, this.animationData.slots[data.sid].p)
    }
    return data
  }
}
