# Changelog

All notable changes to this project will be documented in this file.

## [1.2.3] - 2026-01-14

### Fixed

- **Import Validation**: Fixed validation logic to properly accept spaces with empty names
  - Changed from truthiness check to property existence check using `hasOwnProperty()`
  - Now validates that `tabs` is actually an array, not just that it exists
- **Import Modal Layout**: Fixed modal overflow issues
  - Increased modal height from 410px to 520px to accommodate all elements
  - Changed textarea from percentage-based height (60%) to fixed 200px
  - Import button and error messages now properly contained within modal
- **Character Encoding**: Added UTF-8 charset meta tag to HTML files
  - Fixes display of special characters like em dashes (—)
  - Applied to both `spaces.html` and `popup.html`
- **Import Modal Heading**: Changed from "Import a new space" to "Import spaces" to better reflect functionality (supports both single and multiple space imports)

### Test Coverage

- Added 2 additional unit tests for import validation
- Total tests: 305 (up from 303)
- All tests passing

## [1.2.2] - 2026-01-14

### Added

- **File Selection for Import**: Added file picker button for importing spaces instead of only paste
- **Import Format Validation**: Automatic detection and validation of JSON backup files vs URL list text files
- **Import Error Messages**: Clear error messages for invalid import formats with specific guidance
- **Collision Detection**: Validates import content structure before processing (name and tabs required)
- **Comprehensive Unit Tests**: Added 28 new tests for `validateImportFormat` function covering:
  - Empty input validation
  - Valid and invalid JSON backup formats
  - Valid and invalid URL list formats
  - Edge cases (long lists, special characters, mixed line endings)
  - Return value structure validation

### Changed

- **Import Modal UI**: Enhanced with "Choose File" button and "or paste below" divider
- **Import Workflow**: Now validates format before processing and provides specific error feedback
- **Import Modal Close**: Only closes modal after successful import

### Technical Details

- Added `validateImportFormat()` function with comprehensive validation logic
- Added `handleFileSelect()` for file upload handling
- Enhanced `handleImport()` with validation and error handling
- File picker accepts `.json` and `.txt` files
- Filters out invalid URLs (missing protocol) from URL lists
- Validates JSON backup structure (must be array with name/tabs properties)

### Test Coverage

- Added 28 unit tests for import validation (`tests/validateImportFormat.test.js`)
- All tests passing with comprehensive edge case coverage

## [1.2.1] - 2026-01-14

### Changed

- Export filenames now include ISO 8601 date format (YYYY-MM-DD) for better organization
  - Backup files: `spaces-backup_2026-01-14.json`
  - Single space exports: `spacename_2026-01-14.txt`
- Added unit tests for `getISO8601Date()` function (15 test cases)
- Test coverage maintained at 23.79%

### Fixed

- Fixed missing semicolon in background service worker causing syntax error
- Fixed console error "Receiving end does not exist" when spaces window is closed
- Improved error handling for background script message passing

## [1.2.0] - 2026-01-14

### Added

- Dark mode toggle for the Spaces management page with persistent preference storage
- Comprehensive dark theme with carefully chosen colors for optimal readability
- Always-visible dark mode toggle button in the sidebar header
- Dark mode support for extension popup (syncs with main page preference)

### Fixed

- Fixed missing right border on space name input field when editing
- Fixed history initialization for spaces created before history tracking feature was added
- Ensured recently closed tabs section properly displays empty array instead of undefined

## [1.1.9] - 2025-12-10

### Changes

- Fixed [issue #33](https://github.com/codedread/spaces/issues/33): Allow setting the Active space name from quick-switch mode.
- Increased unit test coverage from 23.62% to 23.91%.

## [1.1.8] - 2025-12-03

### Changes

- Fixed [issue #31](https://github.com/codedread/spaces/issues/31): Allow changing the capitalization of space names.
- Fixed [issue #25](https://github.com/codedread/spaces/issues/25): Restore window ids from lost sessions in the db.
- Increased unit test coverage from 16.17% to 23.62%.

## [1.1.7] - 2025-10-01

### Changes

- Fixed [issue #10](https://github.com/codedread/spaces/issues/10): Display space window bounds at their last known position and size.
- Fixed [issue #20](https://github.com/codedread/spaces/issues/20): Close browser windows from the Spaces window.
- Fixed [issue #29](https://github.com/codedread/spaces/issues/29): Provide a debug method to export anonymized Spaces DB for debugging.
- Fixed [issue #30](https://github.com/codedread/spaces/issues/30): Do not prompt twice to overwrite space name.
- Increased unit test coverage from 10.75% to 16.17%.

## [1.1.6] - 2025-09-17

### Changes

- Fixed [issue #22](https://github.com/codedread/spaces/issues/22): Filter out PWA from the Spaces window.
- Fixed [issue #16](https://github.com/codedread/spaces/issues/16): Stop duplicating tabs of a closed Space when tab is clicked from the Spaces window.
- Fixed [issue #14](https://github.com/codedread/spaces/issues/14): Open Spaces windows on the currently-active display.
- Increased unit test coverage from 8.11% to 10.75%.


## [1.1.5] - 2025-09-08

### Fixes

- [Issue #11](https://github.com/codedread/spaces/issues/11): Fix clicking other
  links in the Popup window to transform Popup window.
- [Issue #9](https://github.com/codedread/spaces/issues/9): Fix bolding logic
  when clicking a Space in the Spaces window.
- [Issue #7](https://github.com/codedread/spaces/issues/7): Opening a Space will
  mark the Space as open in the Spaces window.
- [Issue #6](https://github.com/codedread/spaces/issues/5): Remove duplicate
  temporary windows from the Spaces list.
- [Issue #5](https://github.com/codedread/spaces/issues/5): Stop infinite
  prompts when renaming a Space.
- [Issue #4](https://github.com/codedread/spaces/issues/4): Update the list in
  the Spaces window when a Space is renamed.
- [Issue #3](https://github.com/codedread/spaces/issues/3): Escaping HTML for
  all extension content.
- [Issue #2](https://github.com/codedread/spaces/issues/2): Show Unnamed windows
  in the Spaces window again.

### Changes

- Increased unit test coverage from 3.11% to 8.11%.

## [1.1.4] - 2025-09-03

### Changes

- Updated to support Chrome Extension Manifest V3.
- Updated all code to modern JavaScript and improved documentation.
- Increased unit test coverage from 0% to 3.11%.
