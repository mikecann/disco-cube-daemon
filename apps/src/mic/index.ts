import { hang } from "../../../src/utils/misc";
import { createMatrix } from "../utils/matrix";
import { randomColor } from "../utils/rendering";


async function bootstrap() {
  const matrix = createMatrix();

  matrix.clear();

  var mic = require('mic');
  var fs = require('fs');

  var micInstance = mic({
    rate: '16000',
    channels: '1',
    debug: true,
    exitOnSilence: 6
  });
  var micInputStream = micInstance.getAudioStream();

  // var outputFileStream = fs.WriteStream('output.raw');

  // micInputStream.pipe(outputFileStream);

  micInputStream.on('data', function (data: any) {
    console.log("Recieved Input Stream: " + data.length);
  });

  micInputStream.on('error', function (err: any) {
    console.log("Error in Input Stream: " + err);
  });

  micInputStream.on('startComplete', function () {
    console.log("Got SIGNAL startComplete");

  });

  micInputStream.on('stopComplete', function () {
    console.log("Got SIGNAL stopComplete");
  });

  micInputStream.on('pauseComplete', function () {
    console.log("Got SIGNAL pauseComplete");

  });

  micInputStream.on('resumeComplete', function () {
    console.log("Got SIGNAL resumeComplete");

  });

  micInputStream.on('silence', function () {
    console.log("Got SIGNAL silence");
  });

  micInputStream.on('processExitComplete', function () {
    console.log("Got SIGNAL processExitComplete");
  });

  micInstance.start();


  matrix.sync();

  await hang();
}

bootstrap().catch((e) => console.error(`ERROR: `, e));
