import { SpeechTranslationServiceClient } from '@google-cloud/media-translation';
// const speech = require('@google-cloud/speech').v1p1beta1
import fs from 'fs';

const config = {
  audioConfig: {
    audioEncoding: 'flac',
    sourceLanguageCode: 'en-US',
    targetLanguageCode: 'es-ES',
  },
  // singleUtterance: true,
  single_utterance: true,
};
// const config = {
//   encoding: 'flac',
//   sampleRateHertz: 16000,
//   languageCode: 'en-US',
// };

let stopped = false;
let count = 1;
export async function startTranslation() {
  const client = new SpeechTranslationServiceClient();
  // const client = new speech.SpeechClient();
  const stream = client.streamingTranslateSpeech().on('error', onError).on('data', onTranslationData);
  // const stream = client.streamingRecognize({ config, interimResults: true }).on('error', onError).on('data', onTranslationData);
  // First request needs to have only a streaming config, no data.
  const initialRequest = {
    streamingConfig: config,

    audioContent: null,
  };
  stream.write(initialRequest);
  setTimeout(() => {
    stream.end();
    stopped = true;
  }, 20000);
  // stream.pause();
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Send the remaining requests from audio track
  function onStream(/*audioStream: any*/ filename: string) {
    if (stopped) return;
    let num = count;
    count += 1;
    console.log('resuming');
    // stream.resume();
    fs.createReadStream(filename, { highWaterMark: 4096, encoding: 'base64' })
    /*audioStream*/.on('data', (chunk: Buffer) => {
      if (stopped) return;
      const request = {
        streamingConfig: config,
        audioContent: chunk.toString(/*'base64'*/),
      };
      // console.log(request)
      console.log('req for stream ', num);
      stream.write(request);
    }).on('close', () => {
      console.log('pausing');
      // stream.pause();
    });
  }
  return onStream;
}

function onTranslationData(response) {
  const { result } = response;
  console.log('response: ', JSON.stringify(response, null, 2));
  if (result.textTranslationResult.isFinal) {
    console.log(
      `\nFinal translation: ${result.textTranslationResult.translation}`
    );
    console.log(`Final recognition result: ${result.recognitionResult}`);
  } else {
    console.log(
      `\nPartial translation: ${result.textTranslationResult.translation}`
    );
    console.log(`Partial recognition result: ${result.recognitionResult}`);
  }
}

function onError(e: any) {
  if (e.code && e.code === 4) {
    console.log('Streaming translation reached its deadline.');
  } else {
    console.log(e);
  }
}
