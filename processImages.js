const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputFolder = "./images";
const outputFolder = "./webp_images";

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

async function processImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize({ width: 800 })
      .webp()
      .toFile(outputPath);
    console.log(`Processed: ${outputPath}`);
  } catch (error) {
    console.error(`Error processing ${inputPath}: ${error.message}`);
  }
}

fs.readdirSync(inputFolder).forEach((file) => {
  const inputPath = path.join(inputFolder, file);
  const outputPath = path.join(outputFolder, `${path.parse(file).name}.webp`);
  processImage(inputPath, outputPath);
});
