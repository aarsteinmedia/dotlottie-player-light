import type { GlobalData, LayerInterFace, LottieLayer } from '@/types';
export default class CompElement {
    createContainerElements: () => void;
    createRenderableComponents: () => void;
    data: LottieLayer;
    initBaseData: (data: LottieLayer, globalData: GlobalData, comp: LayerInterFace) => void;
    initElement: (data: LottieLayer, globalData: GlobalData, comp: LayerInterFace) => void;
    initFrame: () => void;
    initHierarchy: () => void;
    initRenderable: () => void;
    initRendererElement: () => void;
    initTransform: () => void;
}
