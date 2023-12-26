const http = require('http');
const path = require('path');
const fs = require('fs');

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

  switch (request.method) {
    case 'GET':
      if (!fs.existsSync(filepath)) {
        response.statusCode = 404;
        response.end('File not found');
        return;
      }

      const stream = fs.createReadStream(filepath);
      stream.pipe(response);
      request.on('aborted', () => {
        stream.destroy();
      });
      break;

    default:
      response.statusCode = 500;
      response.end('Not implemented');
  }
});

module.exports = server;
