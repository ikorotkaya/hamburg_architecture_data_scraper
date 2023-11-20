const translateData = require("../helpers/translateData");

const projects = require("../json/projectsData2014.json");

(async () => {
  await translateData(projects);

  console.log(projects[0]);
  
})();