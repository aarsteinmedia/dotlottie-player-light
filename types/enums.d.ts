export declare enum ObjectFit {
    Contain = "contain",
    Cover = "cover",
    Fill = "fill",
    ScaleDown = "scale-down",
    None = "none"
}
export declare enum PlayerState {
    Completed = "completed",
    Destroyed = "destroyed",
    Error = "error",
    Frozen = "frozen",
    Loading = "loading",
    Paused = "paused",
    Playing = "playing",
    Stopped = "stopped"
}
export declare enum PlayMode {
    Bounce = "bounce",
    Normal = "normal"
}
export declare enum PlayerEvents {
    Complete = "complete",
    Destroyed = "destroyed",
    Error = "error",
    Frame = "frame",
    Freeze = "freeze",
    Load = "load",
    Loop = "loop",
    Next = "next",
    Pause = "pause",
    Play = "play",
    Previous = "previous",
    Ready = "ready",
    Rendered = "rendered",
    Stop = "stop"
}
export declare enum PreserveAspectRatio {
    Contain = "xMidYMid meet",
    Cover = "xMidYMid slice",
    None = "xMinYMin slice",
    Initial = "none"
}
export declare enum ShapeType {
    Rectangle = "rc",
    Ellipse = "el",
    PolygonStar = "sr",
    Path = "sh",
    Fill = "fl",
    Stroke = "st",
    GradientFill = "gf",
    GradientStroke = "gs",
    NoStyle = "no",
    Group = "gr",
    Transform = "tr",
    RoundedCorners = "rd",
    PuckerBloat = "pb",
    Merge = "mm",
    Twist = "tw",
    OffsetPath = "op",
    ZigZag = "zz",
    Repeater = "rp",
    Trim = "tm",
    Unknown = "ms"
}
export declare enum RendererType {
    SVG = "svg",
    HTML = "html",
    Canvas = "canvas"
}
export declare enum ArrayType {
    Float32 = "float32",
    Int16 = "int16",
    Int32 = "int32",
    Uint8 = "uint8",
    Uint8c = "uint8c"
}
export declare const lineCapEnum: {
    [key: number]: string;
}, lineJoinEnum: {
    [key: number]: string;
};
