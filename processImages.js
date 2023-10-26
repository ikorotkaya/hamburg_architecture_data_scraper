const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputFolder = './images'; // Folder containing your original images
const outputFolder = './webp_images'; // Folder to store the resized and converted images

// Create the output folder if it doesn't exist
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// Function to process an image
async function processImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize({ width: 800 }) // Resize to a specific width (adjust as needed)
      .webp() // Convert to WebP format
      .toFile(outputPath);
    console.log(`Processed: ${outputPath}`);
  } catch (error) {
    console.error(`Error processing ${inputPath}: ${error.message}`);
  }
}

// Read the files in the input folder and process each one
fs.readdirSync(inputFolder).forEach((file) => {
  const inputPath = path.join(inputFolder, file);
  const outputPath = path.join(outputFolder, `${path.parse(file).name}.webp`);
  processImage(inputPath, outputPath);
});
