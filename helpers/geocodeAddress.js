const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

async function geocodeAddress(address) {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address,
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        },
      }
    );

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
    console.error(`Error details:`, error);
    return null;
  }
}

module.exports = geocodeAddress;
