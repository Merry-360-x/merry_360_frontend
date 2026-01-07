const fs = require('fs');
const os = require('os');
const path = require('path');

// Tiny 1x1 PNG (transparent)
const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/ccz6wAAAABJRU5ErkJggg==';

function writeTempPng({ name = 'e2e-image' } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'merry360-e2e-'));
  const filePath = path.join(dir, `${name}.png`);
  fs.writeFileSync(filePath, Buffer.from(PNG_BASE64, 'base64'));
  return filePath;
}

module.exports = {
  writeTempPng,
};
