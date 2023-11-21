const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");
const download = require("image-downloader");

const BASE_URL = "https://www.tda-hamburg.de";

const parseWebProjectData = async (link) => {
  try {
    const response = await axios(link);
    const html = response.data;
    const $ = cheerio.load(html);

    const imageSrc = $("div.iteminnerimage img").attr("src");
    
    
    if (imageSrc) {
      const projectData = {};
      const imageUrl = BASE_URL + imageSrc;
      projectData.imageUrl = imageUrl;

      const addressElement = $("div.detail-row:contains('Standort') p");
      const yearElement = $(
        "div.detail-row:contains('Jahr der Fertigstellung') p"
      );

      if (
        !addressElement.text() ||
        isNaN(Number(yearElement.text())) ||
        $("div.categories").text().includes("Touren")
      ) {
        return null;
      }

      projectData.title = $("h2").text();
      projectData.description = $("div.description p").text();
      projectData.district = $("div.district p").text().trim();
      projectData.address = addressElement.text().trim();
      if (!projectData.address.includes("Hamburg")) {
        projectData.address += ", Hamburg";
      }

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

      return projectData; 
    } else {
      // skip projects without images
      return null;
    }
  } catch (error) {
    console.error("Error parsing project data:", error.message);
    return null;
  }
};

module.exports = parseWebProjectData;
