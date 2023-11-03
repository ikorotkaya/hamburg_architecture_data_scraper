const fs = require("fs");

const inputJSONFile = "parsed_pdf_data.json";
const outputJSONFile = "single_projects.json";

function extractKeyValuePairs(description) {
  const keyValuePairs = {};
  const projects = JSON.parse(fs.readFileSync(inputJSONFile));

  for (const project of projects) {
    const pdfName = project.pdfName;
    if (pdfName.includes("2014")) {
      const startIndexDescription = description.search(/ /i);
      const finishIndexDescription = description.search(/Führungen:|Termine:/i);
      if (finishIndexDescription !== -1 && startIndexDescription !== -1) {
        const descriptionText = description.substring(startIndexDescription, finishIndexDescription);
        keyValuePairs.description = descriptionText.replace(/\s+/, "").replace(/\s+$/, "");
      }
      const startIndexArch = description.search(/Führungen: /i);
      const finishIndexArch = description.search(/Termine:/i);
      if (startIndexArch !== -1 && finishIndexArch !== -1) {
        const architect = description.substring(startIndexArch, finishIndexArch);
        keyValuePairs.architect = architect.replace("Führungen: ", "");
      }
    }
  }

  // Extract the "Architekten" value
  const startIndexArch = description.search(/Architekt:|Architekten:|Architekturbüro:|Architekturbüros:|Planungsbüros:/i);
  const finishIndexArch = description.search(/Führungen:|Termine:/i);
  if (startIndexArch !== -1 && finishIndexArch !== -1) {
    const architect = description.substring(startIndexArch, finishIndexArch);
    keyValuePairs.architect = architect.replace("Architekt: ", "").replace("Architekten: ", "").replace("Architekturbüro: ", "").replace("Architekturbüros: ", "").replace("Planungsbüros: ", "").replace(/\s+$/, "");
  }
  
  // Extract the "Address" value
  const startIndexAddress = description.search(/Treffpunkt:/i);
  const finishIndexAddress = description.length;
  if (startIndexAddress !== -1 && finishIndexAddress !== -1) {
    const address = description.substring(startIndexAddress, finishIndexAddress);
    keyValuePairs.address = address.replace("Treffpunkt: ", "").replace(/\s+$/, "");
  }
  
  // Extract the "District" value
  const startIndexDistrict = 0;
  const finishIndexDistrict = description.search(/ /i);
  if (startIndexDistrict !== -1 && finishIndexDistrict !== -1) {
    const district = description.substring(startIndexDistrict, finishIndexDistrict);
    keyValuePairs.district = district;
  }
  
  // Extract the description value
  const startIndexDescription = description.search(/ /i);
  const finishIndexDescription = description.search(/Architekt:|Architekten:|Architekturbüro:|Architekturbüros:|Planungsbüros:/i);
  if (finishIndexDescription !== -1 && startIndexDescription !== -1) {
    const descriptionText = description.substring(startIndexDescription, finishIndexDescription);
    keyValuePairs.description = descriptionText.replace(/\s+/, "").replace(/\s+$/, "");
  }


  return keyValuePairs;
}

function divideProjectsInfo() {
  const projects = JSON.parse(fs.readFileSync(inputJSONFile));
  const dividedProjects = [];

  for (const project of projects) {
    const dividedProject = extractKeyValuePairs(project.description.replace(/^\d+\s+/, ""));
    if (dividedProject.architect !== undefined && dividedProject.address !== undefined) {
      dividedProject.pdfName = project.pdfName;
      dividedProject.programmYear = project.pdfName.substring(4, 8);
      dividedProjects.push(dividedProject);
    }
  }

  fs.writeFileSync(outputJSONFile, JSON.stringify(dividedProjects));
  console.log("Single projects: " + dividedProjects.length)
}

divideProjectsInfo();