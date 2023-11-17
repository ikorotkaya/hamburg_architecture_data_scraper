const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const parseWebProjectData = require("./parseWebProjectData");

const baseUrl = "https://www.tda-hamburg.de";

(async () => {
  try {
    const response = await axios.get(baseUrl);
    const html = response.data;
    const $ = cheerio.load(html);
    const projectLinks = [];

    $(".figure a", html).each((i, projectLink) => {
      const relativeUrl = $(projectLink).attr("href");
      if (relativeUrl.includes("?tx_asommer_tdaevent%5Baction%5D=show")) { //check CSS selectors
        const completeUrl = baseUrl + relativeUrl;
        projectLinks.push(completeUrl);
      }
    });

    const allProjectData = [];

    for (const link of projectLinks) {
      const projectData = await parseWebProjectData(link);
      if (projectData !== null) {
        allProjectData.push(projectData);
      } else {
        console.log(`Skipping ${link}`);
      }
    }

    const jsonData = JSON.stringify(allProjectData, null, 2);
    const outputPath = "json/parsed_2023_data.json"; //update file name with year

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
