const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const baseUrl = "https://www.akhh.de/baukultur/info-tag-der-architektur/";
const linkUrl = "https://www.akhh.de/";

(async () => {
  const response = await axios(baseUrl);
  const html = response.data;
  const $ = cheerio.load(html);

  const downloadDir = "downloaded_pdfs";
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
  }

  const pdfLinks = $("a[href*='pdf']");

  pdfLinks.each(async (index, element) => {
    const pdfLink = $(element).attr("href");
    const pdfName = pdfLink.split("/").pop().toUpperCase();
    const pdfPath = fs.createWriteStream(`${downloadDir}/${pdfName}`);
    const pdfResponse = await axios({
      method: "GET",
      url: linkUrl + pdfLink,
      responseType: "stream",
    });
    pdfResponse.data.pipe(pdfPath);
    console.log("Downloaded file: ", pdfName);
  });
})();
