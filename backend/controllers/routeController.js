const Route = require("../models/route");

exports.getRoutes = async () => {
    return await Route.find({});
};

exports.addRoute = async (filename, checksum) => {
    let route = new Route({ filename: filename, checksum: checksum });

    return await route.save().checksum
};

exports.updateRoute = async (filename, checksum) => {
    await Route.findOneAndUpdate({ filename: filename }, { checksum: checksum });
};

exports.deleteRoute = async (filename) => {
    await Route.deleteOne({ filename: filename });
};
