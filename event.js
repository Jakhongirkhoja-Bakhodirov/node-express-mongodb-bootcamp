const EventEmitter = require('events');

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

myEmitter.on('newSale', (data) => {
  console.log(data);
});

myEmitter.on('newOrder', (order) => {
  console.log(order);
});

myEmitter.emit('newSale', 'new sale');

myEmitter.emit('newOrder', 'new order');
