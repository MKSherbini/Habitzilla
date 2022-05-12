require("dotenv").config();
const routeController = require("./controllers/routeController");

const doc = {
    info: {
        title: 'My API',
        description: 'Description',
    },
    host: 'localhost:6969',
    schemes: ['http'],
};

const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'
const endpointsFiles = ['./routes/index.js']

const _ = require('lodash'),
    fs = require('fs'),
    excluded = ['index.js'],
    path = __dirname + '/routes',
    indexPath = path + '/index.js';


String.prototype.hashCode = function () {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

function getHashFromFile(filePath) {
    let content = fs.readFileSync(filePath).toString();
    return content.hashCode();
}


module.exports = async function updateIndexRoute() {
    let reload = false;

    let filesDisk = fs.readdirSync(path);
    let filesDB = await routeController.getRoutes();

    _.remove(filesDisk, (file) => _.includes(excluded, file));
    console.log(filesDisk);
    let newFilesDisk = [...filesDisk];
    console.log(filesDB);
    filesDB?.forEach(async (fileDB) => {
        let filePath = path + '/' + fileDB.filename;

        if (_.includes(filesDisk, fileDB.filename)) {
            _.remove(newFilesDisk, (file) => file == fileDB.filename);
            let checksum = getHashFromFile(filePath);
            if (fileDB.checksum != checksum) {
                reload = true;
                console.log(fileDB.filename + " has changed");
                await routeController.updateRoute(fileDB.filename, checksum);
            } else {
                console.log(fileDB.filename + " is the same");
            }
        }
        else {
            reload = true;
            console.log(fileDB.filename + " was deleted");
            await routeController.deleteRoute(fileDB.filename);
        }
    });

    newFilesDisk.forEach(async (fileDisk) => {
        reload = true;
        console.log(fileDisk + " is new on disk");
        let filePath = path + '/' + fileDisk;
        let checksum = getHashFromFile(filePath);
        await routeController.addRoute(fileDisk, checksum);
    });

    if (reload) {
        console.log("reloading route.js and swagger");
        setTimeout(() => {
            let routes = filesDisk.filter((file) => !fs.lstatSync(path + '/' + file).isDirectory())
                .map((file) => `app.use('/api/${file.split('.')[0]}', require('./${file}'));`).join('\n');

            let content = `module.exports = function (app) {
            ${routes}
        };`

            fs.writeFile(indexPath, content, err => {
                if (err)
                    console.error(err);
            });
            swaggerAutogen(outputFile, endpointsFiles, doc);
        }, 1000);
    } else {
        console.log("skipping reload route.js and swagger");
    }

}



