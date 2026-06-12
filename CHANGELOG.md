# Changelog

All notable changes to QRcodenator are tracked here.

This project follows a simple rule: every code, UI, security, or documentation change must update this changelog in the same commit.

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
