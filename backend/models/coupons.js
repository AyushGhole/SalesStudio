const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const coupounsSchema = new Schema({
  code: String,
  description: String,
  valid_from: String,
  valid_until: String,
  is_active: Boolean,
});

module.exports = mongoose.model("couponsModel", coupounsSchema);
