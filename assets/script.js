var audio = document.getElementById('audio');
var play = document.getElementById('play');
play.addEventListener('click', function() {
	audio.paused ? audio.play() : audio.pause();
});

var app = new PIXI.Application({
	width: window.innerWidth,
	height: window.innerHeight,
	antialias: true,
	transparent: false,
	resolution: 1
});


app.renderer.backgroundColor = 0x2e3a6b;
app.renderer.autoResize = true;
document.body.appendChild(app.view);


var audioCtx = new AudioContext();
var source = audioCtx.createMediaElementSource(audio);
var analyser = audioCtx.createAnalyser();
source.connect(analyser);
analyser.connect(audioCtx.destination);

analyser.fftSize = 1024;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
var WIDTH = app.screen.width;
var HEIGHT = app.screen.height;
var barWidth = (WIDTH / bufferLength);
var barHeight;
var rotation = 0;
var arr = [];

var container = new PIXI.Container();

for (var i = 0; i < bufferLength; i++) {
	var g = new PIXI.Graphics();
	g.pivot.set(app.screen.width / 2, app.screen.height / 2);
	g.setTransform(app.screen.width / 2, app.screen.height / 2);
	if (i % 2 === 0) {
		g.beginFill(0xffffff);
	}
	else {
		g.beginFill(0xcccccc);
	}

	g.drawRect(1, 1, 1, 1);
	g.endFill();

	app.stage.addChild(g);
	container.addChild(g);
	arr.push(g);
}

var graphics = new PIXI.Graphics();

graphics.pivot.set(app.screen.width / 2, app.screen.height / 2);
graphics.setTransform(app.screen.width / 2, app.screen.height / 2);
app.stage.addChild(graphics);
container.addChild(graphics);


container.pivot.set(app.screen.width / 2, app.screen.height / 2);
container.position.set(app.screen.width / 2, app.screen.height / 2);
app.stage.addChild(container);
app.ticker.add(function(delta) {
	analyser.getByteFrequencyData(dataArray);
	graphics.clear();

	for (var i = 0; i < bufferLength; i++) {
		barHeight = dataArray[i];
		arr[i].width = barWidth;
		arr[i].height = barHeight;
		arr[i].rotation = (i * (Math.PI / 180));
	}
	graphics.beginFill(0xffffff);
	graphics.drawCircle(0, 0, dataArray[dataArray.length / 4] / 2);
	graphics.endFill();

	graphics.lineStyle(4, 0xe8e8e8, 0.2);
	graphics.beginFill(0xffffff, 0);
	graphics.drawCircle(0, 0, dataArray[0] + 200);
	graphics.endFill();
	container.rotation += delta * 0.005;
});

// function map(value, lower1, upper1, lower2, upper2) {
// 	return (value - lower1) / (upper1 - lower1) * (upper2 - lower2) + lower2;
// }
