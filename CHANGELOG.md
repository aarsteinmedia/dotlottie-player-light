# Changelog for @aarsteinmedia/dotlottie-player

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Changelog was only added since [3.1.2], so it's not exhaustive. [Please report any missing noteable changes to us](https://github.com/aarsteinmedia/dotlottie-player/issues), and we'll add them promptly.

## [5.2.12] - 20-05-2025

### Changed

- Minor bugfix to animation engine.

## [5.2.10] - 19-05-2025

### Changed

- Minor bugfix to animation engine.

## [5.2.7] - 19-05-2025

### Changed

- Added override to manifest settings for lotties with only one animation, for autoplay and loop.

## [5.2.5] - 12-05-2025

### Changed

- Fixed image bug in Safari.
- Made play button toggeable after freeze event

## [5.2.4] - 12-05-2025

### Changed

- Updated `@aarsteinmedia/lottie-web`, to address several reported bugs.

## [5.2.3] - 28-04-2025

### Changed

- Added check for `destory`-method, to prevent it from being called before element is initialized

## [5.2.1] - 22-04-2025

### Changed

- Updates to `@aarsteinmedia/lottie-web`

## [5.2.0] - 31-03-2025

### Changed

- Added `@aarsteinmedia/lottie-web` as dependency. Makes tree shaking easier and code more maintainable

## [5.1.1] - 12-03-2025

### Changed

- Changes to backend, to optimize performance and make code more maintainable

## [5.1.0] - 26-02-2025

### Changed

- Dropped lottie-web as dependency in favour of an self-augmented version that will work better with Node SSR

## [5.0.0] - 25-02-2025

### Changed

- Added TypeScript compatibility with React 19 JSX
- BREAKING CHANGE:
  - Dropped support for CommonJS
  - Set ESM Module as main script, and moved IIFE to unpkg-folder

## [4.0.12] - 05-02-2025

### Changed

- Fixed CSS bug
- Updated backend script

## [4.0.11] - 05-02-2025

### Changed

- Changed from ES2021 to ES2022

## [4.0.10] - 26-01-2025

### Changed

- Dropped scss
- Flat Config Eslint

## [4.0.9] - 20-11-2024

### Changed

- Better attribute handling

## [4.0.8] - 12-11-2024

### Changed

- Fixed bug with setting playback direction

## [4.0.7] - 03-11-2024

### Changed

- Made it possible to set certain properties before lottie instance is loaded

## [4.0.6] - 03-11-2024

### Changed

- Made download optional for snapshot

- Made snapshot work for programatically set instances

- Changed CSS to respect hidden-attribute

## [4.0.3] - 31-10-2024

### Changed

- Added Changelog to npm package

- Removed minification from module versions

## [4.0.2] - 30-10-2024

### Changed

- Conditionally loading of controls

## [4.0.1] - 29-10-2024

### Changed

- Added attribute listener to `src`

## [4.0.0] - 24-10-2024

### Changed

- Refactored type import
  - BREAKING CHANGE:
    ```diff
    - import type { DotLottiePlayer } from '@aarsteinmedia/dotlottie-player'
    + import type DotLottiePlayer from '@aarsteinmedia/dotlottie-player'
    ```
- Rich data moved from attributes to properties
  - BREAKING CHANGE:
  ```diff
  <dotlottie-player
    id="find-me"
    - multianimationsettings="[{ autoplay: true, loop: false }]"
    - segment="[0, 1]"
  ></dotlottie-player>

  + const player = document.querySelector('#find-me')
  + player?.setMultianimationsettings([{ autoplay: true, loop: false }])
  + player?.setSegment([0, 1])
  ```

- Moved `./dist/custom-elements.json` to `./custom-elements.json`

## [3.1.5] - 21-10-2024

### Changed

- Fixed typo, causing some types not to be resolved

## [3.1.4] - 20-10-2024

### Changed

- Extended browser support

## [3.1.3] - 16-10-2024

### Added

- Added Changelog
- Migrated from eslint@8 to eslint@9


## [3.1.0] - 02-09-2024

### Added

- Added support for AVIF images in assets

## [3.0.0] - 06-09-2024

### Changed

- Refactored imports
  - BREAKING CHANGE:
    ```diff
    - import type { DotLottiePlayer } from '@aarsteinmedia/dotlottie-player'
    + import type DotLottiePlayer from '@aarsteinmedia/dotlottie-player'
    ```

### Removed

- Removed dependencies
  - `@lit`

[5.1.1]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/5.1.1
[5.1.0]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/5.1.0
[5.0.0]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/5.0.0
[4.0.12]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/4.0.12
[4.0.11]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/4.0.11
[4.0.10]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/4.0.10
[4.0.9]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/4.0.9
[4.0.8]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/4.0.8
[4.0.7]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/4.0.7
[4.0.6]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/4.0.6
[4.0.3]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/4.0.3
[4.0.2]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/4.0.2
[4.0.1]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/4.0.1
[4.0.0]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/4.0.0
[3.1.5]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/3.1.5
[3.1.4]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/3.1.4
[3.1.3]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/3.1.3
[3.1.2]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/3.1.2
[3.1.0]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/3.1.0
[3.0.0]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/3.0.0