const connection = await Deno.connect({hostname: '10.0.1.40', port: 8800});

function stringToUint8Array(str: string) {
  return Uint8Array.from(str.split("").map(x => x.charCodeAt(0)))
}

function send(command: string, payload: string) {
  connection.write(stringToUint8Array('ele' + command + payload))
}

function logValue(value: Uint8Array) {
	console.log(String.fromCharCode(...value))
}

function fetchStream(stream: ReadableStream) {
  const reader = stream.getReader();
  reader.read().then(function processText({ done, value }): Promise<void> {
    // Result objects contain two properties:
    // done  - true if the stream has already given you all its data.
    // value - some data. Always undefined when done is true.
    if (done) {
		  logValue(value);
      console.log("Stream complete");
      return Promise.resolve();
    }
    logValue(value);
      // Read some more, and call this function again
      return reader.read().then(processText);
    });
}

fetchStream(connection.readable);

setTimeout(() => {
  send('a48', '#1#2#')
}, 1000)