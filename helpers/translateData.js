const {translate} = require("@vitalets/google-translate-api");

async function translateData(projects) {
  for (const project of projects) {
    try {
      const translationDescription = await translate(project.description, { to: "en" });
      const translationTitle = await translate(project.title, { to: "en" });
      project.description = {
        de: project.description,
        en: translationDescription.text,
      };
      project.title = {
        de: project.title,
        en: translationTitle.text,
      };
    } catch (error) {
      console.error(`Error translating project with id ${project.id}:`, error.message);
    }
  }
}

module.exports = translateData;
