import styled from "styled-components";
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

const Title = styled.h1`
  color: red;
  font-size: 50px;
`;

type State = {
  socket: Socket;
};

export default function Home() {
  const [state, setState] = useState<State | undefined>();

  useEffect(() => {
    (async function () {
      const [socket] = await onLoad();
      setState({ socket });
      navigator.mediaDevices.getUserMedia({ audio: true }).then(mediaStream => {
        const recordAudio = RecordRTC(mediaStream, {
          type: "audio",
          mimeType: "audio/wav",
          // desiredSampRate: 16000,
          // sampleRate: 16000,
          // numberOfAudioChannels: 1,
          timeSlice: 1500,
          recorderType: StereoAudioRecorder,
          ondataavailable: (blob: Blob) => {
            const socketStream = ss.createStream();
            ss(socket).emit("audio-stream", socketStream, {
              personId: "test", // TODO: set this to the id of the person speaking
            });
            ss.createBlobReadStream(blob).pipe(socketStream);
          },
        });
        recordAudio.startRecording();
      });
    })();
  }, []);

  return (
    <>
      <div>
        <Title>My page</Title>
      </div>
      {/* <script src="/simple-signal-client.min.js" /> */}
      {/* <script src="/simplepeer.min.js" /> */}
      <script src="/socket.io-stream.js" />
      <script src="https://www.WebRTC-Experiment.com/RecordRTC.js" />
    </>
  );
}

async function onLoad() {
  const socket = io("ws://localhost:3000", { autoConnect: false });
  socket.connect();
  return [socket];
}
