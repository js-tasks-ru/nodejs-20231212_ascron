const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsByQuery = async function productsByQuery(ctx) {
  const {query} = ctx.query;
  const products = await Product.find(
    {$text: {$search: query}},
    {$score: {$meta: "textScore"}}
    ).sort({$score: {$meta: "textScore"}}).exec();

  let productsList = [];
  if (products) {
    productsList = products.map(product => mapProduct(product));
  }

  ctx.body = {products: productsList};
};
