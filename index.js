const fs = require('fs');
const path = require('path');
const axios = require('axios');
const html_to_pdf = require('html-pdf-node');

const file = { content: fs.readFileSync(path.join(__dirname, '/flagged-items.html')) };

const base64 = async (url) => {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    return `data:${res.headers['content-type']};base64,${Buffer.from(res.data).toString('base64')}`;
}

(async () => {
    const headerImage1 = await base64('https://placehold.co/80x80/EEE/31343C');
    const headerImage2 = await base64('https://placehold.co/90x90/EEE/31343C');

    html_to_pdf.generatePdf(file, {
        format: 'A4',
        landscape: false,
        displayHeaderFooter: true,
        margin: { top: 70, bottom: 70 },
        headerTemplate: `
            <table style="width: 100%;font-family: 'DM Sans', sans-serif;padding: 0 10px 10px 10px;border-bottom: 1px solid rgba(0,0,0,0.125);">
                <thead cellspacing="0">
                    <tr>
                        <td style="text-align: left;font-size: 7pt;color: #858F99;font-weight: bold;">
                            Topic Title Name
                        </td>
                        <td style="text-align: right;font-size: 7pt;color: #009AD7;">
                            Page 1
                        </td>
                    </tr>
                </thead>
            </table>
        `,
        footerTemplate: `
            <table style="width: 100%;font-family: 'DM Sans', sans-serif;padding: 10px 10px 0 10px;border-top: 1px solid rgba(0,0,0,0.125);">
                <thead cellspacing="0">
                    <tr>
                        <td style="text-align: left;font-size: 7pt;color: #858F99;">
                            Powered by: iQAuditor
                        </td>
                        <td style="text-align: right;font-size: 7pt;color: #858F99;">
                            Page 5/5
                        </td>
                    </tr>
                </thead>
            </table>
        `
    }).then(pdfBuffer => {
        fs.writeFileSync(path.join(__dirname, '/sample-2.pdf'), pdfBuffer, {});
        console.log("PDF created successfully");
    }).catch(err => console.log(err));
})();
