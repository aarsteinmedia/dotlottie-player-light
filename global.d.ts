declare module '*.css' {
  const content: string
  export default content
}

declare module 'lottie-web/build/player/esm/lottie_light.min.js' {
  import Lottie from 'lottie-web/build/player/lottie_light'
  export default Lottie
}

declare module '@/lottie_light.js' {
  import Lottie from 'lottie-web/build/player/lottie_light'
  export default Lottie
}
