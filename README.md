<div align="center">

# QRcodenator

### Simple-style QR kód štúdio
**Statická webová aplikácia · Firebase Cloud · Šifrovaný Vault · Dynamické QR**

---

[![CI](https://github.com/bucala/QRcodenator/actions/workflows/ci.yml/badge.svg)](https://github.com/bucala/QRcodenator/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-orange)](#changelog)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-yellow?logo=javascript)](app.js)
[![No Framework](https://img.shields.io/badge/No%20Framework-zero%20build-lightgrey)](#)
[![Firebase](https://img.shields.io/badge/Firebase-optional-yellow?logo=firebase)](config.example.js)

---

[🚀 Rýchly štart](#-rýchly-štart) ·
[✨ Funkcie](#-funkcie) ·
[🎨 Dizajn a export](#-dizajn-a-export) ·
[🔒 Zabezpečenie](#-zabezpečenie) ·
[☁️ Firebase Vault](#-firebase-vault) ·
[📂 Súbory projektu](#-súbory-projektu) ·
[📋 Changelog](CHANGELOG.md)

</div>

---

## 💡 Prečo QRcodenator?

- **Zero-dependency QR engine** — pinovaný `qrcode-generator@1.4.4` s SRI, vstavaný enkodér ako offline fallback
- **Bez frameworku** — čistý vanilla JS, žiadny build step, žiadny bundler, funguje ako statická stránka
- **Apple-style studio** — kolapsovateľné panely, dark/light mode, SK/EN jazyk, live preview
- **18 typov obsahu** — URL, vCard, Wi-Fi, WhatsApp, PDF, video, sociálne profily, GPS, kalendár a ďalšie
- **Dizajnový toolkit** — 6 šablón, 9 rámov, 7 vzorcov modulov, gradienty, logá, fonty, farby
- **Šifrovaný cloud vault** — AES-GCM + PBKDF2, heslo nikdy neopustí prehliadač
- **Dynamické QR** — neguessovateľný slug → Firestore redirect, scan analytics cez voliteľný backend endpoint
- **Scan-safe rendering** — pixel-aligned canvas, force-square moduly pre mobilné skenery

---

## 🚀 Rýchly štart

```bash
git clone https://github.com/bucala/QRcodenator.git
cd QRcodenator
```

| Krok | Akcia | Popis |
|:-----|:------|:------|
| 1 | Otvor `index.html` | Funguje priamo v prehliadači, žiadny server nie je potrebný |
| 2 | Vyber typ obsahu v **Obsah** | URL, text, vCard, Wi-Fi, WhatsApp, GPS a ďalšie |
| 3 | Nastav texty v **Texty** | CTA, titulok, popis, hornú/dolnú etiketu |
| 4 | Uprav vzhľad v **Vzhlad** | Šablóna, vzorec modulov, farby, gradienty, pozadie |
| 5 | Nastav rám a logo v **Ram a logo** | Štýl rámu, upload loga, centrum ikona, clearance |
| 6 | Exportuj v **Export** | PNG, JPG, SVG, PDF, Clipboard, bundle ZIP |

> **Pravidlo projektu:** Každá zmena kódu, UI alebo dokumentácie musí aktualizovať `CHANGELOG.md` v tom istom commite.

---

## ✨ Funkcie

### 📱 Typy QR obsahu

<details open>
<summary><strong>18 podporovaných typov obsahu</strong></summary>

| Typ | Payload | Popis |
|:----|:--------|:------|
| 🔗 **URL** | `https://...` | Odkaz na webovú stránku |
| 📝 **Text** | Voľný text | Obyčajný textový obsah |
| 📧 **Email** | `mailto:` | Adresa, predmet, telo správy |
| 📞 **Telefón** | `tel:` | Číslo na volanie alebo SMS |
| 💬 **SMS** | `sms:` | Číslo a text správy |
| 📶 **Wi-Fi** | `WIFI:` | SSID, heslo, šifrovanie |
| 👤 **vCard** | `BEGIN:VCARD` | Kontaktná karta |
| 💚 **WhatsApp** | `wa.me/` | Číslo a predvyplnená správa |
| 📄 **PDF** | URL odkaz | Priame stiahnutie alebo náhľad PDF |
| 📱 **App link** | Obchody | iOS App Store / Google Play |
| 🖼️ **Image gallery** | URL odkaz | Odkaz na galériu obrázkov |
| 🎬 **Video** | URL odkaz | YouTube, Vimeo alebo priame video URL |
| 📲 **Social profiles** | Profil URL | Instagram, Twitter/X, Facebook, TikTok |
| 📅 **Kalendár** | `BEGIN:VEVENT` | Udalosť s dátumom a miestom |
| 📍 **GPS** | `geo:` | Zemepisné súradnice |
| 🏷️ **2D barcode** | Voľný text | Vlastný textový obsah pre 2D čítačky |
| 📊 **Dynamický QR** | `redirect.html?id=slug` | Presmerovaný slug s editovateľným cieľom |
| 🔁 **Dynamic redirect** | Firestore doc | Živý URL meniteľný bez tlače nového QR |

</details>

### 🎨 Vzorce a štýly modulov

<details>
<summary><strong>Vizuálne vzorce a finder oči</strong></summary>

**Body patterns:**
- `classic` — plné štvorce (maximálna čitateľnosť)
- `rounded` — zaoblené rohy modulov
- `dots` — guľaté bodky
- `diamond` — štvorcové diamanty pod uhlom
- `soft grid` — mäkký grid s okrajmi
- `mosaic` — mozaikový vzorec z farebných blokov
- `connected` — prepojené moduly s oceľovými hranami

**Finder eye styles:**
- `classic` — štandardné štvorcové oči
- `rounded` — zaoblené finder oči
- `circular` — kruhové finder oči

**Opravná úroveň:** L (7%), M (15%), Q (25%), H (30%)
**Quiet zone:** 0–8 modulov, nastaviteľná

</details>

### 🖼️ Šablóny a rámy

<details>
<summary><strong>Prednastavené šablóny a rámové štýly</strong></summary>

**Šablóny (6):**
- `Apple Minimal` — čisté biele pozadie, minimalistický serif text
- `Event Pass` — tmavé pozadie, výrazný tučný text udalosti
- `Restaurant Menu` — teplé odtiene, okrúhla forma, pozvánkový štýl
- `Business Card` — profesionálny modrý rám, kompaktné rozmiestnenie
- `Wi-Fi Card` — ikon Wi-Fi, priateľské pastelové farby
- `Product Tag` — produktová etiketa so sloganom

**Rámy (9):**
- `none` — bez rámu
- `thin line` — tenká čiara
- `soft shadow` — jemný tieň
- `glass` — sklenený efekt
- `ticket` — lístkový rám s trhaným okrajom
- `badge` — odznak s tučným popisom
- `scan bar` — horizontálny scan pruh s textom
- `label` — etiketa s horným a dolným textom
- `poster` — posterový formát s veľkým CTA

**Pozadia (4):** solid, soft wash, subtle grid, transparent

</details>

### 🔤 Textové a fontové ovládanie

<details>
<summary><strong>Typografia a textové vrstvy</strong></summary>

**Textové vrstvy:**
- `CTA` — výzva na akciu (hlavný text na QR)
- `Titulok` — nadpis pod QR
- `Popis` — sekundárny deskriptívny text
- `Horná etiketa` — malý text nad QR
- `Dolná etiketa (footer)` — text v pätičke rámu

**Fontové štýly (4):**
- `neutral` — čistý sans-serif systémový font
- `elegant` — serif font (Georgia)
- `bold` — tučný grotesk
- `mono` — fixná šírka (monospace)

**Ovládanie polohy:** posun textu X / Y, veľkosť textu (slider)

</details>

---

## 🎨 Dizajn a export

### 🖼️ Logo a centrum ikona

<details>
<summary><strong>Logo upload a centrum ikona</strong></summary>

- Upload vlastného centra obrázku (PNG, SVG, JPG)
- Vstavaná knižnica ikon pre typy obsahu (WhatsApp, PDF, App, Video, Social, 2D)
- Ovládanie veľkosti loga (%)
- Horizontálny a vertikálny posun loga
- **Clean integration zone** — QR moduly sú vynechané pod logom bez ručného nastavovania
- Nastaviteľný logo clearance (priestor okolo loga)
- Voliteľný biely podklad pod logom (logo plate)

</details>

### 📤 Exportné formáty

<details>
<summary><strong>Všetky exportné možnosti</strong></summary>

| Formát | Popis | Poznámka |
|:-------|:------|:---------|
| **PNG** | Rastrový export | Plné rozlíšenie s antialiasinguom |
| **JPG** | JPEG export | Nastaviteľná kvalita |
| **SVG** | Vektorový export | Skalovateľný, zachováva gradienty |
| **PDF** | Tlač/uložiť | Cez natívny print dialog |
| **Clipboard PNG** | Skopírovať do schránky | Priamy paste do iných aplikácií |
| **Clipboard SVG** | Skopírovať SVG markup | Pre vektorové editory |
| **Scan test** | Čistý BW render | Pre overenie čitateľnosti mobilným fotoaparátom |
| **Export bundle** | ZIP so všetkým | Projekt JSON + SVG + PNG spolu |

</details>

### 📊 Readability score

QRcodenator počíta skóre čitateľnosti na základe viacerých faktorov a zobrazuje varovania pre:
- Nízky kontrast medzi farbou popredia a pozadia
- Príliš veľké logo (prekrytie kritických modulov)
- Príliš malá quiet zone
- Dekoratívne vzorce pri hustých QR kódoch
- Riziká pri gradientovom farbení s malou opravnou úrovňou

---

## 📁 Projekty a história

<details>
<summary><strong>Lokálne projekty, história a brand kit</strong></summary>

**Lokálne projekty:**
- Uložiť / načítať projekt v prehliadači (localStorage)
- Zoznam poslednej histórie projektov
- Duplikovať aktívny projekt do lokálneho úložiska

**Brand kit profily:**
- Pomenované profily s farbami, vzorom, štýlom rámu, fontom a logom
- Klikateľný zoznam brand profilov pre rýchle prepnutie
- Skratky pre galériu rámov a logoprints

**Vault export/import:**
- Šifrovaný export celej knižnice projektov do súboru
- Import šifrovaného vault súboru
- Prenosné zálohy pre migráciu medzi zariadeniami

</details>

---

## 🔒 Zabezpečenie

<details>
<summary><strong>Bezpečnostný model a šifrovanie</strong></summary>

**Autentizácia a účet:**
- Firebase Email/Password autentizácia
- Obnovenie hesla cez Firebase email link
- Email verifikácia účtu
- Zmena hesla pre prihláseného používateľa

**Šifrovanie vault dát:**
- Vault fráza sa **nikdy neuloží** a nikdy sa neodošle na Firebase
- Sila vault frázy sa skóruje lokálne pred každou šifrovanou operáciou
- **Key derivation:** PBKDF2-SHA-256
- **Encryption:** AES-GCM (Web Crypto API)

**Firestore prístup:**
- Projekty uložené v `users/{uid}/projects/{projectId}` — prístupné len vlastníkovi
- Dynamické QR redirect dokumenty — verejné čítanie len pre aktívne slug dokumenty
- Anonymné zápisy do Firestore sú zakázané; scan analytika má ísť cez rate-limitovaný backend endpoint

**Firebase config:**
- Firebase web config (API key, projectId…) sú **verejné identifikátory** — nie tajomstvá
- Bezpečnosť závisí od Auth pravidiel, Firestore rules a vault šifrovania na klientovi
- Reálny config sa necommituje: použi ignorovaný `config.js` alebo `firebase-config.local.json`
- Ak bol reálny config niekedy commitnutý, rotuj/reštriktuj Web API key vo Firebase/Google Cloud

</details>

---

## ☁️ Firebase Vault

<details>
<summary><strong>Nastavenie Firebase projektu</strong></summary>

### Rýchle nastavenie Firebase

1. Otvor [Firebase Console](https://console.firebase.google.com/) a vytvor nový projekt
2. Registruj **Web app** v nastaveniach projektu
3. V **Authentication → Sign-in method** povoľ **Email/Password**
4. V **Firestore Database** vytvor databázu (Production mode)
5. Skopíruj a publikuj `firestore.rules` z tohto repozitára
6. Skopíruj `config.example.js` → `config.js` alebo `firebase-config.example.json` → `firebase-config.local.json`
7. Doplň hodnoty z Firebase Console. Lokálne config súbory sú ignorované Gitom.

### Riešenie problémov

| Chyba | Príčina | Riešenie |
|:------|:--------|:---------|
| `auth/configuration-not-found` | Auth backend nie je zapnutý | Firebase Console → Authentication → Sign-in method → Email/Password → Povoliť → Uložiť |
| `permission-denied` | Firestore rules nie sú publikované | Publikuj `firestore.rules` cez Firebase CLI alebo konzolu |
| `auth/network-request-failed` | Offline alebo CORS | Skontroluj sieťové pripojenie a autorizované domény |

> **Tip:** Ak Account Vault zobrazí `auth/configuration-not-found`, Firebase config je načítaný, ale Auth backend ešte nie je aktivovaný. Stačí ho povoliť v konzole.

</details>

---

## 📡 Dynamické QR a scan analytika

<details>
<summary><strong>Dynamické presmerovanie a počítanie skenov</strong></summary>

**Princíp fungovania:**
1. QR kód ukazuje na `redirect.html?id=SLUG` — nie priamo na cieľovú URL
2. `redirect.html` načíta slug z Firestore a presmeruje návštevníka
3. Cieľovú URL môžeš zmeniť v aplikácii bez toho, aby si musel tlačiť nový QR kód
4. Počítanie skenov môže volať voliteľný `analyticsEndpoint`, ktorý má bežať ako rate-limitovaný backend

**Výhody dynamického QR:**
- Cieľ môžeš meniť kedykoľvek
- Scan analytiku môžeš doplniť bez verejných Firestore zápisov
- Ideálne pre tlačené materiály (vizitky, letáky, plagáty)

**Bezpečnostné limity:**
- Verejné čítanie len pre aktívne slug dokumenty
- Verejný zápis do `scanCount` je vypnutý, aby sa štatistiky nedali jednoducho falšovať refreshom alebo skriptom
- Nový slug dostane náhodný suffix, ak pole slug necháš prázdne

</details>

---

## 📂 Súbory projektu

| Súbor | Účel |
|:------|:-----|
| `index.html` | Hlavné UI, všetky ovládacie panely a canvas |
| `redirect.html` | Dynamický QR redirect a počítadlo skenov |
| `styles.css` | Apple-style responzívny dizajn, dark/light mode |
| `app.js` | QR engine, rendering, exporty, localStorage, Firebase vault |
| `config.example.js` | Šablóna pre ignorovaný runtime Firebase config |
| `firebase-config.example.json` | Šablóna pre lokálny Firebase config JSON |
| `.env.example` | Šablóna deploy environment premenných |
| `firestore.rules` | Firestore bezpečnostné pravidlá |
| `CHANGELOG.md` | Kompletná história projektu |

---

## 🛠️ Development Notes

- Projekt je zámerné **framework-free** a beží ako statická web stránka
- Necommituj reálne Firebase config súbory, `.env` súbory ani generovaný deploy config
- Pri pridaní funkcie aktualizuj tento README ak sa mení správanie aplikácie
- Pri každej zmene aktualizuj `CHANGELOG.md` v rovnakom commite

---

## ⚖️ Legal

QRcodenator je nástroj na generovanie QR kódov pre obsah zadaný používateľom. Aplikácia neukladá a nezdieľa obsah QR kódov bez explicitného pokynu používateľa (cloud uloženie cez vlastný Firebase účet).

Firebase cloud funkcionalita je voliteľná a závisí od používateľovho vlastného Firebase projektu — dáta sú šifrované klientom pred odoslaním.

---

<div align="center">

**[⬆ Späť nahor](#qrcodenator)**

MIT License · © 2026 [bucala](https://github.com/bucala)

</div>
