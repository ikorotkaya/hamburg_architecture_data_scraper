const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");

const sequelize = new Sequelize(
  "postgres://irinakorotkaya:postgres@localhost:5432/hamburg_architecture_projects"
);

const Project = sequelize.define("project", {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  district: DataTypes.STRING,
  address: DataTypes.STRING,
  architect: DataTypes.TEXT,
  programmYear: DataTypes.STRING
});

// Synchronize the model with the database
(async () => {
  try {
    await sequelize.sync();
    console.log("Database synchronized");

    const rawData = fs.readFileSync("allProjectData.json");
    const projectsData = JSON.parse(rawData);

    for (const item of projectsData) {
      await Project.create(item);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    sequelize.close();
  }
})();
