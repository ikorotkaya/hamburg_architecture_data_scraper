const path = require("path");
const download = require("image-downloader");

const BASE_URL = "https://www.tda-hamburg.de";

const saveImage = async (id, imageUrl) => {
  try {
    const options = {
      url: imageUrl,
      dest: path.join(__dirname, `../webp_images/${id}.webp`),
    };
    await download.image(options);
    console.log("Image saved successfully.", id);
  } catch (error) {
    console.log(error, id);
  }
};

module.exports = saveImage;
