const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('Wrong path');
        return;
      }

       fs.unlink(filepath, (err) => {
        if (err) {                      // спорное решение всем ошибкам присваивать 404
          res.statusCode = 404;
          res.end('File not found');
          return;
        }
        res.status = 200;
        res.end('File deleted');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
