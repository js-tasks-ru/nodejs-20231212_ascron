const mongoose = require('mongoose');

module.exports.handleInvalidObjectId = function (ctx, next) {
  if (!mongoose.isValidObjectId(ctx.params.id)) {
    ctx.throw(400);
  }

  return next();
};