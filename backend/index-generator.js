var _ = require('lodash'),
    fs = require('fs'),
    excluded = ['index'],
    path = __dirname + '/routes',
    indexPath = path + '/index.js';

let routes = '';
fs.readdirSync(path).forEach(function (file) {
    // Remove extension from file name
    var basename = file.split('.')[0];

    // Only load files that aren't directories and aren't blacklisted
    if (!fs.lstatSync(path + '/' + file).isDirectory() && !_.includes(excluded, basename)) {
        routes += `
        app.use('/api/${basename}', require('./${file}'));`
    }
});

let content = `
module.exports = function (app) {
   ${routes};
};
`

fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err || data != content) {
        console.log("updating index.js");

        fs.writeFile(indexPath, content, err => {
            if (err)
                console.error(err);
            else
                console.log("index.js written successfully");
        });
    } else {
        console.log("index.js already generated");
    }
});