const fs = require("fs");

const parseWebProjectData = require("./parseWebProjectData");
const geocodeAddress = require("./geocodeAddress");
const translateText = require("./translateText");

async function processAndWriteFinalProjects(projectLinks, outputPath, startingId) {
  const translatedProjects = await Promise.all(
    projectLinks.map(async (projectLink, index) => {
      const projectData = await parseWebProjectData(projectLink);
      if (projectData) {
        projectData.id = startingId + index;
        const { lat, lng } = await geocodeAddress(projectData.address);
        projectData.lat = lat;
        projectData.lng = lng;

        const translatedTitle = await translateText(projectData.title);
        const translatedDescription = await translateText(projectData.description);

        projectData.title = {
          de: projectData.title,
          en: translatedTitle,
        };

        projectData.description = {
          de: projectData.description,
          en: translatedDescription,
        };

        return projectData;
      } else {
        console.log(`Skipping ${projectLink}`);
        return null;
      }
    })
  );

  const jsonData = JSON.stringify(translatedProjects.filter(Boolean), null, 2);

  fs.writeFile(outputPath, jsonData, (err) => {
    if (err) {
      console.error("Error updating the JSON file:", err);
    } else {
      console.log("Translation and writing successful. JSON file updated.");
    }
  });
}

module.exports = processAndWriteFinalProjects;