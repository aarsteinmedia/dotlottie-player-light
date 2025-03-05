import type { AnimationData, LottieAsset } from '@/types'

/**
 *
 */
function SlotManager(
  this: {
    animationData: AnimationData
  },
  animationData: AnimationData
) {
  this.animationData = animationData
}
SlotManager.prototype.getProp = function (data: LottieAsset) {
  if (
    data.sid &&
    this.animationData.slots &&
    this.animationData.slots[data.sid]
  ) {
    return Object.assign(data, this.animationData.slots[data.sid].p)
  }
  return data
}

/**
 *
 */
export function slotFactory(animationData: AnimationData) {
  return new (SlotManager as any)(animationData)
}

export default slotFactory
