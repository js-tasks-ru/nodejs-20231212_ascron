const Product = require('../models/Product');
const mapProduct = require('../mappers/product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({subcategory: subcategory}).exec();

  ctx.body = {products: products.map(product => mapProduct(product))};
};

module.exports.productList = async function productList(ctx) {
  const products = await Product.find({}).exec();
  ctx.body = {products: products.map(product => mapProduct(product))};
};

module.exports.productById = async function productById(ctx) {
  const product = await Product.findById(ctx.params.id).exec();

  if (!product) {
    ctx.throw(404);
  }

  ctx.body = {product: mapProduct(product)};
};

