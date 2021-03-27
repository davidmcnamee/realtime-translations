import { SpeechTranslationServiceClient } from '@google-cloud/media-translation';

const config = {
  audioConfig: {
    audioEncoding: 'flac',
    sourceLanguageCode: 'en-US',
    targetLanguageCode: 'es-ES',
  },
  // singleUtterance: true,
  single_utterance: true,
};

let stopped = false;
let count = 1;
export function startTranslation() {
  const client = new SpeechTranslationServiceClient();
  const stream = client.streamingTranslateSpeech().on('error', onError).on('data', onTranslationData);
  // First request needs to have only a streaming config, no data.
  const initialRequest = {
    streamingConfig: config,
    audioContent: null,
  };
  stream.write(initialRequest);
  setTimeout(() => {
    stream.end();
    stopped = true;
  }, 10000);
  // stream.pause();

  // Send the remaining requests from audio track
  function onStream(audioStream: any) {
    if (stopped) return;
    let num = count;
    count += 1;
    console.log('resuming');
    // stream.resume();
    audioStream.on('data', (chunk: Buffer) => {
      if (stopped) return;
      const request = {
        streamingConfig: config,
        audioContent: chunk.toString('base64'),
      };
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
