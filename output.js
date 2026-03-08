const fs = require('fs');
const path = require('path');

function output(resultJSON) 
{
    const outputPath = path.join(__dirname, '..', '..', 'data', 'json', 'output.json');

    fs.writeFileSync(outputPath, JSON.stringify(resultJSON, null, 2), 'utf8');

    console.log(outputPath);
}

module.exports = output;