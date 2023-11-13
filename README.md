# Web Scraper

This script is a basic web scraping tool written in Node.js, using the *axios and cheerio libraries*. It retrieves information from the [Tag der Architektur und
Ingenieurbaukunst in Hamburg](https://www.tda-hamburg.de/) website, extracting project details from the HTML using *cheerio*.

![GitHub License MIT](https://img.shields.io/github/license/sqlhabit/sql_schema_visualizer?color=%2347A3F3)

## Prerequisites:
- Node.js 
- NPM (Node Package Manager) 

- ORM Sequelize (optional)

## How to use:
- Copy or get the repository.
- Go to the folder in your terminal.
- Run npm install to get the needed *axios* and *cheerio* parts.
- Open the code file in a text editor.
- Run the script in your terminal by typing 'node filename.js'.
- The script will send a GET request for the HTML content from the website and use cheerio to extract project details from it. The collected information is saved in a json file at the *outputPath* location. 

⚒️ Optional: 
- If you want to store the data in a database, you can use Sequelize ORM to create a model and save it in a database. You need to install the *sequelize* and *pg* packages to do this. 
- In orm_single_projects.js, there is an example of how to create a model and save data in a database. You must select your database name and login credentials, as well as the model name and characteristics, and choose a file to read data from.


💡 If you wish to scrape an alternative website, update the *baseUrl* variable with your preferred URL in the index.js file. You have the option to modify the CSS selectors to capture distinct information.

## Credits

All locations and pictures are from program PDFs on the https://www.akhh.de/baukultur/info-tag-der-architektur/ website, and all image rights are owned by [Hamburgische Architektenkammer](https://www.akhh.de/index.php).

## Contributions

Contributions to the Miles Experiences app are welcome! If you have any suggestions, bug reports, or feature requests, feel free to submit an issue or a pull request. 👋🏼

## Licence

This project is released under the MIT Licence. Feel free to use, modify, and redistribute the code under the terms of the licence.