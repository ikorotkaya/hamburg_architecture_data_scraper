const axios = require("axios");
const cheerio = require("cheerio");

const processAndWriteFinalProjects = require("../helpers/processAndWriteFinalProjects");
const finalProjects = require("../json/finalProjects.json");

const baseUrl = "https://www.tda-hamburg.de";
const year = 2024; // change this to the current year to get the correct name of the output file

(async () => {
  try {
    const response = await axios.get(baseUrl);
    const html = response.data;
    const $ = cheerio.load(html);
    let projectLinks = [];

    $(".figure a", html).each((i, projectLink) => {
      const relativeUrl = $(projectLink).attr("href");
      if (relativeUrl.includes("?tx_asommer_tdaevent%5Baction%5D=show")) { //check CSS selectors
        const completeUrl = baseUrl + relativeUrl;
        projectLinks.push(completeUrl);
      }
    });

    const outputPath = `json/projectsData${year}.json`;
    const startingId = finalProjects.length > 0 ? finalProjects[finalProjects.length - 1].id : 1;

    await processAndWriteFinalProjects(projectLinks, outputPath, startingId);
    
  } catch (error) {
    console.log(error);
  }
})();
