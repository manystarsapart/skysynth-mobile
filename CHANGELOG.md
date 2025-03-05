# Changelog

All notable changes to this project will be documented in this file.

Based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
adheres (mostly) to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Table of Contents

<!-- - [Unreleased](#unreleased) -->
- [M-0.1.0](#m-010---2025-03-05)
- [M-0.0.1](#m-001---2025-03-05)
- [M-0.0.0](#m-000---2025-03-04)


<!-- 
## [X.X.X] - 2025-MM-DD
### Added
- 

### Changed
- 

### Fixed
- 
 -->

<!-- 

FUTURE PLANS

 -->
## [M-0.1.0] - 2025-03-05
### Changed
- WONDERFUL NEWS: shaved Tone.js's default delay off by using Tone.context.currentTime in triggerAttack. thank you Specy for the insight


## [M-0.0.1] - 2025-03-05
### Added
- keyboard switching from +12 to +1 and back (& dynamic updating of SPN display)
- better logging in console regarding user changes

### Changed
- better menu styling

### Fixed
- keyboard mode toggle button not reverting to +12
- faster loading times!
- freeverb room size is read-only


## [M-0.0.0] - 2025-03-04
### Added
- mobile support for only notes. no other buttons etc. EXPERIMENTAL
- sw.js & manifest.json for native app behaviour after download. EXPERIMENTAL
- loading progress bar
- transposing & dynamic updating of SPN display
- octave selection (& dynamic updating of SPN display)
- instrument selection
- effect selection
- stop audio when key released toggle

### Changed
- move sw registration into domcontentloaded
- spacing for notes

### Fixed
- reduce size of notes
- user scalable: yes --> no
- touch action: auto --> none