import type { AnimationData, LottieAsset } from '@/types'

export class SlotManager {
  animationData: AnimationData
  constructor(animationData: AnimationData) {
    this.animationData = animationData
  }
  getProp(data: LottieAsset) {
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

/**
 *
 */
export function slotFactory(animationData: AnimationData) {
  return new SlotManager(animationData)
}

export default slotFactory
