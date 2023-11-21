# Hamburg Architecture Data Scraper
![GitHub License MIT](https://camo.githubusercontent.com/2961d1e926eba4fd792163eeab8e68a330c221a884d9193b4d2ef1c0b71de500/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f6c6963656e73652f73716c68616269742f73716c5f736368656d615f76697375616c697a65723f636f6c6f723d253233343741334633)

This collection of scripts prepares data for the [Hamburg Architecture](https://github.com/ikorotkaya/hamburg_architecture) project.

The data has been provided by [Architekten- und Ingenieurkammer Hamburg](https://www.akhh.de/baukultur/info-tag-der-architektur/) and ["Day of Architecture and Civil Engineering in Hamburg"](https://www.tda-hamburg.de/) event.

🔎 The script complexity arises due to variations in the layout and element locations across PDFs of previous years' projects. Separate scripts are necessary for each year to ensure accurate formatting and data extraction.

## To obtain new projects each year:

1. go to *parseNewData* folder
2. run `node index.js` to execute the script
3. the script will update finalProjects.json file with new projects and create a new json file with the current year's name in the *json folder* and add images to webp_images folder. 

Optional: 

To store the data in a database, create a model using Sequelize ORM and save it using the `sequelize` and `pg` packages. Refer to the `populateDatabaseORM.js` file in `helpers` folder for an example. 

## Important Notes

🔑 In geocodeAddresses.js, you can obtain the lat and lng coordinates for each project using the Google Maps API, which requires a Google Cloud Account and API Key for this project. Visit the [Google Maps JavaScript API documentation](https://developers.google.com/maps/documentation/javascript/get-api-key) for a guidance on how to get and set up your API key.

🪛 To obtain translations for the project descriptions, you can utilise the [Google Translate API](https://cloud.google.com/translate/docs/setup). To do this, it is necessary for you to establish an API Key.

❗️ Make sure to save your sensitive information in the env file and use dotenv to establish secure connections between your server and database. Refer to the `.env.example` file.

## Credits and copyright

The data has been provided by [Architekten- und Ingenieurkammer Hamburg](https://www.akhh.de/baukultur/info-tag-der-architektur/).

All image rights belong to the Architekten- und Ingenieurkammer Hamburg. Images downloaded from their program PDFs using [PDF24 Tools](https://tools.pdf24.org/en/).

## Contributions

Contributions to the data scraper application are welcomed. If you have any suggestions, bug reports, or feature requests, please feel free to submit an issue or a pull request. 👋🏼

## Licence

This project is released under the [MIT License](https://opensource.org/licenses/MIT), so you are free to use, modify, and redistribute the code under the terms of the license.
