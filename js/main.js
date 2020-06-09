'use strict';

let mediaRecorder;
let recordedVid;


//Event listeners
const recordBtn = document.getElementById('record');
recordBtn.addEventListener('click', () => {
  if (recordBtn.textContent === 'Record') {
    startRecording();
  } else {
    stopRecording();
    recordBtn.textContent = 'Record';
    playBtn.disabled = false;
    downloadBtn.disabled = false;
  }
});

const playback = document.getElementById('playback');
const playBtn = document.getElementById('play');
playBtn.addEventListener('click', () => {
  const newVid = new Blob(recordedVid, {
    type: 'video/webm'
  });
  playback.src = null;
  playback.srcObject = null;
  playback.src = window.URL.createObjectURL(newVid);
  playback.controls = true;
  playback.play();

});

//stop camera
const stopBtn = document.getElementById('stop');
stopBtn.addEventListener('click', () => {
  window.stream.getTracks().forEach((track) => {
    track.stop();
    recordBtn.disabled = true;
    stopBtn.disabled = true;
  });
});

const downloadBtn = document.getElementById('download');
downloadBtn.addEventListener('click', () => {
  const blob = new Blob(recordedVid, {
    type: 'video/webm'
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});

//start recording
function runData(event) {
  if (event.data && event.data.size > 0) {
    recordedVid.push(event.data);
  }
};

function startRecording() {
  recordedVid = [];
  let types = ['video/webm\;codecs=vp9,opus', 'video/webm\;codecs=vp8,opus', 'video/webm'];
  for (var i in types) {
    console.log("Is " + types[i] + " supported? " + (MediaRecorder.isTypeSupported(types[i]) ? "Possible" : "No :("));
  }
  try {
    mediaRecorder = new MediaRecorder(window.stream, types);
  } catch (err) {
    console.error(err);
  }
  recordBtn.textContent = ' Stop ';
  playBtn.disabled = true;
  downloadBtn.disabled = true;
  mediaRecorder.ondataavailable = runData;
  mediaRecorder.start();
  console.log('Start Recording', mediaRecorder);
};

//stop recording
function stopRecording() {
  mediaRecorder.stop();
};

function stopCamera() {
  MediaStreamTrack.stop();
};

///start camera/ get permission for audio/video with async function
function handleSuccess(stream) {
  recordBtn.disabled = false;
  window.stream = stream;

  const record = document.getElementById('rec');
  record.srcObject = stream;
};

async function init(constraints) {
  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (err) {
    console.error('getUserMedia error', err);
  }
}

//eventListener with async function
const startCam = document.getElementById('startCam');
startCam.addEventListener('click', async () => {
  const constraints = {
    audio: {
      echoCancellation: true
    },
    video: {
      width: 1280,
      height: 720
    }
  };
  console.log(constraints);
  await init(constraints);
  stopBtn.disabled = false;
});
