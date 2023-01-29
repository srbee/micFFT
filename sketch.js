function setup() {
  createCanvas(1, 1);
}

function draw() {
  background(220);
}

function myAudio(){
  
  // Set up audio cdrawt and variables
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let source;
  let stream;

  // Create an analyser node
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 1024;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // Request microphone access
  navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(function(micStream) {
      stream = micStream;
      source = audioCtx.createMediaStreamSource(stream);

      // Create a biquad filter
      const biquadFilter = audioCtx.createBiquadFilter();
      biquadFilter.type = "bandpass";
      biquadFilter.frequency.value = 1000;
      biquadFilter.Q.value = 1;

      // Connect the microphone to the filter
      source.connect(biquadFilter);

      // Connect the filter to the analyser
      biquadFilter.connect(analyser);

      // Create a gain node
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 5;

      // Connect the analyser to the gain node
      analyser.connect(gainNode);

      // Connect the gain node to the destination
      gainNode.connect(audioCtx.destination);

      // Create a canvas element to display the FFT data
      const canvas = document.createElement("canvas");
      document.body.appendChild(canvas);
      const canvasCtx = canvas.getContext("2d");

      // Draw the frequency data onto the canvas
      function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        canvasCtx.fillStyle = "rgb(0, 0, 0)";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        let barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];
          canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
          canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
          x += barWidth + 1;
        }
      }

      draw();
    })
    .catch(function(err) {
      console.log("The following error occurred: " + err);
    });

}
