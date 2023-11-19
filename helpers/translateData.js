const {translate} = require("@vitalets/google-translate-api");

async function translateData(projects) {
  for (const project of projects) {
    try {
      const translation = await translate(project.description, { to: "en" });
      project.englishTranslation = translation.text;
    } catch (error) {
      console.error(`Error translating project with id ${project.id}:`, error.message);
    }
  }
}

module.exports = translateData;
