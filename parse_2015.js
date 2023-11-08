const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

const pdfFile = "./downloaded_pdfs/TDA_2015_PROGRAMMHEFT.pdf";
const outputJSONFile = "./json/parsed_2015_data.json";

const projects = [];
const result = [];

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
        if (project.text.includes(" Architekten: nps tchoban")) {
          project.text = project.text.replace(" Architekten: nps tchoban", "\nArchitekten: nps tchoban");
        } else if (project.text.includes("Wein \nDer")) {
          project.text = project.text.replace("Wein \nDer", "Wein\nDer");
        } else if (project.text.includes(" worden. \nArchitekten: ")) {
          project.text = project.text.replace(" worden. \nArchitekten: ", " worden.\nArchitekten: ");
        } else if (project.text.includes("Veranstaltungsräumen \nDer")) {
          project.text = project.text.replace("Veranstaltungsräumen \nDer", "Veranstaltungsräumen\nDer");
        } else if (project.text.includes("Michel \nUmgestaltung")) {
          project.text = project.text.replace("Michel \nUmgestaltung", "Michel\nUmgestaltung");
        } else if (project.text.includes("Höfen \nIm")) {
          project.text = project.text.replace("Höfen \nIm", "Höfen\nIm");
        } else if (project.text.includes("der Elbe \nDas ")) {
          project.text = project.text.replace("der Elbe \nDas ", "der Elbe\nDas ");
        } else if (project.text.includes("zur\nVersammlungsstätte ")) {
          project.text = project.text.replace("zur\nVersammlungsstätte ", "zur \nVersammlungsstätte ");
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
          /\nArchitekt:|Architekten: |Ingenieure: |Stadtplaner:|\nStadtplanungs-|.Architekten:|\nArchitekten |\nStadtplanung:|\nArchitekten:|\nArchitekturbüro:|\nArchitekturbüros:|\nPlanungsbüros:/i
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
            .replace("Ingenieure: ", "")
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
    /Architektur\nEinzelbauwerke\n\n/i,
    /Architektur\nTouren\n/i
  );

  fs.writeFileSync(outputJSONFile, JSON.stringify(projects, null, 2));
};

readPDFFile();
