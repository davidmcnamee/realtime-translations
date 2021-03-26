globalThis.navigator = { platform: "nodejs" }
globalThis.window = globalThis
globalThis.location = {protocol: "https:", hostname: "localhost"}
const {peerjs} = require('peerjs');
const {Peer} = peerjs;

const peer = new Peer('someid', {
  host: 'localhost',
  port: 9000,
  path: '/myapp'
});

setTimeout(() => console.log('5 seconds'), 5000);
