const fs = require('fs');
const axios = require('axios');

const apiKey = ""; // Replace with your Google Maps Geocoding API key
const inputJsonFile = 'all_projects.json'; 
const outputJsonFile = 'final_projects.json'; 

// Function to geocode an address
async function geocodeAddress(address) {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: apiKey,
      },
    });

    const { results } = response.data;

    if (results.length > 0) {
      const { lat, lng } = results[0].geometry.location;
      return { lat, lng };
    } else {
      console.error(`Geocoding failed for address: ${address}`);
      console.error(`Geocoding API response:`, response.data);
      return null;
    }
  } catch (error) {
    console.error(`Error geocoding address: ${address}`);
    console.error(`Error details:`, error.message);
    return null;
  }
}

// Read addresses from the input JSON file
const data = JSON.parse(fs.readFileSync(inputJsonFile, 'utf8'));

// Geocode each address and add unique ids to each project starting from 1 
async function geocodeAddresses() {
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
}

geocodeAddresses();