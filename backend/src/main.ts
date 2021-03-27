import { Server, Socket } from "socket.io";
import { default as SimplePeer } from 'simple-peer';
import wrtc from 'wrtc';
import { startTranslation } from "./translation";
import ss from 'socket.io-stream';
import { v4 } from 'uuid';
import fs from 'fs';
import { Stream } from "node:stream";
var sox = require('sox-stream')


type ConnectionData = {
  peer: SimplePeer.Instance;
  socket: Socket;
  config?: {
    // TODO
  };
};

const connections = new Map<string, ConnectionData>();


const io = new Server(3000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', async socket => {
  // register the client
  connections[socket.id] = {
    socket,
  };
  const onStream = await startTranslation();
  ss(socket).on('audio-stream', (stream: any, data) => {
    let filename = v4() + "stream.flac";
    const newStream = stream.pipe(sox({ input: { type: 'wav' }, output: { type: 'flac' } }))
    const writeStream = newStream.pipe(fs.createWriteStream(filename));
    writeStream.on('close', () => {
      onStream(/*newStream*/ filename);
    });
  });
});

