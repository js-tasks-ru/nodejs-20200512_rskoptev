const stream = require('stream');
const fs = require('fs');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.counterValue = 0;
  }
  _transform(chunk, encoding, callback) {
    this.counterValue += chunk.length;
    if (this.counterValue <= this.limit) {
      callback(null, chunk);
    } else {
      callback(new LimitExceededError());
    }
  }
}
module.exports = LimitSizeStream;

