const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

const pdfFile = "./downloaded_pdfs/TDA_2018_PROGRAMMHEFT.pdf";
const outputJSONFile = "./json/parsed_2018_data.json";

const projects = [];

const readPDFFile = async () => {
  const data = await pdf(fs.readFileSync(pdfFile));
  const pdfText = data.text;
  let projectText = pdfText;

  console.log("Found", pdfFile, "PDF file.");

  const extractProject = (projectText, startIndexRegex, finishIndexRegex) => {
    const startIndex = projectText.search(startIndexRegex);
    const finishIndex = projectText.search(finishIndexRegex);
    if (startIndex !== -1 && finishIndex !== -1) {
      projectText = projectText.substring(startIndex, finishIndex);
      const descriptionParts = projectText.split("\n\n");

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
        if (
          project.text.includes("\nArchitektur und Stadtplanung\nZeitzeugen")
        ) {
          project.text = project.text.split(
            "\nArchitektur und Stadtplanung\nZeitzeugen"
          )[0];
        } else if (project.text.includes("Neustadt \n")) {
          project.text = project.text.replace("Neustadt \n", "Neustadt\n").replace("Christianeum\nNeubau", "Christianeum \nNeubau");
        }
        else if (project.text.includes(" \n2 \nAltona")) {
          project.text = project.text.replace(" \n2 \nAltona", "\n2 \nAltona");
        } else if (project.text.includes("Magistrale\nDurchschnitt")) {
          project.text = project.text.replace("Magistrale\nDurchschnitt", "Magistrale \nDurchschnitt");
        } else if (project.text.includes(". Architekten: ")) {
          project.text = project.text.replace(". Architekten: ", ".\nArchitekten: ");
        } else if (project.text.includes("Schulen Im Zuge")) {
          project.text = project.text.replace("Schulen Im Zuge", "Schulen\nIm Zuge");
        } else if (project.text.includes("Billstedt \nNeubau Grundschule Rahewinkel")) {
          project.text = project.text.replace("Billstedt \nNeubau Grundschule Rahewinkel", "Billstedt\nNeubau Grundschule Rahewinkel");
        }
      }
      
      // Divide the projects that have more than one number and add the new projects to the array
      for (const project of projects) {
        if (/(?<!\s)\n\d+\s*/g.test(project.text)) {
          const parts = project.text.split(/(?<!\s)\n\d+\s*/g, 2);

          parts.forEach((projectDescription, index) => {
            if (index === 0) {
              project.text = projectDescription;
            } else {
              const newProject = {
                text: projectDescription,
                pdfName: project.pdfName,
              };
              projects.push(newProject);
            }
          });
        }
        const regex = /^\d+\s*\n/;
        project.text = project.text.replace(regex, "");
      }

      // // Add the "district", "title", "description", "architect" and "address" values to the projects
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
          /\nArchitekt:|Architekten: |\nStadtplanungs-|.Architekten:|\nArchitekten |\nStadtplanung:|\nArchitekten:|\nArchitekturbüro:|\nArchitekturbüros:|\nPlanungsbüros:/i
        );
        const finishIndexArch = project.text.search(/Führungen:|\nTermine:/i);
        if (startIndexArch !== -1 && finishIndexArch !== -1) {
          const architect = project.text.substring(
            startIndexArch,
            finishIndexArch
          );
          project.architect = architect
            .replace("Architekt: ", "")
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
