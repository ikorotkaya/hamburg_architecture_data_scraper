import fs from "fs";
import path from "path";

const convertToWebp = require("../helpers/convertToWebp");

const inputFolderPath = "./images";
const outputFolderPath = "./webp_images";

if (!fs.existsSync(outputFolderPath)) {
  fs.mkdirSync(outputFolderPath);
}

fs.readdirSync(inputFolderPath).forEach((fileName) => {
  const inputPath = path.join(inputFolderPath, fileName);
  const outputFileName = `${path.parse(fileName).name}.webp`;
  const outputPath = path.join(outputFolderPath, outputFileName);
  convertToWebp(inputPath, outputPath);
});
