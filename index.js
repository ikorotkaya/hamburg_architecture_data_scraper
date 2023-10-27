const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const parseProjectData = require("./parseProjectData.js");

const baseUrl = "https://www.tda-hamburg.de";

(async () => {
  try {
    const response = await axios.get(baseUrl);
    const html = response.data;
    const $ = cheerio.load(html);
    const projectLinks = [];

    $(".figure a", html).each((i, projectLink) => {
      const relativeUrl = $(projectLink).attr("href");
      if (relativeUrl.includes("?tx_asommer_tdaevent%5Baction%5D=show")) {
        const completeUrl = baseUrl + relativeUrl;
        projectLinks.push(completeUrl);
      }
    });

    const allProjectData = [];

    for (const link of projectLinks) {
      const projectData = await parseProjectData(link);
      if (projectData !== null) {
        allProjectData.push(projectData);
      } else {
        console.log(`Skipping ${link}`);
      }
    }

    const jsonData = JSON.stringify(allProjectData, null, 2);
    const outputPath = "allProjectData.json";

    fs.writeFile(outputPath, jsonData, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Data written to ${outputPath}`);
      }
    });
  } catch (error) {
    console.log(error);
  }
})();
