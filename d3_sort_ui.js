// Controller Status
var startButton_status = "start";
var startButton, randomButton;

// Bar Slider
var   barsSlider;
const barsArray = [5, 10, 25, 50];

// Scan Slider
var   scanSlider;
const scanArray = [50, 75, 150, 300];
var   scanDelay = 75;

// Animation Slider
var   animationSlider;
const animationArray = [300, 600, 750, 1000];
var   animationDelay = 300;

// Counter
var counterDuration, counterComparisons;
var counterSwaps, counterReads, counterWrites, counterAccesses;

// "Algorithm" Input Radio
var leftLabel, rightLabel, leftRadio, rightRadio;
var leftAction, rightAction;

function getClosest(arr, val) {
	return arr.reduce(function (prev, curr) {
		return (Math.abs(curr-val) < Math.abs(prev - val) ? curr : prev);
	});
}

function configureUI(algoConfig) {
	console.log("[configureUI]");

	startButton  = document.querySelector("#start");
	randomButton = document.querySelector("#random");

	barsSlider      = document.querySelector("#barsSlider");
	scanSlider      = document.querySelector("#scanSlider");
	animationSlider = document.querySelector("#animationSlider");

	counterDuration    = document.querySelector("#durationValue");
	counterComparisons = document.querySelector("#compValue");
	counterSwaps       = document.querySelector("#swapValue");
	counterReads       = document.querySelector("#readValue");
	counterWrites      = document.querySelector("#wriValue");
	counterAccesses    = document.querySelector("#accValue");

	barsSlider.value      = document.querySelector("#barsValue").value      = noData;
	scanSlider.value      = document.querySelector("#scanValue").value      = scanDelay;
	animationSlider.value = document.querySelector("#animationValue").value = animationDelay;

	barsSlider.addEventListener("change",       () => controllerAction("slider_bar"));
	scanSlider.addEventListener("change",       () => controllerAction("slider_scan"));
	animationSlider.addEventListener("change",  () => controllerAction("slider_transition"));
	startButton.addEventListener("click",       () => controllerAction(startButton_status));
	randomButton.addEventListener("click",      () => controllerAction("randomise"));
	window.onresize                           = () => controllerAction("display");

	if (typeof algoConfig !== 'undefined') {
		divAlgoRadio.addEventListener("change", () => controllerAction("algo"));

		divAlgoRadio = document.querySelector("#divAlgoRadio");	// Radio selection section
		divAlgoName  = document.querySelector("#divAlgoName");	// Radio selection section
		leftRadio    = document.querySelector("#leftRadio");	// Left  radio button for divAlgo
		rightRadio   = document.querySelector("#rightRadio");	// Right radio button for divAlgo
		leftLabel    = document.querySelector("#leftLabel");	// Left  radio label  for divAlgo
		rightLabel   = document.querySelector("#rightLabel");	// Right radio label for divAlgo	

		// Configure divAlgo radio
		divAlgoName.innerHTML = "<b>" + algoConfig.divAlgoName + "</b>";
		leftLabel.innerHTML   = algoConfig.leftLabel;
		rightLabel.innerHTML  = algoConfig.rightLabel;

		// Configure divAlgo actions
		leftAction = algoConfig.leftAction;
		rightAction = algoConfig.rightAction;
	}
}

function startUI() {
	console.group("[StartUI]");

	createSVG();
	configureScales();
	generateBars(noData);
	displayBars();

	console.groupEnd("[StartUI]");
}

async function controllerAction(action) {
	let closest;

	console.log("[controllerAction] " + action);
	switch(action) {
		case "algo":
			if (leftRadio.checked) {
				algorithmSort    = leftAction;
				leftLabel.style  = "opacity:100%";
				rightLabel.style = "opacity:50%";
			}
			else {
				algorithmSort    = rightAction;
				rightLabel.style = "opacity:100%";
				leftLabel.style  = "opacity:50%";
			}
			console.log("algorithm: " + algorithmSort.name);
			if (startButton_status == "stop") {
				startButton_status = "waiting";
				startButton.textContent = "Waiting";
				await waitSortEnd();
				resetCounters();
			}
			break;
		case "slider_bar":
			closest = getClosest(barsArray, barsSlider.value);
			console.log("[controllerAction] closest:" + closest);
			barsSlider.value = closest;
			if (noData != closest) {
				noData = document.querySelector("#barsValue").value = closest;
				if (startButton_status == "stop") {
					startButton_status = "waiting";
					startButton.textContent = "Waiting";
					await waitSortEnd();
				}
				generateBars(noData);
				xScale = d3.scale.ordinal()
					.domain(d3.range(noData))
					.rangeRoundBands([0, svgWidth], 0.2, 0);
				changeBars();
				resetCounters();
				startButton_status = "start";
				startButton.textContent = "Start";
			}							
			break;
		case "slider_scan":
			closest = getClosest(scanArray, scanSlider.value);
			console.log("[controllerAction] closest:" + closest);
			scanSlider.value = closest;
			if (scanDelay != closest)
				scanDelay = document.querySelector("#scanValue").value = closest;
			break;
		case "slider_transition":
			closest = getClosest(animationArray, animationSlider.value);
			console.log("[controllerAction] closest:" + closest);
			animationSlider.value = closest;
			if (animationDelay != closest)
				animationDelay = document.querySelector("#animationValue").value = closest;
			break;
		case "start":
			startButton.textContent = "Stop";
			startButton_status = "stop";
			startSort();
			break;
		case "stop":
			startButton.textContent = "Waiting";
			startButton_status = "waiting";
			break;
		case "restart":
			startButton.textContent = "Start";
			startButton_status = "start";
			dataset = backup.slice()
			restartSort();
			break;
		case "randomise":
			if (startButton_status == "stop") {
				startButton_status = "waiting";
				startButton.textContent = "Waiting";
			}
			if (startButton_status == "waiting")
				await waitSortEnd();
			backup = [];
			generateBars(noData);
			changeBars();
			resetCounters();
			startButton_status = "start";
			startButton.textContent = "Start";
			break;
		case "display":
			if (startButton_status == "stop") {
				startButton_status = "waiting";
				startButton.textContent = "Waiting";
			}
			if (startButton_status == "waiting")
				await waitSortEnd();
			deleteSVG();
			createSVG();
			configureXScale();
			displayBars();
			if (startButton_status == "waiting") {
				startButton.textContent = "Restart";
				startButton_status = "restart";
			}
			break;
	}
}

async function waitSortEnd() {
	while ((startButton_status != "restart") && (startButton_status != "start")) {
		console.log("[waitSortEnd] startButton_status:" + startButton_status);
		await sleep(animationWait);
	}
	console.log("[waitSortEnd] startButton_status:" + startButton_status);
}
