// Credits for script: https://github.com/majkinetor/mm-docs-template/blob/master/source/pdf/print.js
// Requires: npm i --save puppeteer

const puppeteer = require('puppeteer');
var args = process.argv.slice(2);
var url = args[0];
var pdfPath = args[1];
var title = args[2];

console.log('Saving', url, 'to', pdfPath);

// Header HTML (right-aligned title with page numbering)
const headerHtml = `
<style>
  .invisible-header {
    font-size: 0;
    color: transparent;
    height: 1px;
  }
</style>
<div class="invisible-header"></div>`;

// Footer HTML (centered, small, greyscale legal notice)
const footerHtml = `
<style>
  .custom-footer {
    width: 100%;
    font-size: 8px;
    color: #666;
    padding-top: 5px;
    border-top: 0.5px solid #ccc;
    position: relative;
  }

  .footer-center {
    text-align: center;
  }

  .footer-page-number {
    position: absolute;
    right: 30px;
    top: 5px;
    font-size: 8px;
    color: #666;
  }

  .footer-bold-title {
    font-weight: bold;
  }
</style>

<div class="custom-footer">
  <div class="footer-page-number">
    <span class="pageNumber"></span>
  </div>
  <div class="footer-center">
    <div class="footer-bold-title">watsonx Code Assistant Level 4: Lab Guide</div>
    <div>Course materials may not be reproduced in whole or in part without the prior written permission of IBM.</div>
  </div>
</div>`;

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.CHROME_BIN || null,
        args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.pdf({
        path: pdfPath,
        format: 'A4',
        displayHeaderFooter: true, // enable header and footer rendering
        printBackground: true,
        landscape: false,
        headerTemplate: headerHtml,
        footerTemplate: footerHtml,
        scale: 0.8,
        margin: {
            top: 80,
            bottom: 80,
            left: 30,
            right: 30
        }
    });

    await browser.close();
})();