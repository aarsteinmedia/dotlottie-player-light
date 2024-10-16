# Changelog for @aarsteinmedia/dotlottie-player

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Changelog was only added since [3.1.2], so it's not exhaustive. [Please report any missing noteable changes to us](https://github.com/aarsteinmedia/dotlottie-player/issues), and we'll add them promptly.

## [3.1.3] - 16-10-2014

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

[3.1.2]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/3.1.2
[3.1.0]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/3.1.0
[3.0.0]: https://www.npmjs.com/package/@aarsteinmedia/dotlottie-player-light/v/3.0.0