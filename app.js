const dom = {
  canvas: document.querySelector("#qrCanvas"),
  status: document.querySelector("#statusPill"),
  readabilityScore: document.querySelector("#readabilityScore"),
  readabilityNotes: document.querySelector("#readabilityNotes"),
  accountState: document.querySelector("#accountState"),
  accountNotice: document.querySelector("#accountNotice"),
  accountEmail: document.querySelector("#accountEmail"),
  accountPassword: document.querySelector("#accountPassword"),
  vaultPassphrase: document.querySelector("#vaultPassphrase"),
  signUp: document.querySelector("#signUp"),
  signIn: document.querySelector("#signIn"),
  signOut: document.querySelector("#signOut"),
  contentMode: document.querySelector("#contentMode"),
  text: document.querySelector("#qrText"),
  urlValue: document.querySelector("#urlValue"),
  textValue: document.querySelector("#textValue"),
  emailTo: document.querySelector("#emailTo"),
  emailSubject: document.querySelector("#emailSubject"),
  emailBody: document.querySelector("#emailBody"),
  phoneValue: document.querySelector("#phoneValue"),
  smsPhone: document.querySelector("#smsPhone"),
  smsMessage: document.querySelector("#smsMessage"),
  wifiSsid: document.querySelector("#wifiSsid"),
  wifiPassword: document.querySelector("#wifiPassword"),
  wifiEncryption: document.querySelector("#wifiEncryption"),
  wifiHidden: document.querySelector("#wifiHidden"),
  vcardFirst: document.querySelector("#vcardFirst"),
  vcardLast: document.querySelector("#vcardLast"),
  vcardOrg: document.querySelector("#vcardOrg"),
  vcardPhone: document.querySelector("#vcardPhone"),
  vcardEmail: document.querySelector("#vcardEmail"),
  vcardUrl: document.querySelector("#vcardUrl"),
  eventTitle: document.querySelector("#eventTitle"),
  eventStart: document.querySelector("#eventStart"),
  eventEnd: document.querySelector("#eventEnd"),
  eventLocation: document.querySelector("#eventLocation"),
  eventDescription: document.querySelector("#eventDescription"),
  geoLat: document.querySelector("#geoLat"),
  geoLng: document.querySelector("#geoLng"),
  labelTitle: document.querySelector("#labelTitle"),
  labelCta: document.querySelector("#labelCta"),
  labelCaption: document.querySelector("#labelCaption"),
  labelTop: document.querySelector("#labelTop"),
  labelFooter: document.querySelector("#labelFooter"),
  fontStyle: document.querySelector("#fontStyle"),
  textScale: document.querySelector("#textScale"),
  textOffsetX: document.querySelector("#textOffsetX"),
  textOffsetY: document.querySelector("#textOffsetY"),
  template: document.querySelector("#templateStyle"),
  pattern: document.querySelector("#patternStyle"),
  eyeStyle: document.querySelector("#eyeStyle"),
  cornerStyle: document.querySelector("#cornerStyle"),
  foreground: document.querySelector("#foregroundColor"),
  background: document.querySelector("#backgroundColor"),
  accent: document.querySelector("#accentColor"),
  frameColor: document.querySelector("#frameColor"),
  gradientStyle: document.querySelector("#gradientStyle"),
  backgroundStyle: document.querySelector("#backgroundStyle"),
  frameStyle: document.querySelector("#frameStyle"),
  canvasFormat: document.querySelector("#canvasFormat"),
  centerIcon: document.querySelector("#centerIcon"),
  logoInput: document.querySelector("#logoInput"),
  logoSize: document.querySelector("#logoSize"),
  logoSizeValue: document.querySelector("#logoSizeValue"),
  logoOffset: document.querySelector("#logoOffset"),
  logoOffsetX: document.querySelector("#logoOffsetX"),
  logoClearance: document.querySelector("#logoClearance"),
  logoPlate: document.querySelector("#logoPlate"),
  exportSize: document.querySelector("#exportSize"),
  errorCorrection: document.querySelector("#errorCorrection"),
  quietZone: document.querySelector("#quietZone"),
  quietZoneValue: document.querySelector("#quietZoneValue"),
  printBlur: document.querySelector("#printBlur"),
  printBlurValue: document.querySelector("#printBlurValue"),
  scanSafe: document.querySelector("#scanSafe"),
  downloadPng: document.querySelector("#downloadPng"),
  downloadJpg: document.querySelector("#downloadJpg"),
  downloadSvg: document.querySelector("#downloadSvg"),
  downloadPdf: document.querySelector("#downloadPdf"),
  copyPng: document.querySelector("#copyPng"),
  copySvg: document.querySelector("#copySvg"),
  swatches: document.querySelector("#swatches"),
  projectName: document.querySelector("#projectName"),
  saveLocal: document.querySelector("#saveLocal"),
  saveCloud: document.querySelector("#saveCloud"),
  loadCloud: document.querySelector("#loadCloud"),
  saveBrand: document.querySelector("#saveBrand"),
  historyList: document.querySelector("#historyList"),
  projectList: document.querySelector("#projectList"),
};

const state = {
  logoImage: null,
  logoDataUrl: "",
  lastQr: null,
  lastOptions: null,
  currentUser: null,
  firebase: null,
  vaultSalt: null,
  suppressRawSync: false,
};

const TOTAL_CODEWORDS = [0, 26, 44, 70, 100, 134, 172, 196, 242, 292, 346];
const ECC_CODEWORDS = {
  L: [0, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18],
  M: [0, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26],
  Q: [0, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24],
  H: [0, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28],
};
const NUM_ERROR_BLOCKS = {
  L: [0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4],
  M: [0, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5],
  Q: [0, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8],
  H: [0, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8],
};
const ALIGNMENT_POSITIONS = {
  1: [],
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
  7: [6, 22, 38],
  8: [6, 24, 42],
  9: [6, 26, 46],
  10: [6, 28, 50],
};
const FORMAT_BITS = { L: 1, M: 0, Q: 3, H: 2 };
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const STORAGE_KEYS = {
  projects: "qrcodenator.projects",
  history: "qrcodenator.history",
  brand: "qrcodenator.brand",
  vaultSalt: "qrcodenator.vaultSalt",
  collapsedPanels: "qrcodenator.collapsedPanels",
};
const FIREBASE_VERSION = "12.14.0";
const FIREBASE_IMPORTS = {
  app: `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`,
  auth: `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js`,
  firestore: `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-firestore.js`,
};
const FIREBASE_CONFIG_SEAL = "ClACHw0uCxhWVVBsPxsUPw1uP14eKikJVx8IWU05Rlw9OAUVWW4GERg3JwtVOj4vPipQAVQAABgcaRoEEBsNTV5HHxMXABZIGAABAwYDEwADFwEOFwAPEQRBEUIbQ1lOBF8aAxQRFyYAR1RDBR0RQhIEGw0AQgdLXVAQGwsXDwYRLQdOHQQBTk4PBBsSHQcKCgQaDgZBFEQEBBcNB0gGHR4AAggBSw8RBE1eDxsEBh8VShwHFiEGAQAAHCgQTUgPRFZCX0QYQl5AQ1ddRklMAAQfO0lUW1ddTh9CXkJCVlhTVF9VRlUFSBRbEV8SS0dcQBQBVwEEDVVADEEaEAVFW1YBVwQUExAaFgADBBobO0lUW1crWRxAP0kgKVw8Jz9DCQ==";
const FIREBASE_CONFIG_SEAL_KEY = "qrcodenator-vault-ui";
const TEMPLATE_PRESETS = {
  apple: { fg: "#111111", bg: "#f7f7f5", accent: "#007aff", frameColor: "#d8d8d8", pattern: "rounded", frame: "none", format: "card" },
  event: { fg: "#14213d", bg: "#f6f8ff", accent: "#ef476f", frameColor: "#ef476f", pattern: "dots", frame: "ticket", format: "story" },
  restaurant: { fg: "#1f2933", bg: "#fff8ef", accent: "#d97706", frameColor: "#e8c99a", pattern: "weave", frame: "line", format: "card" },
  business: { fg: "#101828", bg: "#f8fafc", accent: "#475467", frameColor: "#c9ced6", pattern: "rounded", frame: "shadow", format: "card" },
  wifi: { fg: "#073b4c", bg: "#f0fffb", accent: "#06d6a0", frameColor: "#06d6a0", pattern: "rounded", frame: "badge", format: "square" },
  product: { fg: "#221c35", bg: "#fbf8ff", accent: "#7c3aed", frameColor: "#cabdff", pattern: "diamond", frame: "glass", format: "square" },
};

const GF = (() => {
  const exp = Array(512).fill(0);
  const log = Array(256).fill(0);
  let x = 1;
  for (let i = 0; i < 255; i += 1) {
    exp[i] = x;
    log[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i += 1) exp[i] = exp[i - 255];
  return { exp, log };
})();

function gfMultiply(a, b) {
  if (a === 0 || b === 0) return 0;
  return GF.exp[GF.log[a] + GF.log[b]];
}

function makeGenerator(degree) {
  let poly = [1];
  for (let i = 0; i < degree; i += 1) {
    const next = Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j += 1) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMultiply(poly[j], GF.exp[i]);
    }
    poly = next;
  }
  return poly;
}

function reedSolomonRemainder(data, degree) {
  const generator = makeGenerator(degree);
  const message = data.concat(Array(degree).fill(0));
  for (let i = 0; i < data.length; i += 1) {
    const factor = message[i];
    if (factor === 0) continue;
    for (let j = 0; j < generator.length; j += 1) {
      message[i + j] ^= gfMultiply(generator[j], factor);
    }
  }
  return message.slice(message.length - degree);
}

class BitBuffer {
  constructor() {
    this.bits = [];
  }

  append(value, length) {
    for (let i = length - 1; i >= 0; i -= 1) {
      this.bits.push((value >>> i) & 1);
    }
  }

  toBytes() {
    const bytes = [];
    for (let i = 0; i < this.bits.length; i += 8) {
      let byte = 0;
      for (let j = 0; j < 8; j += 1) {
        byte = (byte << 1) | (this.bits[i + j] || 0);
      }
      bytes.push(byte);
    }
    return bytes;
  }
}

function getCapacityBytes(version, ecl) {
  return TOTAL_CODEWORDS[version] - ECC_CODEWORDS[ecl][version] * NUM_ERROR_BLOCKS[ecl][version];
}

function pickVersion(byteLength, ecl) {
  for (let version = 1; version <= 10; version += 1) {
    const countBits = version < 10 ? 8 : 16;
    const needed = 4 + countBits + byteLength * 8;
    if (needed <= getCapacityBytes(version, ecl) * 8) return version;
  }
  return null;
}

function makeDataCodewords(text, version, ecl) {
  const bytes = Array.from(encoder.encode(text));
  const capacityBits = getCapacityBytes(version, ecl) * 8;
  const buffer = new BitBuffer();
  buffer.append(0b0100, 4);
  buffer.append(bytes.length, version < 10 ? 8 : 16);
  bytes.forEach((byte) => buffer.append(byte, 8));

  const terminator = Math.min(4, capacityBits - buffer.bits.length);
  buffer.append(0, terminator);
  while (buffer.bits.length % 8 !== 0) buffer.append(0, 1);

  const data = buffer.toBytes();
  for (let pad = 0xec; data.length < getCapacityBytes(version, ecl); pad ^= 0xec ^ 0x11) {
    data.push(pad);
  }
  return data;
}

function makeFinalCodewords(data, version, ecl) {
  const total = TOTAL_CODEWORDS[version];
  const ecWords = ECC_CODEWORDS[ecl][version];
  const numBlocks = NUM_ERROR_BLOCKS[ecl][version];
  const numShortBlocks = numBlocks - (total % numBlocks);
  const shortBlockLength = Math.floor(total / numBlocks);
  const blocks = [];
  let offset = 0;

  for (let i = 0; i < numBlocks; i += 1) {
    const dataLength = shortBlockLength - ecWords + (i < numShortBlocks ? 0 : 1);
    const dataBlock = data.slice(offset, offset + dataLength);
    offset += dataLength;
    const ecc = reedSolomonRemainder(dataBlock, ecWords);
    blocks.push({ data: dataBlock, ecc });
  }

  const result = [];
  const maxDataLength = Math.max(...blocks.map((block) => block.data.length));
  for (let i = 0; i < maxDataLength; i += 1) {
    blocks.forEach((block) => {
      if (i < block.data.length) result.push(block.data[i]);
    });
  }
  for (let i = 0; i < ecWords; i += 1) {
    blocks.forEach((block) => result.push(block.ecc[i]));
  }
  return result;
}

function createMatrix(size) {
  return {
    modules: Array.from({ length: size }, () => Array(size).fill(false)),
    reserved: Array.from({ length: size }, () => Array(size).fill(false)),
  };
}

function setFunction(matrix, x, y, value) {
  if (x < 0 || y < 0 || y >= matrix.modules.length || x >= matrix.modules.length) return;
  matrix.modules[y][x] = value;
  matrix.reserved[y][x] = true;
}

function drawFinder(matrix, x, y) {
  for (let dy = -1; dy <= 7; dy += 1) {
    for (let dx = -1; dx <= 7; dx += 1) {
      const xx = x + dx;
      const yy = y + dy;
      if (xx < 0 || yy < 0 || yy >= matrix.modules.length || xx >= matrix.modules.length) continue;
      const inPattern = dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6;
      const dark = inPattern && (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
      setFunction(matrix, xx, yy, dark);
    }
  }
}

function drawAlignment(matrix, cx, cy) {
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const dark = Math.max(Math.abs(dx), Math.abs(dy)) !== 1;
      setFunction(matrix, cx + dx, cy + dy, dark);
    }
  }
}

function drawFormatBits(matrix, ecl, mask) {
  const size = matrix.modules.length;
  const data = (FORMAT_BITS[ecl] << 3) | mask;
  let remainder = data;
  for (let i = 0; i < 10; i += 1) {
    remainder = (remainder << 1) ^ (((remainder >>> 9) & 1) ? 0x537 : 0);
  }
  const bits = ((data << 10) | remainder) ^ 0x5412;

  for (let i = 0; i < 15; i += 1) {
    const bit = ((bits >>> i) & 1) === 1;
    if (i < 6) setFunction(matrix, 8, i, bit);
    else if (i < 8) setFunction(matrix, 8, i + 1, bit);
    else setFunction(matrix, 8, size - 15 + i, bit);

    if (i < 8) setFunction(matrix, size - 1 - i, 8, bit);
    else if (i === 8) setFunction(matrix, 7, 8, bit);
    else setFunction(matrix, 14 - i, 8, bit);
  }
  setFunction(matrix, 8, size - 8, true);
}

function drawVersionBits(matrix, version) {
  if (version < 7) return;
  const size = matrix.modules.length;
  let remainder = version;
  for (let i = 0; i < 12; i += 1) {
    remainder = (remainder << 1) ^ (((remainder >>> 11) & 1) ? 0x1f25 : 0);
  }
  const bits = (version << 12) | remainder;
  for (let i = 0; i < 18; i += 1) {
    const bit = ((bits >>> i) & 1) === 1;
    const a = size - 11 + (i % 3);
    const b = Math.floor(i / 3);
    setFunction(matrix, a, b, bit);
    setFunction(matrix, b, a, bit);
  }
}

function drawFunctionPatterns(matrix, version, ecl) {
  const size = matrix.modules.length;
  drawFinder(matrix, 0, 0);
  drawFinder(matrix, size - 7, 0);
  drawFinder(matrix, 0, size - 7);

  for (let i = 0; i < size; i += 1) {
    if (!matrix.reserved[6][i]) setFunction(matrix, i, 6, i % 2 === 0);
    if (!matrix.reserved[i][6]) setFunction(matrix, 6, i, i % 2 === 0);
  }

  const positions = ALIGNMENT_POSITIONS[version];
  positions.forEach((y) => {
    positions.forEach((x) => {
      if (matrix.reserved[y][x]) return;
      drawAlignment(matrix, x, y);
    });
  });

  drawFormatBits(matrix, ecl, 0);
  drawVersionBits(matrix, version);
}

function placeDataBits(matrix, codewords) {
  const size = matrix.modules.length;
  let bitIndex = 0;
  let direction = -1;
  let x = size - 1;
  let y = size - 1;

  while (x > 0) {
    if (x === 6) x -= 1;
    for (;;) {
      for (let i = 0; i < 2; i += 1) {
        const xx = x - i;
        if (!matrix.reserved[y][xx]) {
          const byteIndex = bitIndex >>> 3;
          const bit = byteIndex < codewords.length && (((codewords[byteIndex] >>> (7 - (bitIndex & 7))) & 1) === 1);
          matrix.modules[y][xx] = bit;
          bitIndex += 1;
        }
      }
      y += direction;
      if (y < 0 || y >= size) {
        y -= direction;
        direction = -direction;
        break;
      }
    }
    x -= 2;
  }
}

function maskBit(mask, x, y) {
  switch (mask) {
    case 0:
      return (x + y) % 2 === 0;
    case 1:
      return y % 2 === 0;
    case 2:
      return x % 3 === 0;
    case 3:
      return (x + y) % 3 === 0;
    case 4:
      return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
    case 5:
      return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6:
      return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
    default:
      return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
  }
}

function cloneMatrix(matrix) {
  return {
    modules: matrix.modules.map((row) => row.slice()),
    reserved: matrix.reserved.map((row) => row.slice()),
  };
}

function applyMask(matrix, mask) {
  const size = matrix.modules.length;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!matrix.reserved[y][x] && maskBit(mask, x, y)) {
        matrix.modules[y][x] = !matrix.modules[y][x];
      }
    }
  }
}

function penaltyScore(modules) {
  const size = modules.length;
  let score = 0;

  for (let y = 0; y < size; y += 1) {
    let runColor = modules[y][0];
    let runLength = 1;
    for (let x = 1; x < size; x += 1) {
      if (modules[y][x] === runColor) runLength += 1;
      else {
        if (runLength >= 5) score += 3 + runLength - 5;
        runColor = modules[y][x];
        runLength = 1;
      }
    }
    if (runLength >= 5) score += 3 + runLength - 5;
  }

  for (let x = 0; x < size; x += 1) {
    let runColor = modules[0][x];
    let runLength = 1;
    for (let y = 1; y < size; y += 1) {
      if (modules[y][x] === runColor) runLength += 1;
      else {
        if (runLength >= 5) score += 3 + runLength - 5;
        runColor = modules[y][x];
        runLength = 1;
      }
    }
    if (runLength >= 5) score += 3 + runLength - 5;
  }

  for (let y = 0; y < size - 1; y += 1) {
    for (let x = 0; x < size - 1; x += 1) {
      const color = modules[y][x];
      if (modules[y][x + 1] === color && modules[y + 1][x] === color && modules[y + 1][x + 1] === color) {
        score += 3;
      }
    }
  }

  const patternA = "10111010000";
  const patternB = "00001011101";
  for (let y = 0; y < size; y += 1) {
    const row = modules[y].map(Number).join("");
    for (let x = 0; x <= size - 11; x += 1) {
      const slice = row.slice(x, x + 11);
      if (slice === patternA || slice === patternB) score += 40;
    }
  }
  for (let x = 0; x < size; x += 1) {
    let col = "";
    for (let y = 0; y < size; y += 1) col += modules[y][x] ? "1" : "0";
    for (let y = 0; y <= size - 11; y += 1) {
      const slice = col.slice(y, y + 11);
      if (slice === patternA || slice === patternB) score += 40;
    }
  }

  let dark = 0;
  modules.forEach((row) => row.forEach((bit) => { if (bit) dark += 1; }));
  const percent = (dark * 100) / (size * size);
  score += Math.floor(Math.abs(percent - 50) / 5) * 10;
  return score;
}

function generateQr(text, ecl) {
  const bytes = encoder.encode(text);
  const version = pickVersion(bytes.length, ecl);
  if (!version) throw new Error("Text je príliš dlhý pre vstavaný QR generátor. Skráťte obsah alebo použite odkaz.");

  const data = makeDataCodewords(text, version, ecl);
  const codewords = makeFinalCodewords(data, version, ecl);
  const size = version * 4 + 17;
  const base = createMatrix(size);
  drawFunctionPatterns(base, version, ecl);
  placeDataBits(base, codewords);

  let best = null;
  for (let mask = 0; mask < 8; mask += 1) {
    const candidate = cloneMatrix(base);
    applyMask(candidate, mask);
    drawFormatBits(candidate, ecl, mask);
    const score = penaltyScore(candidate.modules);
    if (!best || score < best.score) best = { matrix: candidate, mask, score };
  }

  return {
    version,
    mask: best.mask,
    modules: best.matrix.modules,
    size,
  };
}

function isInFinder(x, y, size) {
  return (x <= 6 && y <= 6) || (x >= size - 7 && y <= 6) || (x <= 6 && y >= size - 7);
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawModule(ctx, x, y, cell, style, color, modules, moduleX, moduleY) {
  const inset = cell * 0.08;
  ctx.fillStyle = color;

  if (style === "dots") {
    ctx.beginPath();
    ctx.arc(x + cell / 2, y + cell / 2, cell * 0.38, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  if (style === "diamond") {
    ctx.save();
    ctx.translate(x + cell / 2, y + cell / 2);
    ctx.rotate(Math.PI / 4);
    roundRect(ctx, -cell * 0.32, -cell * 0.32, cell * 0.64, cell * 0.64, cell * 0.08);
    ctx.fill();
    ctx.restore();
    return;
  }

  if (style === "weave") {
    const size = modules.length;
    const horizontal = (moduleX > 0 && modules[moduleY][moduleX - 1]) || (moduleX < size - 1 && modules[moduleY][moduleX + 1]);
    const vertical = (moduleY > 0 && modules[moduleY - 1][moduleX]) || (moduleY < size - 1 && modules[moduleY + 1][moduleX]);
    if (horizontal && !vertical) {
      roundRect(ctx, x - inset, y + cell * 0.16, cell + inset * 2, cell * 0.68, cell * 0.2);
    } else if (vertical && !horizontal) {
      roundRect(ctx, x + cell * 0.16, y - inset, cell * 0.68, cell + inset * 2, cell * 0.2);
    } else {
      roundRect(ctx, x + inset, y + inset, cell - inset * 2, cell - inset * 2, cell * 0.18);
    }
    ctx.fill();
    return;
  }

  if (style === "rounded") {
    roundRect(ctx, x + inset, y + inset, cell - inset * 2, cell - inset * 2, cell * 0.22);
    ctx.fill();
    return;
  }

  ctx.fillRect(x, y, cell, cell);
}

function drawEye(ctx, x, y, cell, style, colors) {
  const unit = cell;
  const outer = unit * 7;
  ctx.save();

  if (style === "circle") {
    ctx.fillStyle = colors.foreground;
    ctx.beginPath();
    ctx.arc(x + outer / 2, y + outer / 2, outer / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.background;
    ctx.beginPath();
    ctx.arc(x + outer / 2, y + outer / 2, unit * 2.55, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.accent;
    ctx.beginPath();
    ctx.arc(x + outer / 2, y + outer / 2, unit * 1.55, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === "rounded") {
    ctx.fillStyle = colors.foreground;
    roundRect(ctx, x, y, outer, outer, unit * 1.35);
    ctx.fill();
    ctx.fillStyle = colors.background;
    roundRect(ctx, x + unit, y + unit, unit * 5, unit * 5, unit * 0.9);
    ctx.fill();
    ctx.fillStyle = colors.accent;
    roundRect(ctx, x + unit * 2, y + unit * 2, unit * 3, unit * 3, unit * 0.62);
    ctx.fill();
  } else {
    ctx.fillStyle = colors.foreground;
    ctx.fillRect(x, y, outer, outer);
    ctx.fillStyle = colors.background;
    ctx.fillRect(x + unit, y + unit, unit * 5, unit * 5);
    ctx.fillStyle = colors.accent;
    ctx.fillRect(x + unit * 2, y + unit * 2, unit * 3, unit * 3);
  }

  ctx.restore();
}

function safeValue(element) {
  return element ? element.value.trim() : "";
}

function escapeWifi(value) {
  return value.replace(/([\\;,":])/g, "\\$1");
}

function normalizeUrl(value) {
  if (!value) return "https://example.com";
  if (/^[a-z][a-z0-9+.-]*:/i.test(value)) return value;
  return `https://${value}`;
}

function formatDateTimeLocal(value) {
  if (!value) return "";
  return value.replace(/[-:]/g, "").replace("T", "00").slice(0, 15);
}

function buildQrPayload() {
  switch (dom.contentMode.value) {
    case "url":
      return normalizeUrl(safeValue(dom.urlValue));
    case "text":
      return safeValue(dom.textValue) || " ";
    case "email": {
      const to = safeValue(dom.emailTo);
      const params = new URLSearchParams();
      if (safeValue(dom.emailSubject)) params.set("subject", safeValue(dom.emailSubject));
      if (safeValue(dom.emailBody)) params.set("body", safeValue(dom.emailBody));
      return `mailto:${to}${params.toString() ? `?${params}` : ""}`;
    }
    case "phone":
      return `tel:${safeValue(dom.phoneValue)}`;
    case "sms":
      return `SMSTO:${safeValue(dom.smsPhone)}:${safeValue(dom.smsMessage)}`;
    case "wifi": {
      const encryption = dom.wifiEncryption.value === "nopass" ? "nopass" : dom.wifiEncryption.value;
      return `WIFI:T:${encryption};S:${escapeWifi(safeValue(dom.wifiSsid))};P:${escapeWifi(safeValue(dom.wifiPassword))};H:${dom.wifiHidden.checked ? "true" : "false"};;`;
    }
    case "vcard":
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${safeValue(dom.vcardLast)};${safeValue(dom.vcardFirst)};;;`,
        `FN:${[safeValue(dom.vcardFirst), safeValue(dom.vcardLast)].filter(Boolean).join(" ")}`,
        safeValue(dom.vcardOrg) ? `ORG:${safeValue(dom.vcardOrg)}` : "",
        safeValue(dom.vcardPhone) ? `TEL:${safeValue(dom.vcardPhone)}` : "",
        safeValue(dom.vcardEmail) ? `EMAIL:${safeValue(dom.vcardEmail)}` : "",
        safeValue(dom.vcardUrl) ? `URL:${normalizeUrl(safeValue(dom.vcardUrl))}` : "",
        "END:VCARD",
      ].filter(Boolean).join("\n");
    case "event":
      return [
        "BEGIN:VEVENT",
        `SUMMARY:${safeValue(dom.eventTitle) || "Event"}`,
        safeValue(dom.eventStart) ? `DTSTART:${formatDateTimeLocal(safeValue(dom.eventStart))}` : "",
        safeValue(dom.eventEnd) ? `DTEND:${formatDateTimeLocal(safeValue(dom.eventEnd))}` : "",
        safeValue(dom.eventLocation) ? `LOCATION:${safeValue(dom.eventLocation)}` : "",
        safeValue(dom.eventDescription) ? `DESCRIPTION:${safeValue(dom.eventDescription)}` : "",
        "END:VEVENT",
      ].filter(Boolean).join("\n");
    case "location":
      return `geo:${safeValue(dom.geoLat) || "48.1486"},${safeValue(dom.geoLng) || "17.1077"}`;
    default:
      return safeValue(dom.text) || " ";
  }
}

function syncRawFromFields() {
  state.suppressRawSync = true;
  dom.text.value = buildQrPayload();
  state.suppressRawSync = false;
}

function setActiveContentFields() {
  document.querySelectorAll("[data-mode-field]").forEach((field) => {
    field.classList.toggle("active", field.dataset.modeField === dom.contentMode.value);
  });
}

function getFontFamily(style) {
  if (style === "serif") return "Georgia, Times New Roman, serif";
  if (style === "mono") return "SFMono-Regular, Consolas, monospace";
  return "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const value = parseInt(clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean, 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const channel = (value) => {
    const s = value / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a, b) {
  const light = Math.max(relativeLuminance(a), relativeLuminance(b));
  const dark = Math.min(relativeLuminance(a), relativeLuminance(b));
  return (light + 0.05) / (dark + 0.05);
}

function getReadability(options, qr = null) {
  const notes = [];
  let score = 100;
  const effective = getEffectiveRenderSettings(options, qr);
  const contrast = contrastRatio(options.foreground, options.background);
  if (contrast < 4.5) {
    score -= 35;
    notes.push("Nizky kontrast farieb.");
  }
  if (effective.logoSize > 22) {
    score -= 20;
    notes.push("Logo je velke, skuste max 22%.");
  }
  if (options.scanSafe && options.logoSize > 14) {
    notes.push("Scan-safe render zmensi logo na bezpecnu velkost.");
  }
  if (options.scanSafe && qr && qr.version >= 7 && options.logoSize > 0) {
    notes.push("Pri velkom QR scan-safe vypne logo, aby bol kod citatelny.");
  }
  if (options.scanSafe && qr && qr.version >= 7 && options.eyeStyle !== "classic") {
    notes.push("Pri velkom QR scan-safe pouzije klasicke rohy.");
  }
  if (!options.scanSafe && (Math.abs(options.logoOffsetX) > 8 || Math.abs(options.logoOffset) > 8)) {
    score -= 18;
    notes.push("Velky posun loga moze zhorsit citatelnost.");
  } else if (options.scanSafe && (Math.abs(options.logoOffsetX) > 6 || Math.abs(options.logoOffset) > 6)) {
    notes.push("Scan-safe render obmedzi posun loga do bezpecnej zony.");
  }
  if (!options.scanSafe && options.logoClearance > 1.28) {
    score -= 14;
    notes.push("Cista zona okolo loga je prilis velka.");
  } else if (options.scanSafe && options.logoClearance > effective.logoClearance) {
    notes.push("Scan-safe render zmensi cistu zonu okolo loga.");
  }
  if (effective.quietZone < 4) {
    score -= 15;
    notes.push("Okraj je mensi ako odporucana hodnota 4.");
  }
  if (!options.scanSafe && options.gradient !== "none") {
    score -= 6;
    notes.push("Gradient moze znizit citatelnost pri tlaci.");
  } else if (options.scanSafe && options.gradient !== "none") {
    notes.push("Scan-safe render pouzije solidnu farbu QR modulov.");
  }
  if (!options.scanSafe && (options.pattern === "diamond" || options.pattern === "dots")) {
    score -= 5;
    notes.push("Dekorativny pattern otestujte skenerom.");
  }
  score = Math.max(0, Math.round(score));
  return { score, notes: notes.length ? notes : ["Kontrast a logo su v norme."] };
}

function getEffectiveRenderSettings(options, qr = null) {
  if (!options.scanSafe) {
    return {
      quietZone: options.quietZone,
      pattern: options.pattern,
      logoSize: options.logoSize,
      logoOffset: options.logoOffset,
      logoOffsetX: options.logoOffsetX,
      logoClearance: options.logoClearance,
    };
  }

  const version = qr ? qr.version : 1;
  const maxLogoSize = version >= 7 ? 0 : version >= 5 ? 8 : 12;
  const maxLogoOffset = version >= 7 ? 3 : 5;
  const maxClearance = version >= 7 ? 1.08 : 1.12;

  return {
    quietZone: Math.max(options.quietZone, 6),
    pattern: "square",
    eyeStyle: version >= 7 ? "classic" : options.eyeStyle,
    logoSize: Math.min(options.logoSize, maxLogoSize),
    logoOffset: Math.max(-maxLogoOffset, Math.min(maxLogoOffset, options.logoOffset)),
    logoOffsetX: Math.max(-maxLogoOffset, Math.min(maxLogoOffset, options.logoOffsetX)),
    logoClearance: Math.min(Math.max(options.logoClearance, 1.04), maxClearance),
  };
}

function getOptions() {
  return {
    text: dom.text.value.trim() || " ",
    mode: dom.contentMode.value,
    title: dom.labelTitle.value.trim(),
    cta: dom.labelCta.value.trim(),
    caption: dom.labelCaption.value.trim(),
    topLabel: dom.labelTop.value.trim(),
    footer: dom.labelFooter.value.trim(),
    fontStyle: dom.fontStyle.value,
    textScale: Number(dom.textScale.value) > 5 ? Number(dom.textScale.value) / 100 : Number(dom.textScale.value),
    textOffsetX: Number(dom.textOffsetX.value),
    textOffsetY: Number(dom.textOffsetY.value),
    template: dom.template.value,
    pattern: dom.pattern.value,
    eyeStyle: dom.eyeStyle.value,
    cornerStyle: dom.cornerStyle.value,
    foreground: dom.foreground.value,
    background: dom.background.value,
    accent: dom.accent.value,
    frameColor: dom.frameColor.value,
    gradient: dom.gradientStyle.value,
    backgroundStyle: dom.backgroundStyle.value,
    frameStyle: dom.frameStyle.value,
    canvasFormat: dom.canvasFormat.value,
    centerIcon: dom.centerIcon.value,
    logoSize: Number(dom.logoSize.value),
    logoOffset: Number(dom.logoOffset.value),
    logoOffsetX: Number(dom.logoOffsetX.value),
    logoClearance: Number(dom.logoClearance.value) / 100,
    logoPlate: dom.logoPlate.checked,
    exportSize: Number(dom.exportSize.value),
    quietZone: Number(dom.quietZone.value),
    scanSafe: dom.scanSafe.checked,
    ecl: dom.scanSafe.checked ? "Q" : dom.errorCorrection.value,
    printBlur: Number(dom.printBlur.value),
  };
}

function getCanvasMetrics(options) {
  const base = options.exportSize;
  if (options.canvasFormat === "story") return { width: base, height: Math.round(base * 1.72), qr: Math.round(base * 0.78) };
  if (options.canvasFormat === "a4") return { width: base, height: Math.round(base * 1.414), qr: Math.round(base * 0.68) };
  if (options.canvasFormat === "square") return { width: base, height: base, qr: Math.round(base * 0.72) };
  return { width: base, height: Math.round(base * 1.18), qr: Math.round(base * 0.72) };
}

function makeForegroundStyle(ctx, options, x, y, size) {
  if (options.gradient === "linear") {
    const gradient = ctx.createLinearGradient(x, y, x + size, y + size);
    gradient.addColorStop(0, options.foreground);
    gradient.addColorStop(1, options.accent);
    return gradient;
  }
  if (options.gradient === "radial") {
    const gradient = ctx.createRadialGradient(x + size / 2, y + size / 2, size * 0.1, x + size / 2, y + size / 2, size * 0.72);
    gradient.addColorStop(0, options.accent);
    gradient.addColorStop(1, options.foreground);
    return gradient;
  }
  return options.foreground;
}

function fillBackground(ctx, width, height, options) {
  if (options.backgroundStyle === "transparent") {
    ctx.clearRect(0, 0, width, height);
    return;
  }
  ctx.fillStyle = options.background;
  ctx.fillRect(0, 0, width, height);
  if (options.backgroundStyle === "soft") {
    const glow = ctx.createRadialGradient(width * 0.2, 0, 0, width * 0.2, 0, width * 0.9);
    glow.addColorStop(0, `${options.accent}33`);
    glow.addColorStop(1, `${options.accent}00`);
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }
  if (options.backgroundStyle === "grid") {
    ctx.strokeStyle = "rgba(29,29,31,0.06)";
    ctx.lineWidth = Math.max(1, width / 900);
    const step = width / 24;
    for (let x = 0; x <= width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }
}

function cardRadius(options, size) {
  if (options.cornerStyle === "sharp") return 0;
  if (options.cornerStyle === "pill") return size * 0.16;
  if (options.cornerStyle === "cut") return size * 0.02;
  return size * 0.07;
}

function drawFrame(ctx, x, y, size, options) {
  if (options.frameStyle === "none") return;
  const radius = cardRadius(options, size);
  ctx.save();
  if (options.frameStyle === "shadow") {
    ctx.shadowColor = "rgba(20,20,30,0.22)";
    ctx.shadowBlur = size * 0.045;
    ctx.shadowOffsetY = size * 0.025;
    ctx.fillStyle = "rgba(255,255,255,0.62)";
    roundRect(ctx, x - size * 0.05, y - size * 0.05, size * 1.1, size * 1.1, radius);
    ctx.fill();
  }
  if (options.frameStyle === "glass") {
    ctx.fillStyle = "rgba(255,255,255,0.34)";
    roundRect(ctx, x - size * 0.065, y - size * 0.065, size * 1.13, size * 1.13, radius);
    ctx.fill();
  }
  if (options.frameStyle === "line" || options.frameStyle === "glass" || options.frameStyle === "ticket" || options.frameStyle === "badge") {
    ctx.strokeStyle = options.frameStyle === "badge" ? options.accent : options.frameColor;
    ctx.lineWidth = Math.max(3, size * 0.01);
    roundRect(ctx, x - size * 0.04, y - size * 0.04, size * 1.08, size * 1.08, radius);
    ctx.stroke();
  }
  if (options.frameStyle === "ticket") {
    ctx.fillStyle = options.background;
    const notch = size * 0.06;
    [["left", x - size * 0.04, y + size * 0.5], ["right", x + size * 1.04, y + size * 0.5]].forEach(([, nx, ny]) => {
      ctx.beginPath();
      ctx.arc(nx, ny, notch, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.restore();
}

function drawCenterIcon(ctx, icon, cx, cy, size, color) {
  if (icon === "none") return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(4, size * 0.08);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const r = size / 2;
  if (icon === "wifi") {
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.arc(cx, cy + r * 0.36, r * (0.26 + i * 0.24), Math.PI * 1.18, Math.PI * 1.82);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.48, r * 0.08, 0, Math.PI * 2);
    ctx.fill();
  } else if (icon === "mail") {
    roundRect(ctx, cx - r * 0.72, cy - r * 0.48, r * 1.44, r * 0.96, r * 0.12);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - r * 0.68, cy - r * 0.38);
    ctx.lineTo(cx, cy + r * 0.1);
    ctx.lineTo(cx + r * 0.68, cy - r * 0.38);
    ctx.stroke();
  } else if (icon === "contact") {
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.24, r * 0.24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy + r * 0.62, r * 0.52, Math.PI * 1.12, Math.PI * 1.88);
    ctx.stroke();
  } else if (icon === "map") {
    ctx.beginPath();
    ctx.arc(cx, cy - r * 0.12, r * 0.42, Math.PI * 0.05, Math.PI * 1.95);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy + r * 0.76);
    ctx.lineTo(cx - r * 0.28, cy + r * 0.18);
    ctx.lineTo(cx + r * 0.28, cy + r * 0.18);
    ctx.closePath();
    ctx.fill();
  } else if (icon === "pay") {
    ctx.font = `800 ${Math.round(size * 0.86)}px ${getFontFamily("system")}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("$", cx, cy + size * 0.02);
  } else if (icon === "instagram") {
    roundRect(ctx, cx - r * 0.58, cy - r * 0.58, r * 1.16, r * 1.16, r * 0.28);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + r * 0.32, cy - r * 0.32, r * 0.06, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(cx - r * 0.22, cy, r * 0.28, Math.PI * 0.25, Math.PI * 1.75);
    ctx.arc(cx + r * 0.22, cy, r * 0.28, Math.PI * 1.25, Math.PI * 2.75);
    ctx.stroke();
  }
  ctx.restore();
}

function isInLogoClearArea(x, y, cell, logoArea) {
  if (!logoArea) return false;
  const moduleCenterX = x + cell / 2;
  const moduleCenterY = y + cell / 2;
  return (
    moduleCenterX >= logoArea.x &&
    moduleCenterX <= logoArea.x + logoArea.width &&
    moduleCenterY >= logoArea.y &&
    moduleCenterY <= logoArea.y + logoArea.height
  );
}

function drawQrToCanvas(canvas, qr, options) {
  const ctx = canvas.getContext("2d");
  const metrics = getCanvasMetrics(options);
  const effective = getEffectiveRenderSettings(options, qr);
  canvas.width = metrics.width;
  canvas.height = metrics.height;
  canvas.classList.toggle("pixel-preview", options.scanSafe);

  const colors = {
    foreground: options.scanSafe ? options.foreground : makeForegroundStyle(ctx, options, 0, 0, metrics.qr),
    background: options.background,
    accent: options.scanSafe && qr.version >= 7 ? options.foreground : options.accent,
  };

  fillBackground(ctx, canvas.width, canvas.height, options);

  const totalModules = qr.size + effective.quietZone * 2;
  const cell = Math.max(1, Math.floor(metrics.qr / totalModules));
  const qrPixels = cell * totalModules;
  const qrX = Math.round((canvas.width - qrPixels) / 2);
  const topTextSpace = options.topLabel || options.cta ? canvas.height * 0.12 : canvas.height * 0.08;
  const qrY = Math.round(Math.min(canvas.height - qrPixels - canvas.height * 0.22, topTextSpace));
  const offset = effective.quietZone * cell;
  const modules = qr.modules;
  const hasLogoContent = (state.logoImage || options.centerIcon !== "none") && effective.logoSize > 0;
  const logoBox = qrPixels * (effective.logoSize / 100);
  const logoCenterX = qrX + qrPixels / 2 + qrPixels * (effective.logoOffsetX / 100);
  const logoCenterY = qrY + qrPixels / 2 + qrPixels * (effective.logoOffset / 100);
  const logoClearSize = Math.max(logoBox * effective.logoClearance, logoBox + cell * 2);
  const logoArea = hasLogoContent ? {
    x: logoCenterX - logoClearSize / 2,
    y: logoCenterY - logoClearSize / 2,
    width: logoClearSize,
    height: logoClearSize,
  } : null;

  drawFrame(ctx, qrX, qrY, qrPixels, options);

  if (options.printBlur > 0) ctx.filter = `blur(${options.printBlur * 0.22}px)`;
  for (let y = 0; y < qr.size; y += 1) {
    for (let x = 0; x < qr.size; x += 1) {
      if (!modules[y][x] || isInFinder(x, y, qr.size)) continue;
      const px = qrX + offset + x * cell;
      const py = qrY + offset + y * cell;
      if (isInLogoClearArea(px, py, cell, logoArea)) continue;
      drawModule(ctx, px, py, cell, effective.pattern, colors.foreground, modules, x, y);
    }
  }

  drawEye(ctx, qrX + offset, qrY + offset, cell, effective.eyeStyle, colors);
  drawEye(ctx, qrX + offset + (qr.size - 7) * cell, qrY + offset, cell, effective.eyeStyle, colors);
  drawEye(ctx, qrX + offset, qrY + offset + (qr.size - 7) * cell, cell, effective.eyeStyle, colors);
  ctx.filter = "none";

  if (hasLogoContent) {
    const centerX = logoCenterX;
    const centerY = logoCenterY;
    const plate = logoClearSize;

    if (options.logoPlate) {
      ctx.fillStyle = "rgba(255,255,255,0.96)";
      roundRect(ctx, centerX - plate / 2, centerY - plate / 2, plate, plate, plate * 0.24);
      ctx.fill();
      ctx.strokeStyle = "rgba(29,29,31,0.08)";
      ctx.lineWidth = Math.max(2, qrPixels / 360);
      ctx.stroke();
    }

    if (state.logoImage) {
      ctx.save();
      roundRect(ctx, centerX - logoBox / 2, centerY - logoBox / 2, logoBox, logoBox, logoBox * 0.2);
      ctx.clip();
      ctx.drawImage(state.logoImage, centerX - logoBox / 2, centerY - logoBox / 2, logoBox, logoBox);
      ctx.restore();
    } else {
      drawCenterIcon(ctx, options.centerIcon, centerX, centerY, logoBox * 0.8, options.accent);
    }
  }

  const fontFamily = getFontFamily(options.fontStyle);
  const scale = options.textScale;
  const textX = canvas.width / 2 + qrPixels * (options.textOffsetX / 100);
  const textStartY = qrY + qrPixels + qrPixels * (0.1 + options.textOffsetY / 100);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  if (options.topLabel) {
    ctx.fillStyle = options.accent;
    ctx.font = `700 ${Math.round(qrPixels * 0.028 * scale)}px ${fontFamily}`;
    ctx.fillText(options.topLabel, textX, Math.max(36, qrY * 0.55));
  }
  if (options.cta) {
    ctx.fillStyle = options.foreground;
    ctx.font = `800 ${Math.round(qrPixels * 0.05 * scale)}px ${fontFamily}`;
    ctx.fillText(options.cta, textX, textStartY);
  }
  let textY = textStartY + (options.cta ? qrPixels * 0.07 * scale : 0);
  if (options.title) {
    ctx.fillStyle = options.foreground;
    const weight = options.fontStyle === "bold" ? 850 : 700;
    ctx.font = `${weight} ${Math.round(qrPixels * 0.04 * scale)}px ${fontFamily}`;
    ctx.fillText(options.title, textX, textY);
    textY += qrPixels * 0.065 * scale;
  }
  if (options.caption) {
    ctx.fillStyle = "rgba(29,29,31,0.62)";
    ctx.font = `500 ${Math.round(qrPixels * 0.024 * scale)}px ${fontFamily}`;
    ctx.fillText(options.caption, textX, textY);
    textY += qrPixels * 0.048 * scale;
  }
  if (options.footer) {
    ctx.fillStyle = "rgba(29,29,31,0.46)";
    ctx.font = `600 ${Math.round(qrPixels * 0.02 * scale)}px ${fontFamily}`;
    ctx.fillText(options.footer, textX, Math.min(canvas.height - 28, textY));
  }
}

function generateSvg(qr, options) {
  const effective = getEffectiveRenderSettings(options, qr);
  const totalModules = qr.size + effective.quietZone * 2;
  const cell = options.exportSize / totalModules;
  const labelHeight = Math.round(options.exportSize * (0.18 + Math.max(0, options.textOffsetY) / 100) + 150 * options.textScale);
  const height = options.exportSize + labelHeight;
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${options.exportSize}" height="${height}" viewBox="0 0 ${options.exportSize} ${height}">`,
    `<rect width="100%" height="100%" fill="${options.background}"/>`,
  ];
  const offset = options.quietZone * cell;
  const safeOffset = effective.quietZone * cell;
  const r = effective.pattern === "rounded" || effective.pattern === "weave" ? cell * 0.2 : 0;
  const svgLogoBox = options.exportSize * (effective.logoSize / 100);
  const svgLogoCenterX = options.exportSize / 2 + options.exportSize * (effective.logoOffsetX / 100);
  const svgLogoCenterY = options.exportSize / 2 + options.exportSize * (effective.logoOffset / 100);
  const svgLogoClearSize = Math.max(svgLogoBox * effective.logoClearance, svgLogoBox + cell * 2);
  const svgLogoArea = (state.logoDataUrl || options.centerIcon !== "none") && effective.logoSize > 0 ? {
    x: svgLogoCenterX - svgLogoClearSize / 2,
    y: svgLogoCenterY - svgLogoClearSize / 2,
    width: svgLogoClearSize,
    height: svgLogoClearSize,
  } : null;

  for (let y = 0; y < qr.size; y += 1) {
    for (let x = 0; x < qr.size; x += 1) {
      if (!qr.modules[y][x] || isInFinder(x, y, qr.size)) continue;
      const px = safeOffset + x * cell;
      const py = safeOffset + y * cell;
      if (isInLogoClearArea(px, py, cell, svgLogoArea)) continue;
      if (effective.pattern === "dots") {
        parts.push(`<circle cx="${px + cell / 2}" cy="${py + cell / 2}" r="${cell * 0.38}" fill="${options.foreground}"/>`);
      } else if (effective.pattern === "diamond") {
        parts.push(`<rect x="${px + cell * 0.18}" y="${py + cell * 0.18}" width="${cell * 0.64}" height="${cell * 0.64}" rx="${cell * 0.08}" fill="${options.foreground}" transform="rotate(45 ${px + cell / 2} ${py + cell / 2})"/>`);
      } else if (effective.pattern === "square") {
        parts.push(`<rect x="${px}" y="${py}" width="${cell}" height="${cell}" fill="${options.foreground}"/>`);
      } else {
        parts.push(`<rect x="${px + cell * 0.08}" y="${py + cell * 0.08}" width="${cell * 0.84}" height="${cell * 0.84}" rx="${r}" fill="${options.foreground}"/>`);
      }
    }
  }

  const eye = (x, y) => {
    const eyeAccent = options.scanSafe && qr.version >= 7 ? options.foreground : options.accent;
    parts.push(`<rect x="${x}" y="${y}" width="${cell * 7}" height="${cell * 7}" rx="${effective.eyeStyle === "rounded" ? cell * 1.35 : 0}" fill="${options.foreground}"/>`);
    parts.push(`<rect x="${x + cell}" y="${y + cell}" width="${cell * 5}" height="${cell * 5}" rx="${effective.eyeStyle === "rounded" ? cell * 0.9 : 0}" fill="${options.background}"/>`);
    parts.push(`<rect x="${x + cell * 2}" y="${y + cell * 2}" width="${cell * 3}" height="${cell * 3}" rx="${effective.eyeStyle === "rounded" ? cell * 0.62 : 0}" fill="${eyeAccent}"/>`);
  };
  eye(safeOffset, safeOffset);
  eye(safeOffset + (qr.size - 7) * cell, safeOffset);
  eye(safeOffset, safeOffset + (qr.size - 7) * cell);

  if (state.logoDataUrl && effective.logoSize > 0) {
    const logoBox = svgLogoBox;
    const x = svgLogoCenterX - logoBox / 2;
    const y = svgLogoCenterY - logoBox / 2;
    if (options.logoPlate) {
      const plate = svgLogoClearSize;
      parts.push(`<rect x="${svgLogoCenterX - plate / 2}" y="${svgLogoCenterY - plate / 2}" width="${plate}" height="${plate}" rx="${plate * 0.24}" fill="white" opacity="0.96"/>`);
    }
    parts.push(`<image href="${state.logoDataUrl}" x="${x}" y="${y}" width="${logoBox}" height="${logoBox}" preserveAspectRatio="xMidYMid slice"/>`);
  }

  const svgTextX = options.exportSize / 2 + options.exportSize * (options.textOffsetX / 100);
  const svgTextStartY = options.exportSize + options.exportSize * (0.1 + options.textOffsetY / 100);
  const svgFont = getFontFamily(options.fontStyle);
  const svgScale = options.textScale;
  if (options.cta) {
    parts.push(`<text x="${svgTextX}" y="${svgTextStartY}" text-anchor="middle" font-family="${svgFont}" font-size="${Math.round(options.exportSize * 0.05 * svgScale)}" font-weight="800" fill="${options.foreground}">${escapeXml(options.cta)}</text>`);
  }
  if (options.title) {
    const y = svgTextStartY + (options.cta ? options.exportSize * 0.07 * svgScale : 0);
    parts.push(`<text x="${svgTextX}" y="${y}" text-anchor="middle" font-family="${svgFont}" font-size="${Math.round(options.exportSize * 0.04 * svgScale)}" font-weight="700" fill="${options.foreground}">${escapeXml(options.title)}</text>`);
  }
  if (options.caption) {
    const y = svgTextStartY + (options.cta ? options.exportSize * 0.07 * svgScale : 0) + (options.title ? options.exportSize * 0.065 * svgScale : 0);
    parts.push(`<text x="${svgTextX}" y="${y}" text-anchor="middle" font-family="${svgFont}" font-size="${Math.round(options.exportSize * 0.024 * svgScale)}" font-weight="500" fill="rgba(29,29,31,0.62)">${escapeXml(options.caption)}</text>`);
  }
  parts.push("</svg>");
  return parts.join("");
}

function escapeXml(value) {
  return value.replace(/[<>&"']/g, (char) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "\"": "&quot;",
    "'": "&apos;",
  }[char]));
}

function compactStatus(message) {
  if (/firebase config/i.test(message)) return "Firebase config";
  if (/prihl|auth|heslo|email/i.test(message)) return "Account";
  if (/cloud/i.test(message)) return "Cloud";
  if (message.length <= 24) return message;
  return `${message.slice(0, 21)}...`;
}

function setStatus(message, type = "") {
  dom.status.textContent = compactStatus(message);
  dom.status.title = message;
  dom.status.className = `status-pill${type ? ` ${type}` : ""}`;
}

function setAccountNotice(message, type = "secure") {
  if (!dom.accountNotice) return;
  dom.accountNotice.textContent = message;
  dom.accountNotice.className = `notice ${type}`;
}

function render() {
  if (!state.suppressRawSync) syncRawFromFields();
  const options = getOptions();
  state.lastOptions = options;
  dom.logoSizeValue.textContent = `${options.logoSize}%`;
  dom.quietZoneValue.textContent = String(options.quietZone);
  dom.printBlurValue.textContent = String(options.printBlur);
  document.documentElement.style.setProperty("--accent", options.accent);

  try {
    const qr = generateQr(options.text, options.ecl);
    state.lastQr = qr;
    drawQrToCanvas(dom.canvas, qr, options);
    const readability = getReadability(options, qr);
    setStatus(`Verzia ${qr.version} · maska ${qr.mask}`);
    dom.readabilityScore.textContent = `Skore ${readability.score}`;
    dom.readabilityScore.className = `score-pill ${readability.score >= 82 ? "good" : readability.score >= 62 ? "warn" : "bad"}`;
    dom.readabilityNotes.textContent = readability.notes.join(" ");
  } catch (error) {
    setStatus("Obsah je príliš dlhý", "error");
    dom.status.classList.remove("shake");
    void dom.status.offsetWidth;
    dom.status.classList.add("shake");
  }
}

function download(name, url) {
  const link = document.createElement("a");
  link.download = name;
  link.href = url;
  link.click();
}

function getFileStamp() {
  return new Date().toISOString().slice(0, 19).replace(/[-:T]/g, "");
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function collectFormState() {
  const fields = {};
  document.querySelectorAll("input, textarea, select").forEach((control) => {
    if (!control.id || ["accountPassword", "vaultPassphrase"].includes(control.id)) return;
    fields[control.id] = control.type === "checkbox" ? control.checked : control.value;
  });
  return {
    id: crypto.randomUUID(),
    name: safeValue(dom.projectName) || "QR projekt",
    createdAt: new Date().toISOString(),
    fields,
    logoDataUrl: state.logoDataUrl,
  };
}

function applyFormState(project) {
  if (!project || !project.fields) return;
  Object.entries(project.fields).forEach(([id, value]) => {
    const control = document.getElementById(id);
    if (!control) return;
    if (control.type === "checkbox") control.checked = Boolean(value);
    else control.value = value;
  });
  if (project.logoDataUrl) {
    const image = new Image();
    image.onload = () => {
      state.logoImage = image;
      state.logoDataUrl = project.logoDataUrl;
      setActiveContentFields();
      render();
    };
    image.src = project.logoDataUrl;
  } else {
    state.logoImage = null;
    state.logoDataUrl = "";
  }
  setActiveContentFields();
  render();
}

function saveHistory() {
  const history = readJson(STORAGE_KEYS.history, []);
  const snapshot = collectFormState();
  const next = [snapshot, ...history.filter((item) => item.text !== snapshot.fields.qrText)].slice(0, 10);
  writeJson(STORAGE_KEYS.history, next);
  renderLists();
}

function saveLocalProject() {
  const projects = readJson(STORAGE_KEYS.projects, []);
  const snapshot = collectFormState();
  const next = [snapshot, ...projects].slice(0, 30);
  writeJson(STORAGE_KEYS.projects, next);
  renderLists();
  setStatus("Projekt ulozeny lokalne", "success");
}

function saveBrandKit() {
  writeJson(STORAGE_KEYS.brand, {
    foreground: dom.foreground.value,
    background: dom.background.value,
    accent: dom.accent.value,
    fontStyle: dom.fontStyle.value,
    logoDataUrl: state.logoDataUrl,
  });
  setStatus("Brand kit ulozeny", "success");
}

function loadBrandKit() {
  const brand = readJson(STORAGE_KEYS.brand, null);
  if (!brand) return;
  dom.foreground.value = brand.foreground || dom.foreground.value;
  dom.background.value = brand.background || dom.background.value;
  dom.accent.value = brand.accent || dom.accent.value;
  dom.fontStyle.value = brand.fontStyle || dom.fontStyle.value;
  if (brand.logoDataUrl) {
    const image = new Image();
    image.onload = () => {
      state.logoImage = image;
      state.logoDataUrl = brand.logoDataUrl;
      render();
    };
    image.src = brand.logoDataUrl;
  }
}

function renderLists() {
  const renderItem = (project) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "item-card";
    button.innerHTML = `<strong>${escapeXml(project.name || "QR projekt")}</strong><span>${new Date(project.createdAt).toLocaleString("sk-SK")}</span>`;
    button.addEventListener("click", () => applyFormState(project));
    return button;
  };
  dom.historyList.replaceChildren(...readJson(STORAGE_KEYS.history, []).map(renderItem));
  dom.projectList.replaceChildren(...readJson(STORAGE_KEYS.projects, []).map(renderItem));
}

function bytesToBase64(bytes) {
  let binary = "";
  new Uint8Array(bytes).forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function openEmbeddedFirebaseConfig() {
  const bytes = base64ToBytes(FIREBASE_CONFIG_SEAL);
  const text = Array.from(bytes, (byte, index) => (
    String.fromCharCode(byte ^ FIREBASE_CONFIG_SEAL_KEY.charCodeAt(index % FIREBASE_CONFIG_SEAL_KEY.length))
  )).join("");
  return JSON.parse(text);
}

function getOrCreateVaultSalt() {
  let salt = localStorage.getItem(STORAGE_KEYS.vaultSalt);
  if (!salt) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    salt = bytesToBase64(bytes);
    localStorage.setItem(STORAGE_KEYS.vaultSalt, salt);
  }
  return base64ToBytes(salt);
}

async function deriveVaultKey() {
  const passphrase = dom.vaultPassphrase.value;
  if (passphrase.length < 12) throw new Error("Vault fraza musi mat aspon 12 znakov.");
  const material = await crypto.subtle.importKey("raw", encoder.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: getOrCreateVaultSalt(), iterations: 310000, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

async function encryptProject(project) {
  const key = await deriveVaultKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = encoder.encode(JSON.stringify(project));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plaintext);
  return {
    version: 1,
    algorithm: "AES-GCM",
    kdf: "PBKDF2-SHA-256",
    iterations: 310000,
    salt: localStorage.getItem(STORAGE_KEYS.vaultSalt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(ciphertext),
    updatedAt: new Date().toISOString(),
  };
}

async function decryptProject(record) {
  if (record.salt) localStorage.setItem(STORAGE_KEYS.vaultSalt, record.salt);
  const key = await deriveVaultKey();
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64ToBytes(record.iv) }, key, base64ToBytes(record.ciphertext));
  return JSON.parse(decoder.decode(plaintext));
}

async function initFirebase() {
  if (state.firebase) return state.firebase;
  const config = openEmbeddedFirebaseConfig();
  const [{ initializeApp }, authMod, firestoreMod] = await Promise.all([
    import(FIREBASE_IMPORTS.app),
    import(FIREBASE_IMPORTS.auth),
    import(FIREBASE_IMPORTS.firestore),
  ]);
  const app = initializeApp(config);
  const auth = authMod.getAuth(app);
  const db = firestoreMod.getFirestore(app);
  authMod.onAuthStateChanged(auth, (user) => {
    state.currentUser = user;
    dom.accountState.textContent = user ? user.email : "Offline";
  });
  state.firebase = { app, auth, db, authMod, firestoreMod };
  return state.firebase;
}

async function signUp() {
  const fb = await initFirebase();
  const credential = await fb.authMod.createUserWithEmailAndPassword(fb.auth, safeValue(dom.accountEmail), dom.accountPassword.value);
  state.currentUser = credential.user;
  dom.accountState.textContent = credential.user.email;
  setStatus("Registracia uspesna", "success");
  setAccountNotice(`Ucet ${credential.user.email} je vytvoreny a prihlaseny.`, "secure");
}

async function signIn() {
  const fb = await initFirebase();
  const credential = await fb.authMod.signInWithEmailAndPassword(fb.auth, safeValue(dom.accountEmail), dom.accountPassword.value);
  state.currentUser = credential.user;
  dom.accountState.textContent = credential.user.email;
  setStatus("Prihlasene", "success");
  setAccountNotice(`Prihlasene ako ${credential.user.email}. Cloud projekty ostavaju sifrovane vault frazou.`, "secure");
}

async function signOut() {
  if (!state.firebase) return;
  await state.firebase.authMod.signOut(state.firebase.auth);
  state.currentUser = null;
  dom.accountState.textContent = "Offline";
  setStatus("Odhlasene");
  setAccountNotice("Odhlasene. Cloud uklada iba zasifrovane projekty. Vault fraza sa neposiela do Firebase.", "secure");
}

async function saveCloudProject() {
  const fb = await initFirebase();
  const user = fb.auth.currentUser;
  if (!user) throw new Error("Najprv sa prihlaste.");
  const encrypted = await encryptProject(collectFormState());
  await fb.firestoreMod.setDoc(fb.firestoreMod.doc(fb.db, "users", user.uid, "projects", "active"), encrypted);
  setStatus("Cloud ulozeny", "success");
  setAccountNotice("Cloud projekt bol ulozeny sifrovane.", "secure");
}

async function loadCloudProject() {
  const fb = await initFirebase();
  const user = fb.auth.currentUser;
  if (!user) throw new Error("Najprv sa prihlaste.");
  const snap = await fb.firestoreMod.getDoc(fb.firestoreMod.doc(fb.db, "users", user.uid, "projects", "active"));
  if (!snap.exists()) throw new Error("Cloud projekt zatial neexistuje.");
  const project = await decryptProject(snap.data());
  applyFormState(project);
  setStatus("Cloud nacitany", "success");
  setAccountNotice("Cloud projekt bol nacitany a desifrovany vo vasom prehliadaci.", "secure");
}

async function guarded(action) {
  try {
    await action();
  } catch (error) {
    const message = error.message || "Akcia zlyhala";
    setStatus(message, "error");
    setAccountNotice(message, "error");
    dom.status.classList.remove("shake");
    void dom.status.offsetWidth;
    dom.status.classList.add("shake");
  }
}

function applyTemplate() {
  const preset = TEMPLATE_PRESETS[dom.template.value];
  if (!preset) return;
  dom.foreground.value = preset.fg;
  dom.background.value = preset.bg;
  dom.accent.value = preset.accent;
  dom.frameColor.value = preset.frameColor;
  dom.pattern.value = preset.pattern;
  dom.frameStyle.value = preset.frame;
  dom.canvasFormat.value = preset.format;
  render();
}

function setupCollapsiblePanels() {
  const saved = readJson(STORAGE_KEYS.collapsedPanels, null);
  const collapsed = new Set(saved || []);

  document.querySelectorAll(".control-pane .panel").forEach((panel, index) => {
    const title = Array.from(panel.children).find((child) => child.classList && child.classList.contains("panel-title"));
    if (!title || panel.classList.contains("collapsible")) return;

    const body = document.createElement("div");
    body.className = "panel-body";
    Array.from(panel.children).forEach((child) => {
      if (child !== title) body.appendChild(child);
    });
    panel.appendChild(body);
    panel.classList.add("collapsible");

    const label = title.querySelector("span");
    if (label && !label.classList.contains("panel-title-main")) label.classList.add("panel-title-main");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "collapse-toggle";
    button.setAttribute("aria-label", "Zbalit alebo rozbalit sekciu");
    title.appendChild(button);

    const panelName = label ? label.textContent.trim() : `panel-${index}`;
    const defaultCollapsed = saved ? collapsed.has(panelName) : index > 1;
    panel.classList.toggle("collapsed", defaultCollapsed);
    button.setAttribute("aria-expanded", String(!defaultCollapsed));

    const toggle = () => {
      const isCollapsed = !panel.classList.contains("collapsed");
      panel.classList.toggle("collapsed", isCollapsed);
      button.setAttribute("aria-expanded", String(!isCollapsed));
      const next = new Set(readJson(STORAGE_KEYS.collapsedPanels, []));
      if (isCollapsed) next.add(panelName);
      else next.delete(panelName);
      writeJson(STORAGE_KEYS.collapsedPanels, Array.from(next));
    };

    title.addEventListener("click", (event) => {
      if (event.target.closest(".collapse-toggle") || event.target === title || event.target.closest(".panel-title-main") || event.target.closest(".badge")) {
        toggle();
      }
    });
  });
}

function setupEvents() {
  document.querySelectorAll("input, textarea, select").forEach((control) => {
    const shouldRender = !["accountEmail", "accountPassword", "vaultPassphrase", "qrText"].includes(control.id);
    if (shouldRender) {
      control.addEventListener("input", render);
      control.addEventListener("change", render);
    }
  });

  dom.contentMode.addEventListener("change", () => {
    setActiveContentFields();
    render();
  });

  dom.text.addEventListener("input", () => {
    state.suppressRawSync = true;
    render();
    state.suppressRawSync = false;
  });

  dom.template.addEventListener("change", applyTemplate);
  dom.signUp.addEventListener("click", () => guarded(signUp));
  dom.signIn.addEventListener("click", () => guarded(signIn));
  dom.signOut.addEventListener("click", () => guarded(signOut));
  dom.saveLocal.addEventListener("click", saveLocalProject);
  dom.saveBrand.addEventListener("click", saveBrandKit);
  dom.saveCloud.addEventListener("click", () => guarded(saveCloudProject));
  dom.loadCloud.addEventListener("click", () => guarded(loadCloudProject));

  dom.logoInput.addEventListener("change", () => {
    const file = dom.logoInput.files && dom.logoInput.files[0];
    if (!file) {
      state.logoImage = null;
      state.logoDataUrl = "";
      render();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        state.logoImage = image;
        state.logoDataUrl = String(reader.result);
        render();
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });

  dom.swatches.querySelectorAll("button").forEach((button) => {
    button.style.setProperty("--swatch-fg", button.dataset.fg);
    button.style.setProperty("--swatch-bg", button.dataset.bg);
    button.style.setProperty("--swatch-accent", button.dataset.accent);
    button.addEventListener("click", () => {
      dom.foreground.value = button.dataset.fg;
      dom.background.value = button.dataset.bg;
      dom.accent.value = button.dataset.accent;
      dom.frameColor.value = button.dataset.accent;
      render();
    });
  });

  dom.downloadPng.addEventListener("click", () => {
    render();
    saveHistory();
    download(`qrcodenator-${getFileStamp()}.png`, dom.canvas.toDataURL("image/png"));
  });

  dom.downloadJpg.addEventListener("click", () => {
    render();
    saveHistory();
    download(`qrcodenator-${getFileStamp()}.jpg`, dom.canvas.toDataURL("image/jpeg", 0.94));
  });

  dom.downloadSvg.addEventListener("click", () => {
    const options = getOptions();
    const qr = state.lastQr || generateQr(options.text, options.ecl);
    const blob = new Blob([generateSvg(qr, options)], { type: "image/svg+xml" });
    saveHistory();
    download(`qrcodenator-${getFileStamp()}.svg`, URL.createObjectURL(blob));
  });

  dom.downloadPdf.addEventListener("click", () => {
    render();
    saveHistory();
    const popup = window.open("", "_blank");
    if (!popup) {
      setStatus("Pre PDF povolte popup okno", "error");
      return;
    }
    popup.document.write(`<!doctype html><title>QRcodenator PDF</title><style>body{margin:0;display:grid;place-items:center;min-height:100vh;background:#fff}img{max-width:100%;height:auto}@media print{button{display:none}}</style><button onclick="print()">Tlacit / ulozit PDF</button><img src="${dom.canvas.toDataURL("image/png")}">`);
    popup.document.close();
  });

  dom.copyPng.addEventListener("click", async () => {
    if (!navigator.clipboard || !window.ClipboardItem) {
      setStatus("Kopirovanie nepodporovane", "error");
      return;
    }
    dom.canvas.toBlob(async (blob) => {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      setStatus("Skopirovane", "success");
    }, "image/png");
  });

  dom.copySvg.addEventListener("click", async () => {
    if (!navigator.clipboard) {
      setStatus("Clipboard nepodporovany", "error");
      return;
    }
    const options = getOptions();
    const qr = state.lastQr || generateQr(options.text, options.ecl);
    await navigator.clipboard.writeText(generateSvg(qr, options));
    setStatus("SVG skopirovane", "success");
  });
}

function boot() {
  setupCollapsiblePanels();
  loadBrandKit();
  setActiveContentFields();
  renderLists();
  setupEvents();
  render();
}

boot();
