// Usage: npm run images -- path/to/photo.jpg [more.jpg ...]
// Writes images/slideshow/<name>-<width>.webp for every width up to the original width.
import sharp from "sharp";
import path from "node:path";

const WIDTHS = [768, 1280, 1920, 2560];
const OUT_DIR = "images/slideshow";

for (const file of process.argv.slice(2)) {
  const name = path.parse(file).name.replace(/\s+/g, "-");
  const { width, height } = await sharp(file).metadata();
  const max = Math.min(width, 2560);
  const widths = WIDTHS.filter((w) => w < max).concat(max);

  for (const w of widths) {
    const out = `${OUT_DIR}/${name}-${w}.webp`;
    await sharp(file).rotate().resize({ width: w }).webp({ quality: 80 }).toFile(out);
    console.log(out);
  }
  console.log(`${name}: original ${width}x${height}, widths ${widths.join(", ")}`);
}
