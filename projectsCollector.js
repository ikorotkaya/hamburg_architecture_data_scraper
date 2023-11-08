const fs = require("fs");
const path = require("path");

const inputFolder = "./json";
const outputJSONFile = "all_projects.json";

const projects = [];

fs.readdirSync(inputFolder).forEach((file) => {
  if (path.extname(file) === ".json") {
    const filePath = path.join(inputFolder, file);
    const jsonData = fs.readFileSync(filePath, "utf8");

    try {
      const projectData = JSON.parse(jsonData);
      for (let i = 0; i < projectData.length; i++) {
        if (projectData[i].address) {
          // delete projectData[i].pdfName and projectData[i].text 
          delete projectData[i].pdfName;
          delete projectData[i].text;

          projects.push(projectData[i]);
        }
      }
    } catch (error) {
      console.error(`Error parsing JSON file ${file}: ${error.message}`);
    }
  }
});

const outputJSON = JSON.stringify(projects, null, 2);

fs.writeFileSync(outputJSONFile, outputJSON, "utf8");

console.log(`All project data has been consolidated into ${outputJSONFile}`);
