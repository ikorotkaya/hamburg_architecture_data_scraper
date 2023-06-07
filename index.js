const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const PORT = 8000;

const app = express();

const url = 'https://www.ak-berlin.de/baukultur/da-architektur-in-und-aus-berlin/projekte-da-2023.html';

axios(url)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        const projects = [];

        $('.news-list-item', html).each(function() {
            const title = $(this).find('h3').text().trim();
            const url = $(this).find('a').attr('href');
            projects.push({
                title,
                url
            })
        })
        console.log(projects);
    }).catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})