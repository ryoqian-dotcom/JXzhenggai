const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputPath = path.join(__dirname, 'public', 'images', 'logo.jpg');
const outputDir = path.join(__dirname, 'public', 'icons');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}.png`);

    // Create a square icon with the logo centered on a dark background
    const background = Buffer.from(
      `<svg width="${size}" height="${size}">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0f172a"/>
            <stop offset="100%" style="stop-color:#1e3a5f"/>
          </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" rx="${Math.round(size * 0.15)}" fill="url(#bg)"/>
      </svg>`
    );

    const logoSize = Math.round(size * 0.6);
    const padding = Math.round((size - logoSize) / 2);

    const logo = await sharp(inputPath)
      .resize(logoSize, logoSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .toBuffer();

    await sharp(background)
      .composite([{
        input: logo,
        top: padding,
        left: padding,
      }])
      .png()
      .toFile(outputPath);

    console.log(`Generated: icon-${size}.png`);
  }
  console.log('All icons generated!');
}

generateIcons().catch(console.error);
