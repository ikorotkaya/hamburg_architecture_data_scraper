# Web Scraper

This script parses projects from the website for the ["Tag der Architektur und Ingenieurbaukunst in Hamburg"](https://www.tda-hamburg.de/) and makes a `fullProjectList.json` file that is used in the Hamburg Architecture project.

## To obtain new projects from the yearly updated website, follow these steps:
1. Update the *outputPath* in the *index.js* file with the current year's projects json.
2. Review and adjust CSS selectors in the *parseWebProjectData.js* file when needed.
3. Type `node index.js` in your terminal to execute the script and access the json folder with the file named after the current year.
4. Translate the project descriptions using Google Translate and add the key-value pairs to the *englishDescriptions.json* file in the same order as the projects are listed.
5. Use *mergeProjectsData.js*,
6. *geocodeAddresses.js*,
7. and *addEnglishTranslations.js* to obtain the *fullProjectList.json* file, which will be used for the [Hamburg Architecture project](https://github.com/ikorotkaya/hamburg_architecture).
8. Ensure that images are converted to webp format using *convertToWebp.js* and that the *webp_images* folder is also copied to the [Hamburg Architecture project](https://github.com/ikorotkaya/hamburg_architecture).

![GitHub License MIT](https://camo.githubusercontent.com/2961d1e926eba4fd792163eeab8e68a330c221a884d9193b4d2ef1c0b71de500/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6c6963656e73652f73716c68616269742f73716c5f736368656d615f76697375616c697a65723f636f6c6f723d253233343741334633)

## Prerequisites:

- Node.js 
- NPM (Node Package Manager) 
- Axios
- Cheerio

- Optional: Sequelize ORM for database storage

## How to use the script to parse projects:

1. Copy or download the repository.
2. Navigate to the folder in your terminal.
3. Execute `npm install` to obtain the required `axios` and `cheerio` components.
4. Create a `.env` file and set your sensitive data such as Google Maps API key. Refer to the `.env.example` file.
5. Open the code file in a text editor.
6. Launch the script in your terminal by typing `node index.js`.

🔎 Please keep in mind: The script is complicated and requires multiple steps because previous years' projects need to be downloaded as PDFs, and the layout and element locations differ in each file, requiring a separate script for each year to format and extract the data correctly.

8. Run *downloadPdfProgramms.js* to download the PDF files for each year
9. Run *parseProjects"YEAR".js* for EACH year to obtain the *projects"YEAR".json* files (e.g. *parseProjects2021.js*)
10. Run *mergeProjectsData.js* to merge all projects into one file
11. Run *geocodeAddresses.js* to get lat and lng coordinates for each project
12. Use Google Translate to translate the project titles and descriptions, then save them in englishTitles.json and englishDescriptions.json, respectively.
12. Run *addEnglishTranslations.js* to obtain the *fullProjectList.json* file, which is necessary for the [Hamburg Architecture project](https://github.com/ikorotkaya/hamburg_architecture).
13. Convert images to the webp format separately using *convertToWebp.js.* and copy the *webp_images* folder into the [Hamburg Architecture project](https://github.com/ikorotkaya/hamburg_architecture).

Optional: 

13. To store the data in a database, create a model using Sequelize ORM and save it using the `sequelize` and `pg` packages. Refer to the `populateDatabaseORM.js` file for an example. 

## Important Notes

🔑 In geocodeAddresses.js, you can obtain the lat and lng coordinates for each project using the Google Maps API, which requires a Google Cloud Account and API Key for this project. Visit the [Google Maps JavaScript API documentation](https://developers.google.com/maps/documentation/javascript/get-api-key) for step-by-step guidance on how to get and set up your API key.

❗️ Make sure to save your sensitive information in the env file and use dotenv to establish secure connections between your server and database. Refer to the `.env.example` file.

## Credits

The data has been provided by Architekten- und Ingenieurkammer Hamburg. You can access all of the program PDFs available [here](https://www.akhh.de/baukultur/info-tag-der-architektur/).

All images except those for 2023 projects will be sourced from downloaded PDF files. 

All image rights belong to the Architekten- und Ingenieurkammer Hamburg and were downloaded from their program PDFs using [PDF24 Tools](https://tools.pdf24.org/en/).

## Contributions

Contributions to the web scraper application are welcomed. If you have any suggestions, bug reports, or feature requests, please feel free to submit an issue or a pull request. 👋🏼

## Licence

This project is released under the [MIT License](https://opensource.org/licenses/MIT), so you are free to use, modify, and redistribute the code under the terms of the license.
