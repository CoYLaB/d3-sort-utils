// Sort Array Data
var noData = 50, noDataMax = 50, dataset = [], backup = [];
const maxValue = 256;

// Counter Variables
const counterFrequency = 10;
var timerStart, countComparisons, countSwaps, countReads, countWrites, countAccesses;

// Sort Algorithm Function
var algorithmSort;

// Default Console Logging Functions
var original_console_log, original_console_group, original_console_groupEnd;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function binarySearch(leftIndex, rightIndex, value) {
	let searchIndex;

	console.log("[binarySearch] Searching for:" + value + " interval [" + leftIndex + "," + rightIndex + "] dataset:" + dataset);
	searchIndex = Math.floor((leftIndex+rightIndex)/2);
	while (leftIndex <= rightIndex) {
		console.log("[binarySearch] searchIndex:" + searchIndex + " dataset[" + searchIndex + "]:" + dataset[searchIndex]);
		
		await highlightColourBars([leftIndex,rightIndex], colourStop, true);
		await highlightColourBar(searchIndex, colourScan, true);

		if (dataset[searchIndex]<value) {
			await highlightColourBar(leftIndex, colourStop, false);
			leftIndex = searchIndex+1;
		}
		else {
			await highlightColourBar(rightIndex, colourStop, false);
			rightIndex = searchIndex-1;
		}
		countReads++;
		countAccesses++;
		countComparisons++;
		console.log("[binarySearch] now interval [" + leftIndex + "," + rightIndex + "]");
		await highlightColourBar(searchIndex, colourScan, false);
		searchIndex = Math.floor((leftIndex+rightIndex)/2);	
	}
	return searchIndex+1;
}

// Generate shortshell gap 'id' for no number of items
//
function generateShellsortGap(no, id) {
	arr_gap = [];

	switch(id) {
		case 'shell':
			let gap = no;
			while (gap>1) {
				gap = Math.floor(gap/2);
				arr_gap.push(gap);
			}
			break;
		case 'ciura':
			ciura_gap = [1750, 701, 301, 132, 57, 23, 10, 4, 1 ];
			for (let index in ciura_gap) {
				if (ciura_gap[index]<=no)
					arr_gap.push(ciura_gap[index]);
			}
			break;
	}
	return arr_gap;
}

// Generate dataset array of no bars
//
function generateBars(no) {
	console.groupCollapsed("[generateBars]");

	dataset = backup.slice()
	len = dataset.length;
	console.log({no, len, dataset});
	console.log("Before backup:" + backup);
	console.log("Before dataset:" + dataset);
	if (no<=len)
		dataset = dataset.slice(0, no);
	else {
		for (var i=0; i<(no-len); i++) {
			var newValue = Math.floor(Math.random()*maxValue);
			dataset.push(newValue);
		};
	}
	backup = dataset.slice();
	console.log("After backup:" + backup);
	console.log("After dataset:" + dataset);

	console.groupEnd("[generateBars]");
}

// Generate duration string (ms) between t1 and t0
//
function getDuration(t0, t1) {
	let strDuration = "";
	let mDuration = 0, sDuration = 0, msDuration = Math.floor(t1-t0);
				
	if (msDuration >= 1000) {
		sDuration = Math.floor(msDuration/1000);
		msDuration -= sDuration*1000;
	}
	if (sDuration >= 60) {
		mDuration = Math.floor(sDuration/60);
		sDuration -= mDuration*60;
		strDuration = mDuration + "m ";						
	}
	if (mDuration > 0)
		strDuration = mDuration + "m ";
	if (sDuration > 0)
		strDuration += sDuration + "s ";
	strDuration += msDuration + "ms";
				
	return strDuration;
}

function startUpdateValue() {
	counterDuration.value = getDuration(timerStart, performance.now());
	counterComparisons.value = countComparisons;
	counterSwaps.value = countSwaps;
	counterReads.value = countReads;
	counterWrites.value = countWrites;
	counterAccesses.value = countAccesses;

	if (startButton_status == "stop")
		setTimeout(startUpdateValue, counterFrequency);
}

function resetCounters() {
	console.log("[resetCounters]");
	counterDuration.value = counterComparisons.value = counterSwaps.value = "";
	counterReads.value = counterWrites.value = counterAccesses.value  = "";
}

async function mainSort() {
	console.group("[mainSort]");

	countReads = countWrites = countAccesses = 0;

	console.log("Before backup:" + backup);
	console.log("Before dataset:" + dataset);				

	await algorithmSort(dataset, noData);

	console.log("After backup:" + backup);
	console.log("After dataset:" + dataset);

	console.groupEnd("[mainSort]");
}

function configureSort(functionAlgo) {
	console.log("[configureSort] " + functionAlgo.name);
	algorithmSort = functionAlgo;
}

async function startSort() {
	console.log("[startSort]");

	timerStart = performance.now();
	countComparisons = countSwaps = countReads = countWrites = countAccesses = 0;

	startUpdateValue();
	await mainSort();

	if (startButton_status == "waiting")
		repaintBars();	

	startButton.textContent = "Restart";
	startButton_status = "restart";
}

function restartSort() {
	console.group("[restartSort]");
	redrawBars();
	resetCounters();
	console.groupEnd("[restartSort]");
}

function configureLogging() {
	console.group("[configureLogging]");
	console.log("Turning off console logging");
	console.groupEnd("[configureLogging]");
	// Save default console.log, console.group & console.groupEnd functions
	original_console_log      = console.log;
	original_console_group    = console.group;
	original_console_groupEnd = console.groupEnd;
	// Overwrites default console.log, console.group & console.groupEnd functions
	console.log      = () => {};
	console.group    = () => {};
	console.groupEnd = () => {};
}
