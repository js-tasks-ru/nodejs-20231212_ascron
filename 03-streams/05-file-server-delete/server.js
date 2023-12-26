const http = require('http');
const path = require('path');
const fs = require('node:fs');

const server = new http.Server();

server.on('request', (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  if (pathname.includes('/')) {
    response.statusCode = 400;
    response.end('Nested paths are not allowed');
    return;
  }

  if (!fs.existsSync(filepath)) {
    response.statusCode = 404;
    response.end('Not found');
    return;
  }

  switch (request.method) {
    case 'DELETE':
      fs.unlinkSync(filepath);
      response.statusCode = 200;
      response.end();
      break;

    default:
      response.statusCode = 501;
      response.end('Not implemented');
  }
});

module.exports = server;
