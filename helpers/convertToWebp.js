import sharp from "sharp";

async function convertToWebp(inputPath, outputPath, width = 800) {
  try {
    await sharp(inputPath).resize({ width }).webp().toFile(outputPath);
    console.log(`Converted ${inputPath} to WebP: ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath} to WebP: ${error.message}`);
  }
}

module.exports = convertToWebp;