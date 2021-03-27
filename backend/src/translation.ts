import { SpeechTranslationServiceClient } from '@google-cloud/media-translation';

const client = new SpeechTranslationServiceClient();

async function translate_from_stream(readStream: MediaStream) {

  const config = {
    audioConfig: {
      audioEncoding: 'LINEAR16', // TODO: might need to change
      sourceLanguageCode: 'fr-FR',
      targetLanguageCode: 'en-US',
    },
    single_utterance: true,
  };

  // First request needs to have only a streaming config, no data.
  const initialRequest = {
    streamingConfig: config,
    audioContent: null,
  };

  const chunks = [];
  readStream
    .on('data', (chunk: any) => {
      const request = {
        streamingConfig: config,
        audioContent: chunk.toString(),
      };
      chunks.push(request);
    })
    .on('close', () => {
      // Config-only request should be first in stream of requests
      stream.write(readStream)
      stream.write(initialRequest);
      for (let i = 0; i < chunks.length; i++) {
        stream.write(chunks[i]);
      }
      stream.end();
    });

  const stream = client.streamingTranslateSpeech().on('data', response => {
    const { result } = response;
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
  });
