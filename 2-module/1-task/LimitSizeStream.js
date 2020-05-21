//sources
const stream = require('stream');
const fs = require('fs');
const { Readable, Writable, Transform } = require('stream');
//modules
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {

  }
}

const limitedStream = new LimitSizeStream({limit: 8}); // 8 байт
const outStream = fs.createWriteStream('out.txt');

limitedStream.pipe(outStream);

limitedStream.write('hello'); // 'hello' - это 5 байт, поэтому эта строчка целиком записана в файл

setTimeout(() => {
  limitedStream.write('world'); // ошибка LimitExceeded! в файле осталось только hello
}, 10);

module.exports = LimitSizeStream;

