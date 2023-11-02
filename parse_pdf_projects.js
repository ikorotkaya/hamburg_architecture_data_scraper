const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const { writeFile } = require("fs").promises;

const pdfFolder = "./downloaded_pdfs";
const outputJSONFile = "parsed_pdf_data.json";

const projects = [];
const result = [];

const readPDFFiles = async () => {
  const pdfFiles = fs.readdirSync(pdfFolder);
  console.log("Found", pdfFiles.length, "PDF files.");

  const extractProject = (
    pdfFile,
    projectText,
    startIndexRegex,
    finishIndexRegex
  ) => {
    const startIndex = projectText.search(startIndexRegex);
    const finishIndex = projectText.search(finishIndexRegex);
    if (startIndex !== -1 && finishIndex !== -1) {
      projectText = projectText.substring(startIndex, finishIndex);
      const descriptionParts = projectText.split("\n\n");

      for (const descriptionPart of descriptionParts) {
        if (descriptionPart.length > 0) {
          const project = {
            description: descriptionPart.replace(/\s+/g, " ").replace(/\n/g, " "),
            pdfName: pdfFile,
          };
          projects.push(project);
        }
      }
    }
  };

  for (const pdfFile of pdfFiles) {
    const pdfFilePath = path.join(pdfFolder, pdfFile);
    const data = await pdf(fs.readFileSync(pdfFilePath));
    const pdfText = data.text;
    let projectText = pdfText;

    if (pdfFile.includes("2015") || pdfFile.includes("2014")) {
      extractProject(
        pdfFile,
        projectText,
        /Architektur\nEinzelbauwerke\n\n/i,
        /Architektur\nTouren\n/i
      );
    } else if (pdfFile.includes("2013")) {
      extractProject(
        pdfFile,
        projectText,
        /Einzelbauten\n\n1/i,
        /\n\nTouren\n\n/i
      );
    } else if (pdfFile.includes("2016")) {
      extractProject(
        pdfFile,
        projectText,
        /Impressum/i,
        /Architektur und Stadtplanung\nTo/i
      );
    } else {
      extractProject(
        pdfFile,
        projectText,
        /Impressum/i,
        /Architektur und Stadtplanung\nZeitzeugen/i
      );
    }

    for (const project of projects) {
      if (project.pdfName.includes("2018") || project.pdfName.includes("2019")) {
        const firstTwoSymbols = project.description.substring(0, 2);
        if (firstTwoSymbols.includes(" ")) {
          const projectPDFNumber = parseInt(project.description[0]);
          const newNumber = projectPDFNumber - 1
          const projectIndex = ` ${newNumber} `;
          project.descriptionNew = project.description.substring(project.description.search(projectIndex), project.description.length).replace(projectIndex, "");
          project.descriptionOld = project.description.substring(0, project.description.search(projectIndex));
        } else {
          const projectPDFNumber = parseInt(project.description.substring(0, 2));
          const newNumber = projectPDFNumber - 1;
          const projectIndex = ` ${newNumber} `;
          project.descriptionNew = project.description.substring(project.description.search(projectIndex), project.description.length).replace(projectIndex, "");
          project.descriptionOld = project.description.substring(0, project.description.search(projectIndex));
        }

      } else if (project.pdfName.includes("2022") || project.pdfName.includes("2023")) {
        const firstTwoSymbols = project.description.substring(0, 2);
        if (firstTwoSymbols.includes(" ")) {
          const projectPDFNumber = parseInt(project.description[0]);
          const newNumber = projectPDFNumber + 1
          const projectIndex = ` ${newNumber} `;
          project.descriptionNew = project.description.substring(project.description.search(projectIndex), project.description.length).replace(projectIndex, "");
          project.descriptionOld = project.description.substring(0, project.description.search(projectIndex));
        } else {
          const projectPDFNumber = parseInt(project.description.substring(0, 2));
          const newNumber = projectPDFNumber + 1;
          const projectIndex = ` ${newNumber} `;
          project.descriptionNew = project.description.substring(project.description.search(projectIndex), project.description.length).replace(projectIndex, "");
          project.descriptionOld = project.description.substring(0, project.description.search(projectIndex));
        }
      } 
      
    }
    console.log("Parsed");
    
  }
  
  for (const project of projects) {
    if (project.descriptionNew) {
      result.push({description: project.descriptionNew.replace(/^\d+\s+/, ""), pdfName: project.pdfName});

      if (project.descriptionOld) {
        result.push({description: project.descriptionOld.replace(/^\d+\s+/, ""), pdfName: project.pdfName});
      }
    }
    else {
      result.push(project);
    }
  }

  console.log(result.length, "projects parsed.");

};

const writeJSONFile = async () => {
  await writeFile(outputJSONFile, JSON.stringify(result, null, 2));
};

const main = async () => {
  await readPDFFiles();
  await writeJSONFile();
};

main();
