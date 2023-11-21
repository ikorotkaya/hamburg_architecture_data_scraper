const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
const apiUrl = "https://translation.googleapis.com/language/translate/v2";

async function translateText(text) {
  const response = await axios.post(
    `${apiUrl}?key=${apiKey}`,
    {
      q: text,
      source: "de",
      target: "en",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data.translations[0].translatedText;
};

module.exports = translateText;