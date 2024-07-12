const puppeteer = require('puppeteer');
const fs = require('fs');

const exportWebsiteAsPdf = async (html, outputPath) => {

    // Create a browser instance
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

    // Create a new page
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded' });

    // To reflect CSS used for screens instead of print
    await page.emulateMediaType('screen');

    const currentDate = new Date();

    // Download the PDF
    const PDF = await page.pdf({
        displayHeaderFooter: true,
        headerTemplate: `
        <!-- <table style="width: 100%;padding: 10px;">
            <thead cellspacing="0">
            <tr>
                <td style="width: 150pt;">
                    <img src="https://i.ibb.co/rw33ptN/60x60.png" alt="" width="60" height="60" />
                </td>
                <td style="text-align: center; font-size: 20px; font-weight: bold; font-family: Arial; /* vertical-align: bottom; */">
                    Daily Field Report
                </td>
                <td style="width: 150pt; text-align: right; font-size: 16px; font-family: Arial">
                    <span class="title"></span>
                    <br />
                    <span>${currentDate.toDateString()}</span>
                    <br />
                    <span>${currentDate.toLocaleTimeString()}</span>
                    <br />
                    <span class="pageNumber"></span>/<span class="totalPages"></span>
                </td>
            </tr>
            </thead>
        </table> -->
        
        `,
        path: outputPath,
        margin: { top: '0', right: '10px', bottom: '0', left: '10px' },
        printBackground: true,
        format: 'A4',
    });

    // Close the browser instance
    await browser.close();

    return PDF;
}

const html = fs.readFileSync(__dirname + '/pdf.html', 'utf-8');

exportWebsiteAsPdf(html, 'result.pdf').then(() => {
    console.log('PDF created successfully.');
}).catch((error) => {
    console.error('Error creating PDF:', error);
});