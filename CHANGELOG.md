# Changelog for @aarsteinmedia/dotlottie-player

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Changelog was only added since [3.1.2], so it's not exhaustive. [Please report any missing noteable changes to us](https://github.com/aarsteinmedia/dotlottie-player/issues), and we'll add them promptly.

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