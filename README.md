# QRcodenator

Apple-style QR studio for classic and visual QR codes with templates, frames, labels, logos, exports, local history, and an encrypted Firebase account vault.

[Open app](./index.html) · [Changelog](./CHANGELOG.md) · [Firestore rules](./firestore.rules)

## Quick Start

1. Open `index.html` in a modern browser.
2. Choose the QR content type in **Obsah**.
3. Tune visuals in **Texty**, **Vzhlad**, and **Ram a logo**.
4. Export as PNG, JPG, SVG, or PDF.
5. Optional: connect Firebase for encrypted cloud save/load.

> Keep this rule for every future change: update `CHANGELOG.md` in the same commit.

## Interactive Guide

<details open>
<summary><strong>Core QR Studio</strong></summary>

- Content modes: URL, text, email, phone, SMS, Wi-Fi, vCard, calendar event, and GPS location.
- Live QR rendering with selectable correction level and quiet zone.
- Pattern styles: classic, rounded, dots, diamond, and soft grid.
- Finder eye styles: classic, rounded, and circular.
- Readability score with warnings for contrast, logo size, quiet zone, and decorative choices.

</details>

<details>
<summary><strong>Design Controls</strong></summary>

- Templates: Apple Minimal, Event Pass, Restaurant Menu, Business Card, Wi-Fi Card, and Product Tag.
- Frames: none, thin line, soft shadow, glass, ticket, and badge.
- Frame color picker independent from foreground, background, and accent colors.
- Background styles: solid, soft wash, subtle grid, and transparent.
- Gradients: none, linear, and radial.
- Font styles: neutral, elegant, bold, and mono.
- Text controls: CTA, title, caption, top label, footer, text size, and X/Y text offset.

</details>

<details>
<summary><strong>Logo And Center Icon</strong></summary>

- Upload a center image or use a built-in icon.
- Logo size control.
- Horizontal and vertical logo offset.
- Clean integration zone so QR modules are skipped under the logo area.
- Adjustable logo clearance.
- Optional white logo plate.

</details>

<details>
<summary><strong>Exports</strong></summary>

- PNG export.
- JPG export.
- SVG export.
- PDF through print/save dialog.
- Copy PNG to clipboard.
- Copy SVG markup to clipboard.

</details>

<details>
<summary><strong>Projects, History, And Brand Kit</strong></summary>

- Local project save/load in the browser.
- Recent history list.
- Brand kit with colors, font style, and logo.
- Cloud save/load through Firebase after sign-in and vault setup.

</details>

<details>
<summary><strong>Firebase Account Vault</strong></summary>

The app is static and uses Firebase from the browser.

1. Create a Firebase project and register a Web app.
2. Enable Authentication with Email/Password.
3. Enable Cloud Firestore.
4. Publish the included `firestore.rules`.
5. Paste the Firebase web config into the app.

The Firebase config input accepts either pure JSON:

```json
{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  "appId": "..."
}
```

Or the full Firebase console snippet:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  appId: "..."
};
```

The app extracts and stores only the config object.

</details>

<details>
<summary><strong>Security Model</strong></summary>

- Firebase password authenticates the account.
- A separate Vault phrase derives the local encryption key.
- The Vault phrase is not stored and is not sent to Firebase.
- Cloud project payloads are encrypted in the browser with Web Crypto.
- Key derivation: PBKDF2-SHA-256.
- Encryption: AES-GCM.
- Firestore rules restrict project access to `users/{uid}/projects/{projectId}` for the matching signed-in user.

</details>

## Project Files

| File | Purpose |
| --- | --- |
| `index.html` | App UI and controls |
| `styles.css` | Apple-style responsive interface |
| `app.js` | QR generation, rendering, exports, local storage, Firebase vault |
| `firestore.rules` | Firestore security rules |
| `CHANGELOG.md` | Complete project history |

## Development Notes

- This project is intentionally framework-free and can run as a static web page.
- Do not commit personal Firebase credentials beyond the public web app config.
- When adding a feature, update this README if behavior changes.
- When making any change, update `CHANGELOG.md` in the same commit.
