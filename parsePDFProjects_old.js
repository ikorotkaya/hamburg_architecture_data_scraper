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

  for (const pdfFile of pdfFiles) {
    const pdfFilePath = path.join(pdfFolder, pdfFile);

    const data = await pdf(fs.readFileSync(pdfFilePath));

    // const pdfText = data.text.replace(/\n/g, " ");
    const pdfText = data.text;

    let projectText = pdfText;

    
    
    if (pdfFile.includes("2015") || pdfFile.includes("2014")) {
      const startIndex = projectText.search(/Architektur\nEinzelbauwerke\n\n/i);
      const finishIndex = projectText.search(/Architektur\nTouren\n/i);
      if (startIndex !== -1 && finishIndex !== -1) {
        projectText = projectText.substring(startIndex, finishIndex);
        const project = {
          description: projectText,
          file: pdfFile,
        };
        projects.push(project);
      }
    } else if (pdfFile.includes("2013")) {
      const startIndex = projectText.search(/Einzelbauten\n\n1/i);
      const finishIndex = projectText.search(/\n\nTouren\n\n/i);
      if (startIndex !== -1 && finishIndex !== -1) {
        projectText = projectText.substring(startIndex, finishIndex);
        const project = {
          description: projectText,
          file: pdfFile,
        };
        projects.push(project);
      }
    } else {
      const startIndex = projectText.search(/Impressum/i);
      const finishIndex = projectText.search(/Architektur und Stadtplanung\nTo/i);
      if (startIndex !== -1 && finishIndex !== -1) {
        projectText = projectText.substring(startIndex, finishIndex);
        const project = {
          description: projectText,
          file: pdfFile,
        };
        projects.push(project);
      }
    }
  }
};

const writeJSONFile = async () => {
  await writeFile(outputJSONFile, JSON.stringify(projects, null, 2));
};

const main = async () => {
  await readPDFFiles();
  await writeJSONFile();
};

main();

// 14-15 Architektur\nTouren\n
// 13 - \n\nTouren\n\n
// 16-23 - Architektur und Stadtplanung\nTo