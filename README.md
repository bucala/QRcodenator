# QRcodenator

Apple-style QR studio with visual patterns, frames, templates, logo/icon support, multi-format exports, local projects, history, and an encrypted Firebase account vault.

## Firebase setup

1. Create a Firebase project and register a Web app.
2. Enable Authentication with Email/Password.
3. Enable Cloud Firestore.
4. Publish the included `firestore.rules`.
5. Paste the Firebase web config JSON into the app. The app also accepts the full `const firebaseConfig = { ... }` snippet from the Firebase console and stores only the config object.

Cloud projects are encrypted in the browser before Firestore write. The Firebase password authenticates the account; the separate Vault phrase derives the AES-GCM key and is never stored or sent to Firebase.
