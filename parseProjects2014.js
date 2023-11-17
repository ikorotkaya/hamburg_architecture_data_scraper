const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

const pdfFile = "./downloaded_pdfs/TDA_2014_PROGRAMMHEFT.pdf";
const outputJSONFile = "./json/projectsData2014.json";

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
        if (project.text.includes(" \nFührungen:")) {
          project.text = project.text.replace(" \nFührungen:", "\nFührungen:");
        }

        if (project.text.includes("Katharinenquartier \nDas")) {
          project.text = project.text.replace("Katharinenquartier \nDas", "Katharinenquartier\nDas").replace("Barmbek\nNeubau\n", "Barmbek \nNeubau");
        } else if (project.text.includes("Busanlage Barmbek\nNeubau")) {
          project.text = project.text.replace("Busanlage Barmbek\nNeubau", "Busanlage Barmbek \nNeubau");
        } else if (project.text.includes("Ottensen \nFette-Höfe,")) {
          project.text = project.text.replace("Ottensen \nFette-Höfe,", "Ottensen\nFette-Höfe,");
        } else if (project.text.includes("Erweiterung \nDie")) {
          project.text = project.text.replace("Erweiterung \nDie", "Erweiterung\nDie");
        } else if (project.text.includes("arvestehude \nBürohaus")) {
          project.text = project.text.replace("arvestehude \nBürohaus", "arvestehude\nBürohaus");
        } else if (project.text.includes("Kaufhauskanal\nUmbau")) {
          project.text = project.text.replace("Kaufhauskanal\nUmbau", "Kaufhauskanal \nUmbau");
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

        // const startIndexDescription= project.text.search(description);
        // const finishIndexDescription= project.text.search(/\nFührungen:/i);
        // if (startIndexDescription!== -1 && finishIndexDescription!== -1) {
        //   const description = project.text.substring(
        //     startIndexDescription,
        //     finishIndexDescription
        //   );
        //   project.description = description.replace(/ ?\n ?/g, "");
        // }

        // Extract the "Architekten" value
        const startIndexArch = project.text.search(/\nFührungen:/i);
        const finishIndexArch = project.text.search(/Termine:/i);
        if (startIndexArch !== -1 && finishIndexArch !== -1) {
          const architect = project.text.substring(
            startIndexArch,
            finishIndexArch
          );
          project.architect = architect.replace("Führungen: ", "").replace(/ ?\n ?/g, "");
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
