import { Server, Socket } from "socket.io";
import { default as SimplePeer } from 'simple-peer';
import wrtc from 'wrtc';

type ConnectionData = {
  peer: SimplePeer.Instance;
  socket: Socket;
  config?: {
    // TODO
  };
  // add other stuff here
};

const connections = new Map<string, ConnectionData>();


const io = new Server(3000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', socket => {
  // register the client
  const peer = new SimplePeer({ wrtc, initiator: true });
  connections[socket.id] = {
    peer,
    socket,
  };
  registerPeer(peer, socket);
});

function registerPeer(peer: SimplePeer.Instance, socket: Socket) {
  // handle WebRTC signals to keep the connection alive
  peer.on('signal', data => {
    socket.emit("signal", data);
  });
  socket.on('signal', data => {
    peer.signal(data);
  });
  // set config
  peer.on('data', config => {
    connections[socket.id].config = config;
  });
  // on disconnect
  peer.on('close', cleanUp);
  socket.on('disconnect', cleanUp);
  function cleanUp() {
    if (connections.has(socket.id)) {
      delete connections[socket.id];
    }
  }
  // **on media stream**
  peer.on('track', (track, stream) => {
    console.log(`this is my track: ${track}, and this is my stream: ${stream}`)
  });
  console.log(`all events registered for socket ${socket.id}`);
}

// 1. the server starts listening for websocket connections
// 2. the client creates a new Peer and sends a request to the server
// 3. the server accepts that request, and creates a new Peer for that client (stored in a Map: SocketId => Peer)
// 4. When the client sends a track, we accept and start processing
// 5. When the server sends a track, we accept and temporarily mute the speaker that it's associated with


// import createSignalServer from 'simple-signal-server'
// const signalServer = createSignalServer(io)
// const allIDs = new Set()

// signalServer.on('discover', (request) => {
//   const clientID = request.socket.id // clients are uniquely identified by socket.id
//   allIDs.add(clientID) // keep track of all connected peers
//   request.discover(Array.from(allIDs)) // respond with id and list of other peers
// })

// signalServer.on('disconnect', (socket) => {
//   const clientID = socket.id
//   allIDs.delete(clientID)
// })

// signalServer.on('request', (request) => {
//   request.forward() // forward all requests to connect
// })
