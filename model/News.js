const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A news must have a title"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    type: String,
    required: [true, "A news must have a creator"],
  },
  image: {
    type: String,
    required: [true, "A news must have an image"],
  },
  shortDescription: {
    type: String,
    required: [true, "A news must have a short description"],
  },
  content: {
    type: String,
    required: [true, "A news must have content"],
  },
});

// Corrected export statement
module.exports = mongoose.models.News || mongoose.model("News", newsSchema);
