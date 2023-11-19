const fs = require("fs");
const projects = require("../json/mergedGeocodedProjects.json");
const descriptions = require("../json/englishDescriptions.json")
const titles = require("../json/englishTitles.json");

const addEnglishTranslations = () => {
  for (let i = 0; i < projects.length; i++) {
    projects[i].description = {
      de: projects[i].description,
      en: descriptions[i].descriptionEnglish,
    };
    projects[i].title = {
      de: projects[i].title,
      en: titles[i].titleEnglish,
    };
  }
  fs.writeFileSync("./fullProjectList.json", JSON.stringify(projects));
};

addEnglishTranslations();
