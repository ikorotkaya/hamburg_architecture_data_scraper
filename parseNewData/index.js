const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const finalProjects = require("../json/finalProjects.json");
const parseWebProjectData = require("../helpers/parseWebProjectData");
const geocodeAddress = require("../helpers/geocodeAddress");

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

    const maxProjectIndex = finalProjects.length;
    const allProjectData = [];

    for (let i = 0; i < projectLinks.length; i++) {
      const projectLink = projectLinks[i];
      const projectData = await parseWebProjectData(projectLink);
      if (projectData) {
        projectData.id = maxProjectIndex + i;
        allProjectData.push(projectData);
      } else {
        console.log(`Skipping ${projectLink}`);
      }
    }

    const geocodedData = await Promise.all(
      allProjectData.map(async (project) => {
        const { lat, lng } = await geocodeAddress(project.address);
        return {
          ...project,
          lat,
          lng,
        };
      })
    );

    const jsonData = JSON.stringify(geocodedData.filter(Boolean), null, 2);
    const outputPath = "json/projectsData20--.json"; //update file name with current year

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
