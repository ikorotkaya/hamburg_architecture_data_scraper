const fs = require("fs");
const projects = require("./final_projects.json");
const descriptions = require("./descriptionsEnglish.json");
const titles = require("./titlesEnglish.json");

const addEnglishDescriptions = () => {
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
  fs.writeFileSync("./final.json", JSON.stringify(projects));
};

addEnglishDescriptions();
