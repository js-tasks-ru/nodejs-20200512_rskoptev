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
  const streamFile = fs.createWriteStream(filepath);


  switch (req.method) {
    case 'POST':
      fs.createReadStream(filepath)
        .on('error', error => {
          if (error.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('No such file or directory');
          } else if (error.code === 'EISDIR') {
            res.statusCode = 400;
            res.end('Don`t use /');
          } else {
            res.statusCode = 500;
            res.end('internal server error');
          }
        })
        .pipe(limitStream)
        .pipe(streamFile);

  }});

//       streamFile
//         .on('close', () => {
//         res.statusCode = 201;
//         res.end('File created');
//         })
//         .on('error', err =>  {
//         if (err.code === 'EEXIST') {
//           res.statusCode = 409;
//           res.end('File exists');
//           return;
//         } res.statusCode = 500;
//         res.setHeader('Connection', 'close');
//         res.end('Internal server error');
//
//         fs.unlink(filepath, (err) => {});
//       });
//
//         limitStream.on('error', (err) => {
//           if (err.code === 'LIMIT_EXCEEDED') {
//             res.statusCode = 413;
//             res.setHeader('Connection', 'close');
//             res.end('File is too big');
//
//             fs.unlink(filepath, (err) => {});
//             return;
//           }
//
//           console.error(err);
//
//           res.statusCode = 500;
//           res.setHeader('Connection', 'close');
//           res.end('Internal server error');
//
//           fs.unlink(filepath, (err) => {});
//         });
//
//
//       break;
//
//     default:
//       res.statusCode = 500;
//       res.end('Not implemented');
//   }
// });

module.exports = server;
