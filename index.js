const axios = require("axios");
const cheerio = require("cheerio");

const baseUrl = "https://www.tda-hamburg.de";

async function scrapeProjectData() {
  try {
    const response = await axios.get(baseUrl);
    const html = response.data;
    const $ = cheerio.load(html);
    const projectLinks = [];

    $(".figure a", html).each(function () {
      const relativeUrl = $(this).attr("href");
      const completeUrl = baseUrl + relativeUrl;
      projectLinks.push(completeUrl);
    });
    
    const allProjectData = [];
    
    let i = 0;

    for (const link of projectLinks) {
      const response = await axios(link);
      const html = response.data;
      const $ = cheerio.load(html);
      const projectData = {};

      projectData.title = $("h2").text();
      projectData.description = $("div.description p").text();
      projectData.buildingType = $("div.detail-row:contains('Bautypologie') p").text().trim();
      projectData.district = $("div.district p").text().trim();
      if (!$("div.categories").text().includes("Touren")) {
        projectData.category = $("div.categories").text().trim();
      }
      projectData.address = $("div.detail-row:contains('Standort') p").text().trim();
      imageSrc = $("div.iteminnerimage img").attr("src");
      if (imageSrc !== undefined) {
        projectData.image = baseUrl + imageSrc;
      } else {
        projectData.image = "https://via.placeholder.com/150";
      }
      projectData.architect = $("div.detail-row:contains('Architekturbüro') p").text().trim();
      if (projectData.architect.includes("www.")) {
        // Split the text by whitespace and select the part containing "www."
        const parts = projectData.architect.split(" ");
        const webAddress = parts.find(part => part.includes("www."));
        
        if (webAddress) {
          // Extract and set the web address to projectData.architectWeb
          projectData.architectWeb = webAddress;

          // Remove the web address part from projectData.architect
          projectData.architect = projectData.architect.replace(webAddress, '');
          // Remove the trailing ", " at the end
          projectData.architect = projectData.architect.replace(/, $/, '');
        }
      }
      projectData.year = $("div.detail-row:contains('Jahr der Fertigstellung') p").text().trim();
      projectData.link = link;

      
      console.log(++i);
      allProjectData.push(projectData);
    }

      const jsonData = JSON.stringify(allProjectData, null, 2);
      const outputPath = 'allProjectData.json';
      console.log("there is all the data:" + jsonData)

  } catch (error) {
    console.log(error);
  } 
}

scrapeProjectData()