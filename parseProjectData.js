const axios = require("axios");
const cheerio = require("cheerio");
const fs = require('fs');

const baseUrl = "https://www.tda-hamburg.de";

const parseProjectData = async (link) => {
  const response = await axios(link);
  const html = response.data;
  const $ = cheerio.load(html);
  const projectData = {};

  projectData.title = $("h2").text();
  projectData.description = $("div.description p").text();
  projectData.buildingType = $("div.detail-row:contains('Bautypologie') p").text().trim();
  projectData.district = $("div.district p").text().trim();
  if (!$("div.categories").text().includes("Touren")) {
    projectData.category = $("div.categories").text().trim();
  }
  projectData.address = $("div.detail-row:contains('Standort') p").text().trim();
  imageSrc = $("div.iteminnerimage img").attr("src");
  if (imageSrc !== undefined) {
    projectData.image = baseUrl + imageSrc;
  } else {
    projectData.image = "";
  }
  projectData.architect = $("div.detail-row:contains('Architekturbüro') p").text().trim();
  if (projectData.architect.includes("www.")) {
    // Split the text by whitespace and select the part containing "www."
    const parts = projectData.architect.split(" ");
    const webAddress = parts.find(part => part.includes("www."));
    projectData.architectWeb = webAddress;
    projectData.architect = projectData.architect.replace(webAddress, '').replace(/, $/, '');
    } else {
      projectData.architectWeb = "";
  }
  projectData.year = $("div.detail-row:contains('Jahr der Fertigstellung') p").text().trim();
  projectData.link = link;
  // get a parameter from tx_asommer_tdaevent[event] in projectData.link and assign it to projectData.id
  const urlParams = new URLSearchParams(link);
  proojectId = urlParams.get("tx_asommer_tdaevent[event]");
  projectData.id = parseInt(proojectId);

  // export image to local folder from projectData.image url with projectData.id as filename (if projectData.image is not empty)
  if (projectData.image !== "") {
    const path = require('path');
    const download = require('image-downloader');
    const options = {
      url: projectData.image,
      dest: path.join(__dirname, 'images', projectData.id + '.jpg')
    };  
    download.image(options)
      .then(({ filename }) => {
        console.log('Saved to', filename)
      })
      .catch((err) => console.error(err))
  }
  
  return projectData;
};

module.exports = parseProjectData;