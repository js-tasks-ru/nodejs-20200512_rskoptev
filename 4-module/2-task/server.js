const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {

  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);


  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Is a directory or wrong name');
        return;
      } else {

      const limitStream = new LimitSizeStream ({limit: 1048576});
      const writeFile = fs.createWriteStream(filepath,{flags: 'wx'});

      req
        .pipe(limitStream)
        .on('error', err => {
          if (err.code === 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
            fs.unlink(filepath, ()=>{});
            res.end('Limit has been exceeded.');
          }})
        .pipe(writeFile)
        .on('finish',() =>{
          res.statusCode = 201;
          res.end('File created');
        })
         .on('error', err => {
           if (err.code === 'EEXIST') {
             res.statusCode = 409;
             res.end('File exists');
           }
         })

      req
        .on('aborted', () => {
          fs.unlink(filepath,()=>{});
          res.end('Connection error');
       })}
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
