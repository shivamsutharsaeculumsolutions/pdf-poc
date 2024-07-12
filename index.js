const fs = require('fs');
const path = require('path');

const axios = require('axios');

const html_to_pdf = require('html-pdf-node');

const file = { content: fs.readFileSync(path.join(__dirname, '/pdf.html')) };

// const findImageRegex = /<img[^>]*src="([^"]*)"[^>]*>/g;

const base64 = async (url) => {
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    // console.log(`data:${res.headers['content-type']};base64,${Buffer.from(res.data).toString('base64')}`);
    return `data:${res.headers['content-type']};base64,${Buffer.from(res.data).toString('base64')}`
}

// const configureHeaderTemplate = async () => {
//     try {
//         const htmlString = `
//             <table style="width: 100%;padding: 10px;">
//                 <thead cellspacing="0">
//                     <tr>
//                         <td style="width: 150pt;">
//                             <img src="${base64('https://placehold.co/80x80/EEE/31343C')}" alt="dcdcd" width="60" height="60" />
//                         </td>
//                         <td
//                         style="text-align: center; font-size: 12pt; font-weight: bold; font-family: Arial; /* vertical-align: bottom; */">
//                             <img src="https://placehold.co/90x90/EEE/31343C" alt="dcdcd" width="60" height="60" />
//                         </td>
//                         <td style="width: 150pt; text-align: right; font-family: Arial; font-size: 8pt">
//                             <div>18/08/2001</div>
//                             <div>03: 15 PM</div>
//                         </td>
//                     </tr>
//                 </thead>
//             </table>
//         `;
//         const allReplaceApiCalls = [];
//         let finalModifiedHtmlString = '';
//         htmlString.replace(findImageRegex, (match, group) => allReplaceApiCalls.push(axios.get(group, { responseType: 'arraybuffer' })));
//         const res = await Promise.all(allReplaceApiCalls);
//         res.forEach((singleRes) => {
//             finalModifiedHtmlString = htmlString.replace(findImageRegex, (match, group) => {
//                 if (group === singleRes.config.url) {
//                     return match.replace(group, `data:${singleRes.headers['content-type']};base64,${Buffer.from(singleRes.data).toString('base64')}`);
//                 }
//             });
//         })
//         return finalModifiedHtmlString;
//     } catch (err) { console.log(err) }
// }

(async () => {
    // console.log(await configureHeaderTemplate());
    html_to_pdf.generatePdf(file, {
        format: 'A4',
        landscape: false,
        displayHeaderFooter: true,
        margin: { top: 140, bottom: 100 },

        headerTemplate: `
            <table style="width: 100%;padding: 10px;">
                <thead cellspacing="0">
                    <tr>
                        <td style="width: 150pt;">
                            <img src="${await base64('https://placehold.co/80x80/EEE/31343C')}" alt="dcdcd" width="60" height="60" />
                        </td>
                        <td
                        style="text-align: center; font-size: 12pt; font-weight: bold; font-family: Arial; /* vertical-align: bottom; */">
                            <img src="${await base64('https://placehold.co/90x90/EEE/31343C')}" alt="dcdcd" width="60" height="60" />
                        </td>
                        <td style="width: 150pt; text-align: right; font-family: Arial; font-size: 8pt">
                            <div>18/08/2001</div>
                            <div>03: 15 PM</div>
                        </td>
                    </tr>
                </thead>
            </table>
        `,
        footerTemplate: `
            <table style="width: 100%;padding: 10px;">
                <thead cellspacing="0">
                    <tr>
                        <td style="width: 150pt;">
                            <img src="${await base64('https://placehold.co/40x40/EEE/31343C')}" alt="dcdcd" width="40" height="40" />
                        </td>
                        <td
                        style="text-align: center; font-size: 12pt; font-weight: bold; font-family: Arial; /* vertical-align: bottom; */">
                            <img src="${await base64('https://placehold.co/50x50/EEE/31343C')}" alt="dcdcd" width="50" height="50" />
                        </td>
                        <td style="width: 150pt; text-align: right; font-family: Arial; font-size: 8pt">
                            <div>18/08/2001</div>
                            <div>03: 15 PM</div>
                        </td>
                    </tr>
                </thead>
            </table>
        `
        // headerTemplate: Buffer.from(fs.readFileSync(path.join(__dirname, '/header.html'))).toString(),
        // footerTemplate: Buffer.from(fs.readFileSync(path.join(__dirname, '/footer.html'))).toString()
    }).then(pdfBuffer => {
        fs.writeFileSync(path.join(__dirname, '/sample-2.pdf'), pdfBuffer, {})
        console.log("pdf created successfully");
    }).catch(err => console.log(err));
})()