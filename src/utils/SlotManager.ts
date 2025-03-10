import type { LottieLayer } from '@/types'

export default class SlotManager {
  animationData: LottieLayer
  constructor(animationData: LottieLayer) {
    this.animationData = animationData
  }
  getProp(data: any) {
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
