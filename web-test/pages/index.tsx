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
      navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(mediaStream => {
        const audioTracks = mediaStream.getAudioTracks();
        const audioTrack = audioTracks[0];
        peer.addTrack(audioTrack, mediaStream);
        alert("sent audio track");
      });
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
