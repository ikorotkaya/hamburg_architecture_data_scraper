const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");

const sequelize = new Sequelize(
  // Add your database connection details here
  "postgres://irinakorotkaya:postgres@localhost:5432/hamburg_architecture_projects"
);

const Project = sequelize.define("project", {
  title: DataTypes.TEXT,
  description: DataTypes.TEXT,
  district: DataTypes.STRING,
  address: DataTypes.TEXT,
  architect: DataTypes.TEXT,
  lat: DataTypes.DECIMAL,
  lng: DataTypes.DECIMAL,
});

// Synchronize the model with the database
(async () => {
  try {
    await sequelize.sync();
    console.log("Database synchronized");

    const rawData = fs.readFileSync("fullProjectList.json", "utf8");
    const projectsData = JSON.parse(rawData);

    for (const projectDetails of projectsData) {
      console.log(projectDetails);
      await Project.create(projectDetails);
    }

    console.log("Data inserted into the database");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sequelize.close();
  }
})();
