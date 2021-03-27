let fs = require('fs');
let wav = require('node-wav');

debugger;
let buffer = fs.readFileSync('test.wav');
let result = wav.decode(buffer);
console.log(result.sampleRate);
console.log(result.channelData); // array of Float32Arrays

wav.encode(result.channelData, { sampleRate: result.sampleRate, float: true, bitDepth: 32 });
