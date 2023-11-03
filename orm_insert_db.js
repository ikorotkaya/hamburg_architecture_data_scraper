const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");

const sequelize = new Sequelize(
  "postgres://irinakorotkaya:postgres@localhost:5432/hamburg_architecture"
);

const Project = sequelize.define("project", {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  building_type: DataTypes.STRING,
  district: DataTypes.STRING,
  category: DataTypes.STRING,
  address: DataTypes.STRING,
  architect: DataTypes.TEXT,
  year: DataTypes.INTEGER,
  link: DataTypes.TEXT,
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
});

// Synchronize the model with the database
(async () => {
  try {
    await sequelize.sync();
    console.log("Database synchronized");

    const rawData = fs.readFileSync("allProjectData.json");
    const projectsData = JSON.parse(rawData);

    for (const item of projectsData) {
      const project = await Project.create(item);
      console.log("Inserted data for ID", project.id);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    sequelize.close();
  }
})();
