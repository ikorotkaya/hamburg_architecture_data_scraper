const {Sequelize, DataTypes} = require("sequelize");
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






// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: "postgres",
//     port: 5432,
//   }
// );

// const Project = sequelize.define("Project", {
//   title: Sequelize.STRING,
//   description: Sequelize.TEXT,
//   buildingType: Sequelize.STRING,
//   district: Sequelize.STRING,
//   category: Sequelize.STRING,
//   address: Sequelize.STRING,
//   architect: Sequelize.STRING,
//   year: Sequelize.INTEGER,
//   link: Sequelize.STRING,
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true,
//   },
// });


