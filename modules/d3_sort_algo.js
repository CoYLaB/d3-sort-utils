export { lowestExchangeSort, highestExchangeSort };

import { highlightColourBar, swapBars, waitAnimationEnd } from "d3_sort_animation.js";	

async function lowestExchangeSort() {
  var j, value;

  for (let i=1; i<noData; i++) {

    if (startButton_status == "waiting") {
      console.log("[lowestExchangeSort] Stop Buttom Clicked: Exiting");
      break;
    }

    await highlightColourBar(i, colourScan, true);
    value = dataset[i];
    countReads++;
    countAccesses++;
    console.log("[lowestExchangeSort] i:" + i + " value[" + i + "]:" + value + " dataset:" + dataset);
    j = i-1;
    await highlightColourBar(i, colourScan, false);
    while ((j>=0) && dataset[j]>value) {

      if (startButton_status == "waiting") {
        console.log("[lowestSelectionSort] Stop Buttom Clicked: Exiting");
        break;
      }

      animationCount += 2;
      swapBars(j, j+1);
      await waitAnimationEnd();
      
      dataset[j+1] = dataset[j];
      dataset[j] = value;
      j--;

      countReads       += 2;
      countWrites      += 2;
      countAccesses    += 3;
      countSwaps       += 2;
      countComparisons += 1;			
    }
    console.log("[lowestExchangeSort] After swap dataset:" + dataset);				
  }
}

async function highestExchangeSort() {
  var j, value;

  for (let i=noData-2; i>=0; i--) {

    if (startButton_status == "waiting") {
      console.log("[highestExchangeSort] Stop Buttom Clicked: Exiting");
      break;
    }

    await highlightColourBar(i, colourScan, true);
    value = dataset[i];
    countReads++;
    countAccesses++;
    console.log("[highestExchangeSort] i:" + i + " value[" + i + "]:" + value + " dataset:" + dataset);
    j = i+1;
    await highlightColourBar(i, colourScan, false);
    while ((j<noData) && dataset[j]<value) {

      if (startButton_status == "waiting") {
        console.log("[highestExchangeSort] Stop Buttom Clicked: Exiting");
        break;
      }

      animationCount += 2;
      swapBars(j, j-1);
      await waitAnimationEnd();
      
      dataset[j-1] = dataset[j];
      dataset[j] = value;
      j++;

      countReads       += 2;
      countWrites      += 2;
      countAccesses    += 3;
      countSwaps       += 2;
      countComparisons += 1;			
    }
    console.log("[highestExchangeSort] After swap dataset:" + dataset);				
  }
}
