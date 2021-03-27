import styled from "styled-components";
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

const Title = styled.h1`
  color: red;
  font-size: 50px;
`;

type State = {
  peer: any;
  socket: Socket;
};

export default function Home() {
  const [state, setState] = useState<State | undefined>();

  useEffect(() => {
    (async function () {
      const [peer, socket] = await onLoad();
      setState({ peer, socket });
    })();
  }, []);

  return (
    <>
      <div>
        <Title>My page</Title>
      </div>
      {/* <script src="/simple-signal-client.min.js" /> */}
      <script src="/simplepeer.min.js" />
    </>
  );
}

async function onLoad() {
  const peer = new SimplePeer();
  const socket = io("ws://localhost:3000", { autoConnect: false });
  registerPeer(peer, socket);
  socket.connect();
  const connectionPromise = new Promise(resolve => {
    peer.on("connect", resolve);
  });
  await connectionPromise;
  alert("connected!");
  return [peer, socket];
}

function registerPeer(peer: any, socket: Socket) {
  // handle WebRTC signals to keep the connection alive
  peer.on("signal", (data: any) => {
    socket.emit("signal", data);
  });
  socket.on("signal", (data: any) => {
    peer.signal(data);
  });
  // server should never disconnect on us
  socket.on("disconnect", onDisconnect);
  peer.on("close", onDisconnect);
  function onDisconnect() {
    alert("Uh oh... We just disconnected from the server :/");
  }
  console.log("set up all handlers");
}

// var signalClient = new SimpleSignalClient(socket); // Uses an existing socket.io-client instance
// signalClient.on("discover", async (allIDs: string[]) => {
//   const id = prompt(allIDs.join(", ")); // Have the user choose an ID to connect to
//   const { peer } = await signalClient.connect(id); // connect to target client
//   alert("hi2!");
//   peer; // this is a fully-signaled simple-peer object (initiator side)
// });

// signalClient.on("request", async (request: any) => {
//   const { peer } = await request.accept(); // Accept the incoming request
//   alert("hi!");
//   peer; // this is a fully-signaled simple-peer object (non-initiator side)
// });

// signalClient.discover();
