import type { ExpressionsPlugin } from './types';
import { play, pause, togglePause, setSpeed, setDirection, stop, registerAnimation, resize, goToAndStop, destroy, freeze, unfreeze, setVolume, mute, unmute, getRegisteredAnimations, loadAnimation } from './animation/AnimationManager';
import { inBrowser } from './utils';
import { setIDPrefix, setLocationHref, setQuality, setWebWorker } from './utils/getterSetter';
declare const version = "[[BM_VERSION]]";
export { inBrowser, setIDPrefix, setLocationHref, setQuality, setWebWorker as useWebWorker, play, pause, togglePause, setSpeed, setDirection, stop, registerAnimation, resize, goToAndStop, destroy, freeze, unfreeze, setVolume, mute, unmute, getRegisteredAnimations, loadAnimation, version, };
export declare function installPlugin(type: string, plugin: ExpressionsPlugin): void;
export declare function setSubframeRendering(flag: boolean): void;
