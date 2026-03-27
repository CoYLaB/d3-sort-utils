// SVG Data
var svg, xScale, yScale;

// Display Maximum Height
const h = 400;
let vh  = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
svgHeight = Math.min(vh, h);

// Animation Data
var   animationCount = 0;
const animationWait = 10;

// Colour Variables
const colourMax  = "purple";
const colourMin  = "magenta";
const colourHigh = "magenta";
const colourScan = "green";
const colourStop = "red";
const colourMove = "orange";
			
// Configure X Scale
//
function configureXScale() {
	console.log("[configureXScale]");

	xScale = d3.scale.ordinal()
		.domain(d3.range(noData))
		.rangeRoundBands([0, svgWidth], 0.2, 0);
}

// Configure Y Scale
//
function configureYScale() {
	console.log("[configureYScale]");

	yScale = d3.scale.linear()
		.domain([0, maxValue])
		.rangeRound([0, svgHeight]);
}

// Configure Scales
//
function configureScales() {
	configureXScale();
	configureYScale();
}

// Create SVG element
//
function createSVG() {
	console.log("[createSVG]");

	svg = d3.select("body")
		.append("svg")
		.attr("width", "100%")
		.attr("height", svgHeight);
	svgWidth = Number(svg.style("width").slice(0, -2));
}

// Delete SVG element
//
function deleteSVG() {
	console.log("[deleteSVG]");

	svg.remove();
}

function displayBars() {
	console.log("[displayBars]");

	svg.selectAll("rect")
		.data(dataset)
		.enter()
   		.append("rect")
		.attr("id", function(d, i) {
			return "rect" + i;
		})
   		.attr("x", function(d, i) {
			return xScale(i);
		})
   		.attr("y", function(d) {
			return svgHeight - yScale(0);
		})
		.attr("width", xScale.rangeBand())
  	 	.attr("height", function(d) {
    			return yScale(0);
		})
		.attr("fill", function(d) {
    			return "rgb(0, 0, " + d + ")";
		})
		.transition()
		.duration(animationDelay)
 		.attr("y", function(d) {
    			return svgHeight - yScale(d);  // Height minus data value
		})
  	 	.attr("height", function(d) {
    			return yScale(d);
		})
		.attr("fill", function(d) {
    			return "rgb(0, 0, " + d + ")";
		});
}

function redrawBars() {
	console.log("[redrawBars]");

	svg.selectAll("rect")
		.data(dataset)
		.transition()
		.duration(animationDelay)
		.attr("id", function(d, i) {
			return "rect" + i;
		})
   		.attr("x", function(d, i) {
			return xScale(i);
		})
 		.attr("y", function(d) {
    			return svgHeight - yScale(d);  // Height minus data value
		})
  	 	.attr("height", function(d) {
    			return yScale(d);
		})
		.attr("fill", function(d) {
    			return "rgb(0, 0, " + d + ")";
		});
}

function repaintBars() {
	console.log("[repaintBars]");

	svg.selectAll("rect")
		.attr("fill", function(d) {
    			return "rgb(0, 0, " + d + ")";
		});
}

function changeBars() {
	console.log("[changeBars]");

	sel = svg.selectAll("rect")
		.data(dataset);
		
	// Exit bars to the right...
	sel.exit()
		.transition()
		.duration(animationDelay)
        		.attr("x", svgWidth)
        		.remove();

	// Create the new bar
	sel.enter()
   		.append("rect")
		.attr("id", function(d, i) {
			return "rect" + i;
		})
		.attr("x", function(d, i) {
			return (svgWidth + xScale(i));
		})
   		.attr("y", function(d) {
    			return svgHeight - yScale(d);  // Height minus data value
		})
		.attr("width", xScale.rangeBand())
  	 	.attr("height", function(d) {
    			return yScale(d);
		})
		.attr("fill", function(d) {
    			return "rgb(0, 0, " + d + ")";
		});

	sel.transition()
		.duration(animationDelay)
		.attr("id", function(d, i) {
			return "rect" + i;
		})
   		.attr("x", function(d, i) {
			return xScale(i);
		})
 		.attr("y", function(d) {
			return svgHeight - yScale(d);  // Height minus data value
		})
		.attr("width", xScale.rangeBand())
  		.attr("height", function(d) {
    			return yScale(d);
		})
		.attr("fill", function(d) {
    			return "rgb(0, 0, " + d + ")";
		});
}

// Change SVG rectangle bar's at position pos with colour col
//
function highlightBar(pos, col, toggle) {
	console.log("[highlightBar] bar:" + pos + " colour:" + col + " toggle:" + toggle);

	if (toggle)
		svg.select("#rect" + pos).attr("fill", col);
	else
		svg.select("#rect" + pos).attr("fill", function(d) {
    			return "rgb(0, 0, " + d + ")";
		});
}

// Highlight SVG rectangle bar at position pos with colour col
//
async function highlightColourBar(pos, col, toggle) {
	console.log("[highlightColourBar] bar:" + pos + " colour:" + col + " toggle:" + toggle);

	highlightBar(pos, col, toggle);
	switch (col) {
		case colourStop:
			delayHighlight = scanDelay;
			break;
		case colourMax:
			delayHighlight = scanDelay;
			break;
		case colourMin:
			delayHighlight = scanDelay;
			break;
		case colourScan:
			delayHighlight = scanDelay;
			break;
		case colourHigh:
			delayHighlight = scanDelay;
			break;
		default:
			delayHighlight = 75;
			break;
	}
	if (delayHighlight>0)
		await sleep(delayHighlight);
}

// Highlight SVG rectangle bar at position pos with colour col
//
async function highlightColourBars(arr, col, toggle) {
	console.log("[highlightColourBars] bars:" + arr + " colour:" + col + " toggle:" + toggle);
				
	for (let id in arr)
		highlightBar(arr[id], col, toggle);
	switch (col) {
		case colourStop:
			delayHighlight = scanDelay;
			break;
		case colourMax:
			delayHighlight = scanDelay;
			break;
		case colourMin:
			delayHighlight = scanDelay;
			break;
		case colourScan:
			delayHighlight = scanDelay;
			break;
		case colourHigh:
			delayHighlight = scanDelay;
			break;
		default:
			delayHighlight = 75;
			break;
	}
	if (delayHighlight>0)
		await sleep(delayHighlight);
}

// Highlight SVG rectangle bars with gap interval between positions bar1 and bar2
//
async function highlightRotateGapBars(bar1, bar2, gap, col, toggle) {
	console.log("[highlightRotateGapBars] gap:" + gap + " from bar:" + bar1 + " to bar:"+ bar2);

	for (var i=bar1; i<=bar2; i+=gap)
		highlightBar(i, col, toggle);

	switch (col) {
		case colourStop:
			delayHighlight = scanDelay;
			break;
		case colourMax:
			delayHighlight = scanDelay;
			break;
		case colourMin:
			delayHighlight = scanDelay;
			break;
		case colourScan:
			delayHighlight = scanDelay;
			break;
		case colourHigh:
			delayHighlight = scanDelay;
			break;
		default:
			delayHighlight = 75;
			break;
	}
	if (delayHighlight>0)
		await sleep(delayHighlight);
}

// Move SVG rectangle bar from position startPos to EndPos
//
function moveBar(startPos, endPos) {
	console.log("[moveBar] startPos:" + startPos + " endPos:" + endPos);

	svg.select("#rect" + startPos)
		.transition()
		.duration(animationDelay)
		.attr("x", xScale(endPos))
		.each("start", function() {
			d3.select(this).attr("fill", "orange");
			d3.select(this).attr("id", "rect" + endPos + "_new");
		})
		.each("end", function(d) {
			d3.select(this).attr("fill", "rgb(0, 0, " + d + ")");
			animationCount--;
		});
}

// Swap SVG rectangle bars startPod and endPos
//
function swapBars(startPos, endPos) {
	console.log("[swapBars] startPos:" + startPos + " endPos:" + endPos);
	moveBar(startPos, endPos);
	moveBar(endPos, startPos);
}

// Rotate SVG rectangle bars between positions bar1 and bar2 from left to right
//
async function rotateRightBars(bar1, bar2) {
	console.log("[rotateBars] bar1:" + bar1 + " - bar2:" + bar2);
				
	var arr = [];
	for (var i=bar1; i<=bar2; i++)
		arr.push(i);
	await highlightColourBars(arr, colourMove, true);

	moveBar(bar2, bar1);
	for (i=bar2; i>bar1; i--)
		moveBar(i-1, i);
}

// Rotate SVG rectangle bars between positions bar1 and bar2 from right to left
//
async function rotateLeftBars(bar1, bar2) {
	console.log("[rotateLeftBars] bar1:" + bar1 + " - bar2:" + bar2);
				
	var arr = [];
	for (var i=bar1; i<=bar2; i++)
		arr.push(i);
	await highlightColourBars(arr, colourMove, true);

	moveBar(bar1, bar2);
	for (i=bar2; i>bar1; i--)
		moveBar(i, i-1);
}

// Rotate SVG rectangle bars with gap interval between positions bar1 and bar2 from left to right 
//
async function rotateLeftGapBars(bar1, bar2, gap) {
	console.log("[rotateLeftGapBars] gap:" + gap + " bar:" + bar1 + " - bar:" + bar2 + " animationCount:" + animationCount);
				
	var arr = [];
	for (var i=bar1; i<=bar2; i+=gap)
		arr.push(i);
	await highlightColoursBars(arr, colourMove, true);

	moveBar(bar1, bar2);
	for (i=bar2; (i-gap)>=bar1; i-=gap)
		moveBar(i, i-1);
}

// Rotate SVG rectangle bars with gap interval between positions bar1 and bar2 from left to right 
//
async function rotateRightGapBars(bar1, bar2, gap) {
	console.log("[rotateRightGapBars] gap:" + gap + " bar:" + bar1 + " - bar:" + bar2 + " animationCount:" + animationCount);
				
	var arr = [];
	for (var i=bar1; i<=bar2; i+=gap)
		arr.push(i);
	await highlightColourBars(arr, colourMove, true);

	moveBar(bar2, bar1);
	for (i=bar1; (i+gap)<=bar2; i+=gap)
		moveBar(i, i+gap);
}

// Rename all SVG rectangle bars that have been animated and which have suffix '_new' 
//
function renameBars() {
	console.log("[renameBars]");

	// Rename the moved bars in relation to their new positions
	svg.selectAll("rect[id$='_new']")
		.each(function(d) {
			new_id = d3.select(this).attr("id").slice(0, -4);
			console.log("before id:" + d3.select(this).attr("id") + " after id:" + new_id);
			d3.select(this).attr("id", new_id);
		});
}

// Wait for the end of animation 
//
async function waitAnimationEnd() {
	console.groupCollapsed("[waitAnimationEnd]");
	console.log("BEGIN");

	while(animationCount != 0) {
		console.log({animationCount});
		await sleep(animationWait);
	}
	console.log({animationCount});
	renameBars();

	console.log("END");
	console.groupEnd("[waitAnimationEnd]");
}
