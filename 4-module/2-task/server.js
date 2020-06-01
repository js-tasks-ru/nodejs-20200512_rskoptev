const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./limitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const limitStream = new LimitSizeStream ({limit: 1048576});
  const writeFile = fs.createWriteStream(filepath,  {flags: 'wx'});


  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Is a directory or wrong name');
        return;
      }
      req
        .pipe(limitStream)
        .on('error', err => {
          if (err.code === 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
            fs.unlinkSync(filepath);
            res.end('Limit has been exceeded.');
          }
        })
        .pipe(writeFile)
        .on('close', () => { //i tried using event:'aborted'
          if (req.aborted) {
            writeFile.end();
            fs.unlinkSync(filepath);
          } else {
            res.statusCode = 201;
            res.end('File created');
            // console.log(req);
          }})
        .on('error', error => {
          if (error.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('No such file or directory');
          } else if (error.code === 'EEXIST') {
            res.statusCode = 409;
            res.end('File exists');
          }  else {
            res.statusCode = 500;
            res.end('Server error');
          }});

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
