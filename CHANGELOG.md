# Changelog

All notable changes to QRcodenator are tracked here.

This project follows a simple rule: every code, UI, security, or documentation change must update this changelog in the same commit.

## 2026-06-13 - QR.io Inspired Studio Expansion

Commit: current feature expansion

### Added

- Added light/dark interface mode with local preference persistence.
- Added Slovak/English UI language switching with local preference persistence.
- Added QR.io-inspired content types: WhatsApp, PDF, app link, image gallery, video, social profiles, and 2D barcode payloads.
- Added QR.io-inspired frame styles: scan bar, label, and poster.
- Added Mosaic and Connected body patterns.
- Added center icon options for WhatsApp, PDF, app, video, social, and 2D codes.

### Changed

- Renamed Account Vault panel to `Ucet`.
- Moved Projects directly under the account panel for faster account/project workflow.
- Scan-safe mode now keeps creative body patterns and small logos while still limiting risky logo sizes.
- README now documents the expanded content and design controls.

## 2026-06-13 - Reliable QR Matrix Encoder

Commit: current QR encoder reliability fix

### Changed

- Added pinned `qrcode-generator@1.4.4` with SRI as the primary QR matrix encoder.
- Kept the built-in QR encoder as a fallback if the external encoder cannot load.
- Status now shows when QR generation is handled by the library encoder.
- SVG export now uses the effective scan-safe quiet zone consistently.
- README now documents the pinned QR encoder dependency.

## 2026-06-12 - Firebase Auth Diagnostics

Commit: current Firebase diagnostics update

### Changed

- Account Vault now translates Firebase Auth setup errors into actionable Slovak guidance.
- `auth/configuration-not-found` now points directly to enabling Authentication and the Email/Password provider in Firebase Console.
- Firebase account notices now keep the full message in the tooltip for compact layouts.
- README now documents the fix for `auth/configuration-not-found`.

## 2026-06-12 - Static CI Workflow Fix

Commit: current CI fix

### Fixed

- Fixed GitHub Actions by removing mandatory npm cache setup for a repository without an npm lockfile.
- Replaced the template npm install/test sequence with `node --check app.js` for the current static app.
- Kept optional npm install, build, and test steps for future package-based development.

## 2026-06-12 - Pixel-Aligned Screen Scanning

Commit: current QR scan fix

### Changed

- Scan-safe rendering now forces full square QR modules instead of allowing rounded modules.
- Canvas QR rendering now aligns every QR module to whole pixels to avoid grey antialias seams.
- The live scan-safe preview now uses crisp pixel scaling so mobile cameras can read it from a monitor more reliably.

## 2026-06-12 - Documentation System

Commit: current documentation update

### Added

- Rebuilt `README.md` as an interactive Markdown guide with clickable links and expandable sections.
- Added this complete `CHANGELOG.md`.
- Added a project rule requiring changelog updates with every future change.

## 2026-06-12 - Account Vault Status And Button Layout

Commit: current UI update

### Added

- Added an Account Vault notice target for local account and Firebase feedback.
- Added compact status formatting with full message preserved as tooltip.

### Changed

- Moved long Firebase/account errors out of the top status pill and into the Account Vault panel.
- Made the top status pill width constrained so it no longer dominates the header.
- Reworked Account Vault button layout so config save, sign-in, registration, and sign-out actions are easier to scan.
- Standardized success and error status styling across local, export, account, and cloud actions.

## 2026-06-12 - Scan-Safe QR Rendering

Commit: current QR reliability update

### Added

- Added a `Scan-safe render pre mobilne skenery` option in export/readability controls.
- Added automatic scan-safe render limits for quiet zone, logo size, logo offset, logo clearance, and decorative patterns.

### Changed

- Scan-safe rendering now forces high error correction.
- Scan-safe rendering uses solid QR foreground instead of decorative gradients.
- Scan-safe rendering converts risky decorative module patterns to full square modules for better camera recognition.
- SVG export now mirrors the scan-safe module rendering behavior.
- Readability scoring now warns about risky logo settings more clearly.

## 2026-06-12 - Embedded Firebase Config And Stricter Dense QR Safety

Commit: current Firebase and QR fix

### Added

- Added embedded packaged Firebase web config in `app.js`.
- Added `firebase-config.json` with the required Firebase web config JSON.
- Added the exact Firebase config JSON to README for project reference.

### Changed

- Removed the Firebase config textarea from Account Vault.
- Removed the manual config save button from Account Vault.
- Firebase Auth and Firestore now initialize from the built-in packaged config.
- Scan-safe rendering now uses stricter limits for QR version 7 and higher.
- Dense QR codes now get a larger quiet zone and much smaller centered logo in scan-safe mode.
- Large scan-safe QR codes now disable logos and decorative finder eyes for maximum scanner compatibility.
- Scan-safe mode now uses error correction `Q` instead of `H` to reduce module density while keeping strong correction.
- README now explains that Firebase web config is a public identifier and security is handled by Auth, Firestore rules, and vault encryption.

### Fixed

- Fixed QR format information placement by writing format bit 8 to `(7,8)` instead of `(6,8)`.
- Fixed invalid QR matrices that could look visually correct but fail in mobile scanner apps.

## 2026-06-12 - Logo Clearance And Text Positioning Controls

Commit: `d67d492` - `Improve logo clearance and text positioning controls`

### Added

- Added a clean logo integration zone so QR modules are skipped under the logo or center icon.
- Added logo horizontal offset control.
- Added adjustable logo clearance control.
- Added text X/Y offset controls.
- Added smooth text size slider.
- Added independent frame color picker.

### Changed

- Moved default text lower to avoid touching the frame line.
- Updated SVG export to respect logo clearance and text offsets.
- Updated templates and color swatches to set frame color.

## 2026-06-12 - Studio Layout And Collapsible Panels

Commit: `1e31636` - `Refine studio layout and collapsible panels`

### Added

- Added collapsible right-side control sections with arrow toggles.
- Added persistent collapsed/open panel state in browser storage.
- Added Firebase config parser that accepts the full `const firebaseConfig = { ... }` console snippet.

### Changed

- Refined preview layout so the QR canvas respects available panel height.
- Reduced oversized title pressure on the layout.
- Updated README to clarify Firebase config input behavior.

## 2026-06-12 - Encrypted Firebase Vault And Full QR Studio

Commit: `6bfccde` - `Expand QR studio with encrypted Firebase vault`

### Added

- Added multi-mode QR content forms: URL, text, email, phone, SMS, Wi-Fi, vCard, calendar event, and GPS location.
- Added templates: Apple Minimal, Event Pass, Restaurant Menu, Business Card, Wi-Fi Card, and Product Tag.
- Added frame styles: none, thin line, soft shadow, glass, ticket, and badge.
- Added gradient and background controls.
- Added top label, CTA, title, caption, footer, font style, and text scale controls.
- Added center icon support.
- Added PNG, JPG, SVG, and PDF export flows.
- Added copy PNG and copy SVG actions.
- Added readability score and warnings.
- Added local project storage, history, and brand kit.
- Added Firebase Email/Password sign-up, sign-in, and sign-out.
- Added encrypted cloud project save/load through Firestore.
- Added browser-side encryption with PBKDF2-SHA-256 and AES-GCM.
- Added `firestore.rules` to restrict access to the signed-in user's own documents.

### Changed

- Expanded the app from a basic generator into a full QR studio.
- Updated README with Firebase setup and security notes.

## 2026-06-12 - First QR Application Upload

Commit: `50426aa` - `Add files via upload`

### Added

- Added the first static QRcodenator app.
- Added `index.html`, `styles.css`, and `app.js`.
- Added custom QR generation logic.
- Added live canvas preview.
- Added QR pattern choices: classic, rounded, dots, diamond, and soft grid.
- Added finder eye styles.
- Added color palette controls.
- Added title and caption fields.
- Added center image upload.
- Added logo size and white plate controls.
- Added PNG and SVG export.

## 2026-06-12 - Initial Repository

Commit: `51ec817` - `Initial commit`

### Added

- Created the repository.
- Added `LICENSE`.
- Added initial placeholder `README.md`.
