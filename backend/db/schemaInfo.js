const mongoose = require('mongoose');

const schemaInfoSchema = new mongoose.Schema({
  __v: Number,
  load_date_time: String,
});

module.exports = mongoose.model('SchemaInfo', schemaInfoSchema);