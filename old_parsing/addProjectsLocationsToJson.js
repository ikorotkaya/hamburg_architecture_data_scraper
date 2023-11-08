const fs = require("fs");

// read file projectsLocations.json from current directory and sort by id

const projects = JSON.parse(fs.readFileSync("projectsLocations.json", "utf8"));
const sortedProjects = projects.sort((a, b) => a.id - b.id);
// delete duplicates from sortedProjects

const uniqueProjects = sortedProjects.filter(
  (project, index, self) =>
    index === self.findIndex((p) => p.id === project.id)
);

// update projectsLocations.json with uniqueProjects

fs.writeFileSync("projectsLocations.json", JSON.stringify(uniqueProjects, null, 2));

console.log("uniqueProjects: ", uniqueProjects.length);
