const { Pool } = require("pg");
const fs = require("fs");
const process = require("process");
require("dotenv").config();

(async () => {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
  });

  const rawData = fs.readFileSync("allProjectData.json");
  const data = JSON.parse(rawData);

  const client = await pool.connect();

  data.forEach(async (item) => {
    const text = `
        INSERT INTO projects
          (title, description, building_type, district, category, address, architect, year, link, id)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

    const values = [
      item.title,
      item.description,
      item.building_type,
      item.district,
      item.category,
      item.address,
      item.architect,
      item.year,
      item.link,
      item.id,
    ];

    console.log(item.id);

    try {
      await client.query(text, values);
    } catch (err) {
      console.error("Error inserting data:", err);
    }
  });

  pool.end();
})();

// CREATE TABLE projects (
//   id SERIAL PRIMARY KEY,
//   title TEXT,
//   description TEXT,
//   building_type TEXT,
//   district TEXT,
//   category TEXT,
//   address TEXT,
//   architect TEXT,
//   year TEXT, -- Change the data type to match your data
//   link TEXT
// );