const mongoose = require("mongoose");
//const AutoIncrement = require('mongoose-sequence')(mongoose);

const urlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true
  },
  short_url: {
    type: Number,
    default: 0
  },
});

//urlSchema.plugin(AutoIncrement, {inc_field: 'short_url'});

const urlModel = mongoose.model("URL", urlSchema);

module.exports = urlModel;