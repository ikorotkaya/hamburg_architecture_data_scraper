const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const download = require("image-downloader");
const fs = require("fs");

const baseUrl = "https://www.tda-hamburg.de";

const parseProjectData = async (link) => {
  const response = await axios(link);
  const html = response.data;
  const $ = cheerio.load(html);
  const projectData = {};

  const addressElement = $("div.detail-row:contains('Standort') p");
  const yearElement = $("div.detail-row:contains('Jahr der Fertigstellung') p");

  if (
    !addressElement.text() ||
    isNaN(Number(yearElement.text())) ||
    $("div.categories").text().includes("Touren")
  ) {
    return null;
  }

  projectData.title = $("h2").text();
  projectData.description = $("div.description p").text();
  projectData.buildingType = $("div.detail-row:contains('Bautypologie') p")
    .text()
    .trim();
  projectData.district = $("div.district p").text().trim();
  projectData.address = addressElement.text().trim();
  projectData.category = $("div.categories").text().trim();
  projectData.architect = $("div.detail-row:contains('Architekturbüro') p")
    .text()
    .trim();
  if (projectData.architect.includes("www.")) {
    const parts = projectData.architect.split(" ");
    const webAddress = parts.find((part) => part.includes("www."));
    projectData.architect = projectData.architect
      .replace(webAddress, "")
      .replace(/, $/, "");
  }
  projectData.year = yearElement.text().trim();
  projectData.link = link;

  const urlParams = new URLSearchParams(link);
  proojectId = urlParams.get("tx_asommer_tdaevent[event]");
  projectData.id = parseInt(proojectId);

  imageSrc = $("div.iteminnerimage img").attr("src");
  if (imageSrc !== undefined) {
    imageUrl = baseUrl + imageSrc;
    if (imageUrl !== "") {
      const options = {
        url: imageUrl,
        dest: path.join(__dirname, "images", projectData.id + ".jpg"),
      };
      download
        .image(options)
        .then(({ filename }) => {
          console.log("Saved to", filename);
        })
        .catch((err) => console.error(err));
    }
  }
  return projectData;
};

module.exports = parseProjectData;
