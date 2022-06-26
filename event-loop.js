const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();

// process.env.UV_THREADPOOL_SIZE = 6;

// console.log(process.env.UV_THREADPOOL_SIZE);

setImmediate(() => {
  console.log('Immediate 1 finished');
});

setTimeout(() => {
  console.log('Timer 1 finished');
}, 0);

fs.readFile('./server.js', () => {
  console.log('I/O task finished');
  console.log('==========================');
  setTimeout(() => {
    console.log('Timer 2 finished');
  });
  setImmediate(() => {
    console.log('Immediate 2 finished');
  });

  crypto.pbkdf2('password', 'salt', 10000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Ecrypted');
  });

  crypto.pbkdf2('password', 'salt', 10000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Ecrypted');
  });

  crypto.pbkdf2('password', 'salt', 10000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Ecrypted');
  });

  crypto.pbkdf2('password', 'salt', 10000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Ecrypted');
  });

  crypto.pbkdf2('password', 'salt', 10000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Ecrypted');
  });

  crypto.pbkdf2('password', 'salt', 10000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'Password Ecrypted');
  });
});

console.log('Hello from the top-level code');
