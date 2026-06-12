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

- Content modes: URL, text, email, phone, SMS, Wi-Fi, vCard, WhatsApp, PDF, app link, image gallery, video, social profiles, calendar event, GPS location, and 2D barcode text.
- Live QR rendering with selectable correction level and quiet zone.
- QR matrix generation uses the pinned `qrcode-generator@1.4.4` browser library with SRI, with the built-in encoder kept as an offline fallback.
- Pattern styles: classic, rounded, dots, diamond, and soft grid.
- Finder eye styles: classic, rounded, and circular.
- Readability score with warnings for contrast, logo size, quiet zone, and decorative choices.

</details>

<details>
<summary><strong>Design Controls</strong></summary>

- Templates: Apple Minimal, Event Pass, Restaurant Menu, Business Card, Wi-Fi Card, and Product Tag.
- Frames: none, thin line, soft shadow, glass, ticket, badge, scan bar, label, and poster.
- Frame color picker independent from foreground, background, and accent colors.
- Background styles: solid, soft wash, subtle grid, and transparent.
- Gradients: none, linear, and radial.
- Theme switch: light and dark interface modes.
- Language switch: Slovak and English UI labels.
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
5. Firebase web config je vstavaný v aplikácii, takže v UI sa už nevkladá ručne.

Ak Account Vault zobrazí `auth/configuration-not-found`, Firebase config je načítaný, ale v projekte ešte nie je zapnutý Auth backend. Otvor Firebase Console pre projekt `qrcodenator`, choď do **Authentication > Sign-in method**, povoľ **Email/Password**, ulož zmenu a potom v aplikácii použi **Registrácia** alebo **Prihlásiť** znova.

Použitý Firebase web config JSON:

```json
{
  "apiKey": "AIzaSyCJ7oXJf3zf89V4qKYpy-CsxiEDd1_PNJE",
  "authDomain": "qrcodenator.firebaseapp.com",
  "projectId": "qrcodenator",
  "storageBucket": "qrcodenator.firebasestorage.app",
  "messagingSenderId": "277305771142",
  "appId": "1:277305771142:web:d3ff251fb8eac44c37fd07",
  "measurementId": "G-15V8RJ3XBQ"
}
```

The UI no longer exposes a config textarea. The config is packaged in `app.js` to keep the Account Vault workflow simple. Firebase web config values are public identifiers; project data security still depends on Auth, Firestore rules, and client-side vault encryption.

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
| `firebase-config.json` | Firebase web config reference used by the embedded app config |
| `firestore.rules` | Firestore security rules |
| `CHANGELOG.md` | Complete project history |

## Development Notes

- This project is intentionally framework-free and can run as a static web page.
- Do not commit personal Firebase credentials beyond the public web app config.
- When adding a feature, update this README if behavior changes.
- When making any change, update `CHANGELOG.md` in the same commit.
