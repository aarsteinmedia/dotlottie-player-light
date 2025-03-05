type Factory = (elem: any, data?: unknown) => void;
declare const ShapeModifiers: {
    getModifier: (nm: string, elem?: any, data?: unknown) => any;
    registerModifier: (nm: string, factory: Factory) => void;
};
export default ShapeModifiers;
