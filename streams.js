const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  //Solution 1
  //   fs.readFile('./server.js', (err, data) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     res.end(data);
  //   });

  //Solution 2:Streams
  //   const readable = fs.createReadStream('./servers.js');
  //   readable.on('data', (chunk) => {
  //     res.write(chunk);
  //   });
  //   readable.on('end', () => {
  //     res.end();
  //   });
  //   readable.on('error', (err) => {
  //     console.log(err);
  //     res.statusCode = 500;
  //     res.end('File not found');
  //   });
  //Solution 3
  const readable = fs.createReadStream('./server.js');
  readable.pipe(res);
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server is running...');
});
