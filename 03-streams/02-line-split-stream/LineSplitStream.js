const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  #buffer = '';
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    this.#buffer += chunk.toString();
    const lines = this.#buffer.split(os.EOL);
    this.#buffer = lines.pop();
    if (lines.length === 0) {
      callback();
    } else {
      callback(null, lines.shift());
      while (lines.length > 0) {
        this.push(lines.shift());
      }
    }
  }

  _flush(callback) {
    callback(null, this.#buffer);
  }
}

module.exports = LineSplitStream;
