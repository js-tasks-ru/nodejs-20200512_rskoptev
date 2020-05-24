const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
     this.lastLine = '';
  }
  _transform(chunk, encoding, callback) {
    let data = chunk.toString();
    if (this.lastLine) {
      data = this.lastLine + data;
    }
    const parts = data.split(os.EOL);
    this.lastLine = parts.pop();
    parts.forEach(part => this.push(part));
    callback();
  }

  _flush(callback) {
    if (this.lastLine) {
      this.push(this.lastLine);
   }
   callback();
  }
}

module.exports = LineSplitStream;
