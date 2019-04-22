const audio = document.getElementById('audio');
const play = document.getElementById('play');
const file = document.getElementById('file');
const cnv = document.querySelector('canvas');
const progress = document.querySelector('#pI');
const ctx = cnv.getContext('2d');
let dataArray;
audio.load();

function update(a, w, t) {
  progress.style.width = ((audio.currentTime / audio.duration) * 100) + '%';

  a.getByteFrequencyData(dataArray);
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  ctx.fillStyle = '#fcfcfc';
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  ctx.save();
  ctx.translate(cnv.width / 2, cnv.height / 2);
  ctx.rotate(t * 0.0020);
  for (let i = 0; i < 360; i++) {
    const h = dataArray[i];
    ctx.fillStyle = `hsl(${t / 10}, 100%, 50%)`;
    ctx.rotate(Math.round(i * Math.PI / 180));
    ctx.fillRect(100, -5, h, 1);
  }
  ctx.restore();

  t++;
  requestAnimationFrame(function (ts) {
    update(a, w, t)
  });
}

cnv.width = window.innerWidth;
cnv.height = window.innerHeight;

play.addEventListener('click', function () {
  audio.paused ? audio.play() : audio.pause();
});

file.addEventListener('change', e => {
  const files = e.target.files;
  audio.src = URL.createObjectURL(files[0]);
  document.getElementById('nowplaying').innerHTML = files[0].name.substring(0, files[0].name.indexOf(".mp3"));
  audio.load();
  audio.play();

  const audioCtx = new AudioContext();
  const analyser = audioCtx.createAnalyser();
  const source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 1024;

  const bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  const barWidth = (cnv.width / bufferLength);

  update(analyser, barWidth, 0);

});

document.querySelector('#title').addEventListener('click', e => {
  document.querySelector('#about').classList.toggle('inactive');
  e.target.classList.toggle('open');
});

window.onresize = _ => {
  cnv.width = window.innerWidth;
  cnv.height = window.innerHeight;
}
