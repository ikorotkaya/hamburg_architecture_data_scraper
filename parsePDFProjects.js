const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");
const { writeFile } = require("fs").promises;

const pdfFolder = "./downloaded_pdfs";
const outputJSONFile = "parsed_pdf_data.json";

const projects = [];

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
            description: descriptionPart.replace(/\n/g, " "),
            file: pdfFile,
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
    } else {
      extractProject(
        pdfFile,
        projectText,
        /Impressum/i,
        /Architektur und Stadtplanung\nTo/i
      );
    }
  }
};

const writeJSONFile = async () => {
  // const projectsWithIndex = projects.map((project, index) => {
  //   return { ...project, index };
  // });
  await writeFile(outputJSONFile, JSON.stringify(projects, null, 2));
};

const main = async () => {
  await readPDFFiles();
  await writeJSONFile();
};

main();
