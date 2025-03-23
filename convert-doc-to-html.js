const mammoth = require("mammoth");
const fs = require("fs");

// Convert the .doc or .docx file to HTML
mammoth.convertToHtml({ path: "path/to/your/document.docx" })
    .then(function(result) {
        const html = result.value; // The generated HTML
        fs.writeFileSync("output.html", html);
        console.log("HTML conversion successful!");
    })
    .catch(function(err) {
        console.error("HTML conversion failed:", err);
    });
