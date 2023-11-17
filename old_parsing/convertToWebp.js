import sharp from "sharp";
import fs from "fs";
import path from "path";

const inputFolderPath = "./images";
const outputFolderPath = "./webp_images";

if (!fs.existsSync(outputFolderPath)) {
  fs.mkdirSync(outputFolderPath);
}

async function convertToWebp(inputPath, outputPath) {
  try {
    await sharp(inputPath).resize({ width: 800 }).webp().toFile(outputPath);
    console.log(`Converted ${inputPath} to WebP: ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath} to WebP: ${error.message}`);
  }
}

fs.readdirSync(inputFolderPath).forEach((fileName) => {
  const inputPath = path.join(inputFolderPath, fileName);
  const outputFileName = `${path.parse(fileName).name}.webp`;
  const outputPath = path.join(outputFolderPath, outputFileName);
  convertToWebp(inputPath, outputPath);
});
