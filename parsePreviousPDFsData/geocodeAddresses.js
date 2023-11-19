const fs = require('fs');
const axios = require('axios');
const geocodeAddress = require('../helpers/geocodeAddress');

const inputJsonFile = 'json/mergedProjects.json'; 
const outputJsonFile = 'json/mergedGeocodedProjects4444444.json'; 

const data = JSON.parse(fs.readFileSync(inputJsonFile, 'utf8'));

(async () => {
  const geocodedData = await Promise.all(
    data.map(async (project, index) => {
      const { lat, lng } = await geocodeAddress(project.address);
      return {
        ...project,
        id: index + 1,
        lat,
        lng,
      };
    })
  );

  // Save geocoded data to the output JSON file
  fs.writeFileSync(outputJsonFile, JSON.stringify(geocodedData.filter(Boolean), null, 2), 'utf8');
  console.log(`Geocoded addresses saved to ${outputJsonFile}`, );
}) ();