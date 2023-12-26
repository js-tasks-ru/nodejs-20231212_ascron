const http = require('http');
const path = require('path');
const fs = require('node:fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const server = new http.Server();

server.on('request', (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = url.pathname.slice(1);

  if (pathname.includes('/')) {
    response.statusCode = 400;
    response.end('Nested paths are not allowed');
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  if (fs.existsSync(filepath)) {
    response.statusCode = 409;
    response.end('File exists');
    return;
  }

  switch (request.method) {
    case 'POST':
      const limitStream = new LimitSizeStream({limit: 1000000});
      const writeStream = fs.createWriteStream(filepath);
      let writeCompleted = false;

      request.pipe(limitStream).pipe(writeStream);

      limitStream.on('error', (err) => {
        writeStream.close();
        if (err instanceof LimitExceededError) {
          response.statusCode = 413;
          response.end('File is too big!');
          fs.unlinkSync(filepath);
        } else {
          response.statusCode = 500;
          response.end('Internal server error');
        }
      });

      request.on('end', () => {
        writeCompleted = true;
      });

      request.on('close', () => {
        if (!writeCompleted) {
          fs.unlinkSync(filepath);
          response.statusCode = 500;
          response.end('Internal server error');
        }
      });

      writeStream.on('finish', () => {
        response.statusCode = 201;
        response.end('File created');
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
