const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

const pdfFile = "./downloaded_pdfs/TDA_2016_PROGRAMMHEFT.pdf";
const outputJSONFile = "./json/projectsData2016.json";

const projects = [];

const readPDFFile = async () => {
  const data = await pdf(fs.readFileSync(pdfFile));
  const pdfText = data.text;
  let projectText = pdfText;

  // Function to extract the project data from the PDF text
  const extractProject = (projectText, startIndexRegex, finishIndexRegex) => {
    const startIndex = projectText.search(startIndexRegex);
    const finishIndex = projectText.search(finishIndexRegex);
    if (startIndex !== -1 && finishIndex !== -1) {
      projectText = projectText.substring(startIndex, finishIndex);
      const descriptionParts = projectText.split("\n\n");

      // Add the "text" and "pdfName" values to the projects
      for (const descriptionPart of descriptionParts) {
        if (descriptionPart.length > 0) {
          const project = {
            text: descriptionPart
              .replace(/-\n/g, " ")
              .replace(/- \n/g, " ")
              .replace(/  \n/g, " ")
              .replace("Architektur und Stadtplanung\nProjek te\n", "")
              .replace("\nArchitektur und Stadtplanung\nProjekte\nP", ""),
            pdfName: pdfFile,
          };
          projects.push(project);
        }
      }

      // Replace some special cases in the text
      for (const project of projects) {
        if (project.text.includes("Brücke\nerreichbare")) {
          project.text = project.text.replace("Brücke\nerreichbare", "Brücke \nerreichbare").replace(" \nArchitekt: ", "\nArchitekt: ");
        } else if (project.text.includes("Gewerbe\nRevitalisierung")) {
          project.text = project.text.replace("Gewerbe\nRevitalisierung", "Gewerbe \nRevitalisierung");
        } else if (project.text.includes("St. Pauli \nKlubhaus")) {
          project.text = project.text.replace("St. Pauli \nKlubhaus", "St. Pauli\nKlubhaus");
        }

        const regex = /^\d+\s*\n/;
        project.text = project.text.replace(regex, "");
      }

      // Add the "district", "title", "description", "architect" and "address" values to the projects
      for (const project of projects) {
        const projectParts = project.text.split(/(?<! )\n/g);
        project.district = projectParts[0];

        const title = projectParts[1];
        // Replace new lines in the title
        if (typeof title === "string") {
          project.title = title.replace(/ ?\n ?/g, "");
        }

        const description = projectParts[2];
        // Replace new lines in the description
        if (typeof description === "string") {
          project.description = description.replace(/ ?\n ?/g, "");
        }

        // Extract the "Architekten" value
        const startIndexArch = project.text.search(
          /\nArchitekt:|Architekten: |Stadtplaner:|\nStadtplanungs-|.Architekten:|\nArchitekten |\nStadtplanung:|\nArchitekten:|\nArchitekturbüro:|\nArchitekturbüros:|\nPlanungsbüros:/i
        );
        const finishIndexArch = project.text.search(/Führungen:|\nTermine:/i);
        if (startIndexArch !== -1 && finishIndexArch !== -1) {
          const architect = project.text.substring(
            startIndexArch,
            finishIndexArch
          );
          project.architect = architect
            .replace("Architekt: ", "")
            .replace("Stadtplaner: ", "")
            .replace("Architekten: ", "")
            .replace("Architekturbüro: ", "")
            .replace("Architekten / Künstler: ", "")
            .replace("Architekturbüros: ", "")
            .replace("Planungsbüros: ", "")
            .replace("Stadtplanung: ", "")
            .replace("\nStadtplanungs- und ", "")
            .replace("\nArchitekten / Ingenieure: ", "")
            .replace(/ ?\n ?/g, "");
        }

        // Extract the "Address" value
        const startIndexAddress = project.text.search(/Treffpunkt:/i);
        const finishIndexAddress = project.text.length;
        if (startIndexAddress !== -1 && finishIndexAddress !== -1) {
          const address =
            project.text.substring(startIndexAddress, finishIndexAddress) +
            ", Hamburg";
          project.address = address
            .replace("Treffpunkt: ", "")
            .replace(/\s+$/, "")
            .replace(/ ?\n ?/g, "");
        }
      }
    }
  };

  extractProject(
    projectText,
    /Impressum/i,
    /Architektur und Stadtplanung\nTo/i
  );

  fs.writeFileSync(outputJSONFile, JSON.stringify(projects, null, 2));
};

readPDFFile();
