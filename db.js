const { Pool } = require("pg");
const fs = require("fs");
const process = require("process");
require('dotenv').config();

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
          (title, description, buildingType, district, category, address, architect, architectWeb, year, link, id)
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;

    const values = [
      item.title,
      item.description,
      item.buildingType,
      item.district,
      item.category,
      item.address,
      item.architect,
      item.architectWeb,
      item.year,
      item.link,
      item.id,
    ];

    console.log(item.id)

    try {
      await client.query(text, values);
      // client.release();
      // console.log(`Inserted data for ID ${item.id}`);
    } catch (err) {
      console.error("Error inserting data:", err);
    }
  });

  pool.end();
})()
