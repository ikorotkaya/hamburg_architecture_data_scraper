const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

const pdf_2014 = "./downloaded_pdfs/TDA_2022_PROGRAMMHEFT.pdf";
const outputJSONFile = "./json/parsed_2022_data.json";

const projects = [];
const result = [];

const readPDFFile = async () => {
  const data = await pdf(fs.readFileSync(pdf_2014));
  const pdfText = data.text;
  let projectText = pdfText;

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
              .replace(/-\n/g, "")
              .replace(/- \n/g, "")
              .replace(/  \n/g, "")
              .replace("Architektur und Stadtplanung\nProjek te\n", "")
              .replace("\nArchitektur und Stadtplanung\nProjekte\nP", ""),
            pdfName: pdf_2014,
          };
          projects.push(project);
        }
      }

      // Replace some special cases in the text
      for (const project of projects) {
        if (project.text.includes(" \n11 HafenCity")) {
          project.text = project.text.replace(
            " \n11 HafenCity",
            "\n11\nHafenCity"
          );
        } else if (project.text.includes("\nCO\n2\n-")) {
          project.text = project.text.replace("\nCO\n2\n-", " CO2 -");
        } else if (project.text.includes(" –\n")) {
          project.text = project.text
            .replace(" –\n", " – ")
            .replace(
              "historischen Teichanlage \nMit",
              "historischen Teichanlage\nMit"
            );
        } else if (project.text.includes(" \nDas Halbmondhaus")) {
          project.text = project.text.replace(
            " \nDas Halbmondhaus",
            "\nDas Halbmondhaus"
          );
        } else if (project.text.includes("Schnelsen \nParkanlage")) {
          project.text = project.text.replace(
            "Schnelsen \nParkanlage",
            "Schnelsen\nParkanlage"
          );
        } else if (
          project.text.includes("\nArchitektur und Stadtplanung\nZeitzeugen")
        ) {
          project.text = project.text.split(
            "\nArchitektur und Stadtplanung\nZeitzeugen"
          )[0];
        } else if (project.text.includes(" \nPlanungsbüros:")) {
          project.text = project.text.replace(
            " \nPlanungsbüros:",
            "\nPlanungsbüros:"
          );
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

      // Add the "district", "title", "description", "architect" and "address" values to the projects
      for (const project of projects) {
        const projectParts = project.text.split(/(?<! )\n/g);
        project.district = projectParts[0];
        project.title = projectParts[1];
        const description = projectParts[2];

        // Replace new lines in the description
        if (typeof description === "string") {
          project.description = description.replace(/ ?\n ?/g, "");
        }

        // Extract the "Architekten" value
        const startIndexArch = project.text.search(
          /\nArchitekt:|\nStadtplanungs-|.Architekten:|\nArchitekten |\nStadtplanung:|\nArchitekten:|\nArchitekturbüro:|\nArchitekturbüros:|\nPlanungsbüros:/i
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
