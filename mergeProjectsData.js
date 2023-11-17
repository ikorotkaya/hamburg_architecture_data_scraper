const fs = require("fs");
const path = require("path");

const inputFolderPath = "./json";
const outputJSONFileName = "mergedProjects.json";

const mergedProjects = [];

fs.readdirSync(inputFolderPath).forEach((fileName) => {
  if (path.extname(fileName) === ".json") {
    const filePath = path.join(inputFolderPath, fileName);
    const jsonData = fs.readFileSync(filePath, "utf8");

    try {
      const projectData = JSON.parse(jsonData);
      for (let i = 0; i < projectData.length; i++) {
        if (projectData[i].address) {
          delete projectData[i].pdfName;
          delete projectData[i].text;

          mergedProjects.push(projectData[i]);
        }
      }
    } catch (error) {
      console.error(`Error parsing JSON file ${file}: ${error.message}`);
    }
  }
});

const outputJSONContent = JSON.stringify(mergedProjects, null, 2);

fs.writeFileSync(outputJSONFileName, outputJSONContent, "utf8");

console.log(`All project data has been merged into ${outputJSONFileName}`);
