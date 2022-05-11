const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    trim: true,
    max: 50,
  },
  checksum: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  }
});

module.exports = mongoose.model("Route", userSchema);
