export enum ObjectFit {
  Contain = 'contain',
  Cover = 'cover',
  Fill = 'fill',
  ScaleDown = 'scale-down',
  None = 'none',
}

export enum PlayerState {
  Completed = 'completed',
  Destroyed = 'destroyed',
  Error = 'error',
  Frozen = 'frozen',
  Loading = 'loading',
  Paused = 'paused',
  Playing = 'playing',
  Stopped = 'stopped',
}

export enum PlayMode {
  Bounce = 'bounce',
  Normal = 'normal',
}

export enum PlayerEvents {
  Complete = 'complete',
  Destroyed = 'destroyed',
  Error = 'error',
  Frame = 'frame',
  Freeze = 'freeze',
  Load = 'load',
  Loop = 'loop',
  Next = 'next',
  Pause = 'pause',
  Play = 'play',
  Previous = 'previous',
  Ready = 'ready',
  Rendered = 'rendered',
  Stop = 'stop',
}

export enum PreserveAspectRatio {
  Contain = 'xMidYMid meet',
  Cover = 'xMidYMid slice',
  None = 'xMinYMin slice',
  Initial = 'none',
}

export enum ShapeType {
  Rectangle = 'rc',
  Ellipse = 'el',
  PolygonStar = 'sr',
  Path = 'sh',
  Fill = 'fl',
  Stroke = 'st',
  GradientFill = 'gf',
  GradientStroke = 'gs',
  NoStyle = 'no',
  Group = 'gr',
  Transform = 'tr',
  RoundedCorners = 'rd',
  PuckerBloat = 'pb',
  Merge = 'mm',
  Twist = 'tw',
  OffsetPath = 'op',
  ZigZag = 'zz',
  Repeater = 'rp',
  Trim = 'tm',
}
