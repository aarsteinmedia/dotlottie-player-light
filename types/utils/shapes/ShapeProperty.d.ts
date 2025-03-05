import { LottieComp, ShapeData } from '@/types';
import type ShapeCollection from '@/utils/shapes/ShapeCollection';
declare const ShapePropertyFactory: {
    getConstructorFunction: () => {
        new (elem: any, data: any, type: number): {
            propType: string;
            comp: LottieComp;
            container: unknown;
            elem: unknown;
            data: ShapeData;
            k: boolean;
            kf: boolean;
            _mdf: boolean;
            v: ShapeData;
            pv: ShapeData;
            localShapeCollection: ShapeCollection;
            paths: ShapeCollection;
            reset: (this: {
                paths: ShapeCollection;
                localShapeCollection: ShapeCollection;
            }) => void;
            effectsSequence: unknown[];
            getValue: () => void;
            interpolateShape: (frame: number, previousValue: any, caching: any) => void;
            setVValue: (shape: ShapeData) => void;
            addEffect: (func: any) => void;
        };
    };
    getKeyframedConstructorFunction: () => {
        new (elem: any, data: any, type: number): {
            propType: string;
            comp: any;
            elem: any;
            container: any;
            offsetTime: any;
            keyframes: any;
            keyframesMetadata: unknown[];
            k: boolean;
            kf: boolean;
            v: ShapeData;
            pv: ShapeData;
            localShapeCollection: ShapeCollection;
            paths: ShapeCollection;
            lastFrame: number;
            reset: (this: {
                paths: ShapeCollection;
                localShapeCollection: ShapeCollection;
            }) => void;
            _caching: {
                lastFrame: number;
                lastIndex: number;
            };
            effectsSequence: ((this: any) => any)[];
            getValue: () => void;
            interpolateShape: (frame: number, previousValue: any, caching: any) => void;
            setVValue: (shape: ShapeData) => void;
            addEffect: (func: any) => void;
        };
    };
    getShapeProp: (elem: any, data: any, type: number, _?: unknown) => any;
};
export default ShapePropertyFactory;
