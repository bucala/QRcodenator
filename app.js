const dom = {
  canvas: document.querySelector("#qrCanvas"),
  status: document.querySelector("#statusPill"),
  text: document.querySelector("#qrText"),
  labelTitle: document.querySelector("#labelTitle"),
  labelCaption: document.querySelector("#labelCaption"),
  pattern: document.querySelector("#patternStyle"),
  eyeStyle: document.querySelector("#eyeStyle"),
  foreground: document.querySelector("#foregroundColor"),
  background: document.querySelector("#backgroundColor"),
  accent: document.querySelector("#accentColor"),
  logoInput: document.querySelector("#logoInput"),
  logoSize: document.querySelector("#logoSize"),
  logoSizeValue: document.querySelector("#logoSizeValue"),
  logoPlate: document.querySelector("#logoPlate"),
  exportSize: document.querySelector("#exportSize"),
  errorCorrection: document.querySelector("#errorCorrection"),
  quietZone: document.querySelector("#quietZone"),
  quietZoneValue: document.querySelector("#quietZoneValue"),
  downloadPng: document.querySelector("#downloadPng"),
  downloadSvg: document.querySelector("#downloadSvg"),
  copyPng: document.querySelector("#copyPng"),
  swatches: document.querySelector("#swatches"),
};

const state = {
  logoImage: null,
  logoDataUrl: "",
  lastQr: null,
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

function getOptions() {
  return {
    text: dom.text.value.trim() || " ",
    title: dom.labelTitle.value.trim(),
    caption: dom.labelCaption.value.trim(),
    pattern: dom.pattern.value,
    eyeStyle: dom.eyeStyle.value,
    foreground: dom.foreground.value,
    background: dom.background.value,
    accent: dom.accent.value,
    logoSize: Number(dom.logoSize.value),
    logoPlate: dom.logoPlate.checked,
    exportSize: Number(dom.exportSize.value),
    quietZone: Number(dom.quietZone.value),
    ecl: dom.errorCorrection.value,
  };
}

function drawQrToCanvas(canvas, qr, options) {
  const ctx = canvas.getContext("2d");
  const qrPixels = options.exportSize;
  const labelHeight = (options.title ? 82 : 0) + (options.caption ? 46 : 0) + 42;
  canvas.width = qrPixels;
  canvas.height = qrPixels + labelHeight;

  const colors = {
    foreground: options.foreground,
    background: options.background,
    accent: options.accent,
  };

  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const totalModules = qr.size + options.quietZone * 2;
  const cell = qrPixels / totalModules;
  const offset = options.quietZone * cell;
  const modules = qr.modules;

  for (let y = 0; y < qr.size; y += 1) {
    for (let x = 0; x < qr.size; x += 1) {
      if (!modules[y][x] || isInFinder(x, y, qr.size)) continue;
      const px = offset + x * cell;
      const py = offset + y * cell;
      drawModule(ctx, px, py, cell, options.pattern, colors.foreground, modules, x, y);
    }
  }

  drawEye(ctx, offset, offset, cell, options.eyeStyle, colors);
  drawEye(ctx, offset + (qr.size - 7) * cell, offset, cell, options.eyeStyle, colors);
  drawEye(ctx, offset, offset + (qr.size - 7) * cell, cell, options.eyeStyle, colors);

  if (state.logoImage && options.logoSize > 0) {
    const logoBox = qrPixels * (options.logoSize / 100);
    const centerX = qrPixels / 2;
    const centerY = qrPixels / 2;
    const plate = logoBox * 1.22;

    if (options.logoPlate) {
      ctx.fillStyle = "rgba(255,255,255,0.96)";
      roundRect(ctx, centerX - plate / 2, centerY - plate / 2, plate, plate, plate * 0.24);
      ctx.fill();
      ctx.strokeStyle = "rgba(29,29,31,0.08)";
      ctx.lineWidth = Math.max(2, qrPixels / 360);
      ctx.stroke();
    }

    ctx.save();
    roundRect(ctx, centerX - logoBox / 2, centerY - logoBox / 2, logoBox, logoBox, logoBox * 0.2);
    ctx.clip();
    ctx.drawImage(state.logoImage, centerX - logoBox / 2, centerY - logoBox / 2, logoBox, logoBox);
    ctx.restore();
  }

  let textY = qrPixels + 34;
  ctx.textAlign = "center";
  ctx.fillStyle = colors.foreground;
  if (options.title) {
    ctx.font = `700 ${Math.round(qrPixels * 0.042)}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
    ctx.fillText(options.title, qrPixels / 2, textY + qrPixels * 0.038);
    textY += 70;
  }
  if (options.caption) {
    ctx.fillStyle = "rgba(29,29,31,0.62)";
    ctx.font = `500 ${Math.round(qrPixels * 0.024)}px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`;
    ctx.fillText(options.caption, qrPixels / 2, textY);
  }
}

function generateSvg(qr, options) {
  const totalModules = qr.size + options.quietZone * 2;
  const cell = options.exportSize / totalModules;
  const labelHeight = (options.title ? 82 : 0) + (options.caption ? 46 : 0) + 42;
  const height = options.exportSize + labelHeight;
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${options.exportSize}" height="${height}" viewBox="0 0 ${options.exportSize} ${height}">`,
    `<rect width="100%" height="100%" fill="${options.background}"/>`,
  ];
  const offset = options.quietZone * cell;
  const r = options.pattern === "rounded" || options.pattern === "weave" ? cell * 0.2 : 0;

  for (let y = 0; y < qr.size; y += 1) {
    for (let x = 0; x < qr.size; x += 1) {
      if (!qr.modules[y][x] || isInFinder(x, y, qr.size)) continue;
      const px = offset + x * cell;
      const py = offset + y * cell;
      if (options.pattern === "dots") {
        parts.push(`<circle cx="${px + cell / 2}" cy="${py + cell / 2}" r="${cell * 0.38}" fill="${options.foreground}"/>`);
      } else if (options.pattern === "diamond") {
        parts.push(`<rect x="${px + cell * 0.18}" y="${py + cell * 0.18}" width="${cell * 0.64}" height="${cell * 0.64}" rx="${cell * 0.08}" fill="${options.foreground}" transform="rotate(45 ${px + cell / 2} ${py + cell / 2})"/>`);
      } else {
        parts.push(`<rect x="${px + cell * 0.08}" y="${py + cell * 0.08}" width="${cell * 0.84}" height="${cell * 0.84}" rx="${r}" fill="${options.foreground}"/>`);
      }
    }
  }

  const eye = (x, y) => {
    parts.push(`<rect x="${x}" y="${y}" width="${cell * 7}" height="${cell * 7}" rx="${options.eyeStyle === "rounded" ? cell * 1.35 : 0}" fill="${options.foreground}"/>`);
    parts.push(`<rect x="${x + cell}" y="${y + cell}" width="${cell * 5}" height="${cell * 5}" rx="${options.eyeStyle === "rounded" ? cell * 0.9 : 0}" fill="${options.background}"/>`);
    parts.push(`<rect x="${x + cell * 2}" y="${y + cell * 2}" width="${cell * 3}" height="${cell * 3}" rx="${options.eyeStyle === "rounded" ? cell * 0.62 : 0}" fill="${options.accent}"/>`);
  };
  eye(offset, offset);
  eye(offset + (qr.size - 7) * cell, offset);
  eye(offset, offset + (qr.size - 7) * cell);

  if (state.logoDataUrl && options.logoSize > 0) {
    const logoBox = options.exportSize * (options.logoSize / 100);
    const x = options.exportSize / 2 - logoBox / 2;
    const y = options.exportSize / 2 - logoBox / 2;
    if (options.logoPlate) {
      const plate = logoBox * 1.22;
      parts.push(`<rect x="${options.exportSize / 2 - plate / 2}" y="${options.exportSize / 2 - plate / 2}" width="${plate}" height="${plate}" rx="${plate * 0.24}" fill="white" opacity="0.96"/>`);
    }
    parts.push(`<image href="${state.logoDataUrl}" x="${x}" y="${y}" width="${logoBox}" height="${logoBox}" preserveAspectRatio="xMidYMid slice"/>`);
  }

  if (options.title) {
    parts.push(`<text x="50%" y="${options.exportSize + 70}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="${Math.round(options.exportSize * 0.042)}" font-weight="700" fill="${options.foreground}">${escapeXml(options.title)}</text>`);
  }
  if (options.caption) {
    const y = options.exportSize + (options.title ? 118 : 66);
    parts.push(`<text x="50%" y="${y}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="${Math.round(options.exportSize * 0.024)}" font-weight="500" fill="rgba(29,29,31,0.62)">${escapeXml(options.caption)}</text>`);
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

function render() {
  const options = getOptions();
  dom.logoSizeValue.textContent = `${options.logoSize}%`;
  dom.quietZoneValue.textContent = String(options.quietZone);
  document.documentElement.style.setProperty("--accent", options.accent);

  try {
    const qr = generateQr(options.text, options.ecl);
    state.lastQr = qr;
    drawQrToCanvas(dom.canvas, qr, options);
    dom.status.textContent = `Verzia ${qr.version} · maska ${qr.mask}`;
  } catch (error) {
    dom.status.textContent = "Obsah je príliš dlhý";
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

function setupEvents() {
  document.querySelectorAll("input, textarea, select").forEach((control) => {
    control.addEventListener("input", render);
    control.addEventListener("change", render);
  });

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
      render();
    });
  });

  dom.downloadPng.addEventListener("click", () => {
    render();
    download(`qrcodenator-${getFileStamp()}.png`, dom.canvas.toDataURL("image/png"));
  });

  dom.downloadSvg.addEventListener("click", () => {
    const options = getOptions();
    const qr = state.lastQr || generateQr(options.text, options.ecl);
    const blob = new Blob([generateSvg(qr, options)], { type: "image/svg+xml" });
    download(`qrcodenator-${getFileStamp()}.svg`, URL.createObjectURL(blob));
  });

  dom.copyPng.addEventListener("click", async () => {
    if (!navigator.clipboard || !window.ClipboardItem) {
      dom.status.textContent = "Kopírovanie nepodporované";
      return;
    }
    dom.canvas.toBlob(async (blob) => {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      dom.status.textContent = "Skopírované";
    }, "image/png");
  });
}

setupEvents();
render();
