var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var productSchema = new Schema({
  "productId":String,
  "productName":String,
  "salePrice":Number,
  "productImage":String,
  "productUrl":String,
  "checked":String,
  "productNum":Number
})

module.exports = mongoose.model('good',productSchema);
//mongoose语法，good自动与集合goods关联
