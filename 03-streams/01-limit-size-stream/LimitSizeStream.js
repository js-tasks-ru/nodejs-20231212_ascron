const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  #passedBytes = 0;

  constructor(options) {
    super(options);

    this.limit = options.limit ?? 0;
  }

  _transform(chunk, encoding, callback) {
    this.#passedBytes += chunk.length;

    if (this.#passedBytes > this.limit) {
      callback(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
