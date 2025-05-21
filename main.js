"use strict";

// --- STATS HANDLERS SECTION ---
window.stats = {
    comparisons: 0,
    swaps: 0,
    startTime: 0,
    timeTaken: 0,
    running: false
};

window.incrementComparisons = function() {
    window.stats.comparisons++;
    window.updateStatsLive();
};
window.incrementSwaps = function() {
    window.stats.swaps++;
    window.updateStatsLive();
};
window.startTimer = function() {
    window.stats.startTime = performance.now();
    window.stats.running = true;
};
window.stopTimer = function() {
    window.stats.timeTaken = performance.now() - window.stats.startTime;
    window.stats.running = false;
};
window.resetStats = function() {
    window.stats.comparisons = 0;
    window.stats.swaps = 0;
    window.stats.timeTaken = 0;
    window.stats.startTime = 0;
    window.stats.running = false;
    window.updateStats();
};

window.updateStats = function() {
    document.getElementById("time-taken").innerText = `${window.stats.timeTaken.toFixed(2)} ms`;
    document.getElementById("comparisons-count").innerText = window.stats.comparisons;
    document.getElementById("swaps-count").innerText = window.stats.swaps;
};
window.updateStatsLive = function() {
    if (window.stats.running) {
        document.getElementById("time-taken").innerText = `${(performance.now() - window.stats.startTime).toFixed(2)} ms`;
    } else {
        document.getElementById("time-taken").innerText = `${window.stats.timeTaken.toFixed(2)} ms`;
    }
    document.getElementById("comparisons-count").innerText = window.stats.comparisons;
    document.getElementById("swaps-count").innerText = window.stats.swaps;
};
// --- END STATS HANDLERS ---

const updateStats = () => {
  const timeElement = document.getElementById("time-taken");
  const comparisonsElement = document.getElementById("comparisons-count");
  const swapsElement = document.getElementById("swaps-count");
  if (timeElement) {
      timeElement.innerText = `${window.stats.timeTaken.toFixed(2)} ms`;
  }
  if (comparisonsElement) {
      comparisonsElement.innerText = window.stats.comparisons;
  }
  if (swapsElement) {
      swapsElement.innerText = window.stats.swaps;
  }
};
window.updateStats = updateStats;

const updateStatsLive = () => {
  const timeElement = document.getElementById("time-taken");
  const comparisonsElement = document.getElementById("comparisons-count");
  const swapsElement = document.getElementById("swaps-count");
  if (timeElement) {
      timeElement.innerText = `${(performance.now() - window.stats.startTime).toFixed(2)} ms`;
  }
  if (comparisonsElement) {
      comparisonsElement.innerText = window.stats.comparisons;
  }
  if (swapsElement) {
      swapsElement.innerText = window.stats.swaps;
  }
};
window.updateStatsLive = updateStatsLive;

const resetStats = () => {
  window.stats.comparisons = 0;
  window.stats.swaps = 0;
  window.stats.timeTaken = 0;
  updateStats(); // Initialize display with 0s
};

const start = async () => {
  window.resetStats();
  let algoValue = Number(document.querySelector(".algo-menu").value);
  let speedValue = Number(document.querySelector(".speed-menu").value);
  if (speedValue === 0) speedValue = 1;
  if (algoValue === 0) { alert("No Algorithm Selected"); return; }
  if (speedValue === -1) { await chaosMode(); speedValue = 1; }
  disableControls();
  window.startTimer();
  let algorithm = new sortAlgorithms(speedValue);
  if (algoValue === 1) await algorithm.BubbleSort();
  else if (algoValue === 2) await algorithm.SelectionSort();
  else if (algoValue === 3) await algorithm.InsertionSort();
  else if (algoValue === 4) await algorithm.MergeSort();
  else if (algoValue === 5) await algorithm.QuickSort();
  else if (algoValue === 6) await algorithm.HeapSort();
  else if (algoValue === 7) await algorithm.TimSort();
  else if (algoValue === 8) await algorithm.CountingSort();
  else if (algoValue === 9) await algorithm.RadixSort();
  else if (algoValue === 10) await algorithm.ShellSort();
  window.stopTimer();
  window.updateStats();
  enableControls();
};

const RenderScreen = async (dataType = 'random', customData = null) => {
  await clearScreen();

  let list = [];
  let sizeValue = Number(document.querySelector(".size-menu").value);
  if (sizeValue === 0) sizeValue = 50;
  list = await generateList(sizeValue, dataType);

  const arrayNode = document.querySelector(".array");

  for (const element of list) {
    const node = document.createElement("div");
    node.className = "cell";
    node.setAttribute("value", String(element));
    node.style.height = `${3.8 * element}px`;

    const valueSpan = document.createElement("span");
    valueSpan.innerText = element;
    node.appendChild(valueSpan);

    arrayNode.appendChild(node);
  }
  resetStats(); // Reset stats when a new array is rendered
};

const generateList = async (Length, type) => {
      let list = new Array();
      let lowerBound = 1;
      let upperBound = 100;

      for (let counter = 0; counter < Length; ++counter) {
          let randomNumber = Math.floor(
              Math.random() * (upperBound - lowerBound + 1) + lowerBound
          );
          list.push(parseInt(randomNumber));
      }
      return list; // Always returns random
}


const chaosMode = async () => {
  const arrayNode = document.querySelector(".array");
  const cells = arrayNode.children;
  const originalHeights = [];

  for (let i = 0; i < cells.length; i++) {
    originalHeights.push(cells[i].style.height);
    cells[i].classList.add("chaos");
  }

  for (let i = 0; i < 30; i++) {
    for (let j = 0; j < cells.length; j++) {
      const randomHeight = Math.floor(
        Math.random() * (3.8 * 100 - 3.8 * 1 + 1) + 3.8 * 1
      );
      cells[j].style.height = `${randomHeight}px`;
    }
    await new Promise((resolve) => setTimeout(resolve, 30));
  }

  for (let i = 0; i < cells.length; i++) {
    cells[i].style.height = originalHeights[i];
    cells[i].classList.remove("chaos");
  }
  await new Promise((resolve) => setTimeout(resolve, 300));
};


const RenderArray = async (sorted) => {
  let sizeValue = Number(document.querySelector(".size-menu").value);
  await clearScreen();

  let list = await randomList(sizeValue);
  if (sorted) list.sort((a, b) => a - b);

  const arrayNode = document.querySelector(".array");
  const divnode = document.createElement("div");
  divnode.className = "s-array";

  for (const element of list) {
    const dnode = document.createElement("div");
    dnode.className = "s-cell";
    dnode.innerText = element;
    divnode.appendChild(dnode);
  }
  arrayNode.appendChild(divnode);
};

const randomList = async (Length) => {
  let list = new Array();
  let lowerBound = 1;
  let upperBound = 100;

  for (let counter = 0; counter < Length; ++counter) {
    let randomNumber = Math.floor(
      Math.random() * (upperBound - lowerBound + 1) + lowerBound
    );
    list.push(parseInt(randomNumber));
  }
  return list;
};

const clearScreen = async () => {
  document.querySelector(".array").innerHTML = "";
};

const response = () => {
  let Navbar = document.querySelector(".navbar");
  if (Navbar.className === "navbar") {
    Navbar.className += " responsive";
  } else {
    Navbar.className = "navbar";
  }
};

const disableControls = () => {
  document.querySelector(".algo-menu").disabled = true;
  document.querySelector(".size-menu").disabled = true;
  document.querySelector(".speed-menu").disabled = true;
  document.querySelector(".start").classList.add("disabled");
  document.querySelector("#random").classList.add("disabled");
};

const enableControls = () => {
  document.querySelector(".algo-menu").disabled = false;
  document.querySelector(".size-menu").disabled = false;
  document.querySelector(".speed-menu").disabled = false;
  document.querySelector(".start").classList.remove("disabled");
  document.querySelector("#random").classList.remove("disabled");
};

document.querySelector(".icon").addEventListener("click", response);
document.querySelector(".start").addEventListener("click", start);
document.querySelector(".size-menu").addEventListener("change", () => RenderScreen('random'));
document.querySelector(".algo-menu").addEventListener("change", () => RenderScreen('random'));


// Interactive Title Logic
const jumbleTitle = () => {
    const spans = document.querySelectorAll('.intro-text-container span');
    spans.forEach(span => {
        if (span.classList.contains('word-space')) {
            span.style.width = '0.5em'; // Ensure space element has some width
            return;
        }
        const x = (Math.random() - 0.5) * 800; // Increased range for more scattering
        const y = (Math.random() - 0.5) * 400; // Increased range
        const rot = (Math.random() - 0.5) * 1080; // Increased rotation
        span.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
        span.classList.add('jumbled');
    });
};

const unjumbleTitle = () => {
    const spans = document.querySelectorAll('.intro-text-container span');
    spans.forEach(span => {
        span.style.transform = `translate(0px, 0px) rotate(0deg)`; // Reset to original position
        span.classList.remove('jumbled');
        if (span.classList.contains('word-space')) {
            span.style.width = '1em'; // Restore normal space width
        }
    });
     // Remove the event listener after the first interaction
    document.removeEventListener('mousemove', handleFirstInteraction);
    document.removeEventListener('touchstart', handleFirstInteraction);
};

const handleFirstInteraction = () => {
    if (!hasInteracted) {
        unjumbleTitle();
        hasInteracted = true;
    }
};

// Particle generation for intro section
const createParticles = () => {
    const particlesContainer = document.getElementById('particles-container');
    for (let i = 0; i < 50; i++) { // Generate 50 particles
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 10 + 5; // Size between 5px and 15px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`; // Random delay for animation
        particlesContainer.appendChild(particle);
    }
};


window.onload = () => {
    RenderScreen('random'); // Initial render of the array
    jumbleTitle(); // Jumble the title letters on load
    createParticles(); // Create background particles
    // Add event listeners for first interaction
    document.addEventListener('mousemove', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
};


// --- SOUND HANDLER ---
function playCompareSound() {
    const compareSound = document.getElementById("compare-sound");
    if (compareSound) {
        compareSound.currentTime = 0;
        compareSound.play();
    }
}
function playSwapSound() {
    const swapSound = document.getElementById("swap-sound");
    if (swapSound) {
        swapSound.currentTime = 0;
        swapSound.play();
    }
}
// --- END SOUND HANDLER ---

class Helper {
    constructor(time, list = []) {
        this.time = time > 0 ? parseInt(400 / time) : (time === 0 ? 400 : 0);

        this.list = list;
        this.compareSound = document.getElementById("compare-sound");
        this.swapSound = document.getElementById("swap-sound");

        if (this.compareSound) this.compareSound.load();
        if (this.swapSound) this.swapSound.load();
    }

    mark = async (index) => {
        if (this.list[index]) {
          this.list[index].classList.add("current");
        }
    }

    markComparing = async (index) => {
        if (this.list[index]) {
          this.list[index].classList.add("comparing");
        }
    }

     markSwapping = async (index) => {
        if (this.list[index]) {
          this.list[index].classList.add("swapping");
        }
    }

    markSpl = async (index) => {
        if (this.list[index]) {
          this.list[index].classList.add("min");
        }
    }

    unmark = async (index) => {
        if (this.list[index]) {
          this.list[index].classList.remove("current", "comparing", "swapping", "min", "visited", "done");
        }
    }

    unmarkMany = async (indices) => {
        for (const index of indices) {
            await this.unmark(index);
        }
    }

    pause = async() => {
        return new Promise(resolve => {
            setTimeout(() => {
                if (window.stats.running) {
                    window.updateStatsLive();
                }
                resolve();
            }, this.time);
        });
    }

    compare = async (index1, index2) => {
        await this.markComparing(index1);
        await this.markComparing(index2);
        await this.pause();
        playCompareSound();
        window.incrementComparisons();
        let value1 = Number(this.list[index1].getAttribute("value"));
        let value2 = Number(this.list[index2].getAttribute("value"));
        await this.unmark(index1);
        await this.unmark(index2);
        return value1 > value2;
    }
    compareLess = async (index1, index2) => {
        await this.markComparing(index1);
        await this.markComparing(index2);
        await this.pause();
        playCompareSound();
        window.incrementComparisons();
        let value1 = Number(this.list[index1].getAttribute("value"));
        let value2 = Number(this.list[index2].getAttribute("value"));
        await this.unmark(index1);
        await this.unmark(index2);
        return value1 < value2;
    }
    compareLessEqual = async (index1, index2) => {
        await this.markComparing(index1);
        await this.markComparing(index2);
        await this.pause();
        playCompareSound();
        window.incrementComparisons();
        let value1 = Number(this.list[index1].getAttribute("value"));
        let value2 = Number(this.list[index2].getAttribute("value"));
        await this.unmark(index1);
        await this.unmark(index2);
        return value1 <= value2;
    }

    swap = async (index1, index2) => {
        await this.markSwapping(index1);
        await this.markSwapping(index2);
        await this.pause();
        playSwapSound();
        window.incrementSwaps();
        let value1 = this.list[index1].getAttribute("value");
        let value2 = this.list[index2].getAttribute("value");
        this.list[index1].setAttribute("value", value2);
        this.list[index1].style.height = `${3.8*value2}px`;
        const span1 = this.list[index1].querySelector('span');
        if(span1) span1.innerText = value2;
        this.list[index2].setAttribute("value", value1);
        this.list[index2].style.height = `${3.8*value1}px`;
        const span2 = this.list[index2].querySelector('span');
        if(span2) span2.innerText = value1;
        await this.unmark(index1);
        await this.unmark(index2);
    }

    setValue = async (index, value, playSwap = false) => {
        await this.pause();
        if (playSwap) playSwapSound();
        this.list[index].setAttribute("value", value);
        this.list[index].style.height = `${3.8 * value}px`;
        const span = this.list[index].querySelector('span');
        if (span) span.innerText = value;
        window.updateStatsLive(); // LIVE update
    }
}

class sortAlgorithms {
    constructor(time) {
        this.list = document.querySelectorAll(".cell");
        this.size = this.list.length;
        this.time = time;
        this.help = new Helper(this.time, this.list);
    }

    // Helper to force sync DOM with values and mark as done
    finalizeSortedArray = (list) => {
        let arr = Array.from(list).map(cell => Number(cell.getAttribute('value')));
        for (let i = 0; i < list.length; i++) {
            list[i].setAttribute('value', arr[i]);
            list[i].style.height = `${3.8 * arr[i]}px`;
            let span = list[i].querySelector('span');
            if (span) span.innerText = arr[i];
            list[i].classList.add('done');
        }
    }

    BubbleSort = async () => {
        for(let i = 0 ; i < this.size - 1 ; ++i) {
            for(let j = 0 ; j < this.size - i - 1 ; ++j) {
                if(await this.help.compare(j, j+1)) {
                    await this.help.swap(j, j+1);
                }
            }
            this.list[this.size - i - 1].classList.add("done");
        }
        this.list[0].classList.add("done"); // Mark the first element as done after the last pass
        this.finalizeSortedArray(this.list);
    }

    InsertionSort = async () => {
        for(let i = 1 ; i < this.size ; ++i) {
            let j = i;
            let tempValue = Number(this.list[i].getAttribute("value"));
            let tempSpanText = this.list[i].querySelector('span').innerText;
            await this.help.markSpl(i);
            await this.help.pause();
            while(j > 0) {
                // Use compare to play sound and count comparisons
                let prevValue = Number(this.list[j-1].getAttribute("value"));
                window.incrementComparisons();
                await this.help.markComparing(j-1);
                await this.help.markComparing(j);
                await this.help.pause();
                if(prevValue > tempValue) {
                    // Use setValue to play sound and update DOM
                    await this.help.setValue(j, prevValue);
                    window.incrementSwaps();
                    await this.help.unmark(j);
                    await this.help.unmark(j-1);
                    j -= 1;
                } else {
                    await this.help.unmark(j);
                    await this.help.unmark(j-1);
                    break;
                }
            }
            await this.help.setValue(j, tempValue);
            this.list[j].querySelector('span').innerText = tempSpanText;
            await this.help.unmark(j);
        }
        for(let counter = 0 ; counter < this.size ; ++counter) {
            this.list[counter].classList.add("done");
        }
        this.finalizeSortedArray(this.list);
    }

    SelectionSort = async () => {
        for(let i = 0 ; i < this.size ; ++i) {
            let minIndex = i;
            await this.help.markSpl(minIndex);
            for(let j = i + 1 ; j < this.size ; ++j) {
                if(await this.help.compare(minIndex, j)) {
                    await this.help.unmark(minIndex);
                    minIndex = j;
                    await this.help.markSpl(minIndex);
                }
                await this.help.unmark(j);
            }
            if (minIndex !== i) {
              await this.help.swap(minIndex, i);
            }
            this.list[i].classList.add("done");
            await this.help.unmark(minIndex);
        }
        this.finalizeSortedArray(this.list);
    }

    MergeSort = async () => {
        await this.MergeDivider(0, this.size - 1);
        for(let counter = 0 ; counter < this.size ; ++counter) {
            this.list[counter].classList.add("done");
        }
        this.finalizeSortedArray(this.list);
    }

    MergeDivider = async (start, end) => {
        if(start < end) {
            let mid = start + Math.floor((end - start)/2);
            await this.MergeDivider(start, mid);
            await this.MergeDivider(mid+1, end);
            await this.Merge(start, mid, end);
        }
    }

    Merge = async (start, mid, end) => {
        let newList = new Array();
        let frontcounter = start;
        let midcounter = mid + 1;
        let mergeIndices = [];
        for(let c = start ; c <= end ; ++c) {
            mergeIndices.push(c);
            await this.help.markComparing(c);
        }
        await this.help.pause();
        while(frontcounter <= mid && midcounter <= end) {
            window.incrementComparisons();
            let value1 = Number(this.list[frontcounter].getAttribute("value"));
            let value2 = Number(this.list[midcounter].getAttribute("value"));
            if(value1 <= value2) {
                newList.push(value1);
                frontcounter++;
            } else {
                newList.push(value2);
                midcounter++;
            }
        }
        while(frontcounter <= mid) {
            newList.push(Number(this.list[frontcounter].getAttribute("value")));
            frontcounter++;
        }
        while(midcounter <= end) {
            newList.push(Number(this.list[midcounter].getAttribute("value")));
            midcounter++;
        }
        for(let c = start, point = 0 ; c <= end ; ++c, ++point) {
            window.incrementSwaps();
            await this.help.markSwapping(c);
            await this.help.setValue(c, newList[point]);
            await this.help.pause();
            await this.help.unmark(c);
        }
        await this.help.unmarkMany(mergeIndices);
    }

    QuickSort = async () => {
        await this.QuickDivider(0, this.size-1);
        for(let c = 0 ; c < this.size ; ++c) {
            this.list[c].classList.add("done");
        }
        this.finalizeSortedArray(this.list);
    }

    QuickDivider = async (start, end) => {
        if(start < end) {
            let pivotIndex = await this.Partition(start, end);
            await this.QuickDivider(start, pivotIndex-1);
            await this.QuickDivider(pivotIndex+1, end);
        } else if (start === end) {
             if (this.list[start]) this.list[start].classList.add("done");
        }
    }

    Partition = async (start, end) => {
        let pivotValue = Number(this.list[end].getAttribute("value"));
        let i = start - 1;
        await this.help.markSpl(end);
        for(let j = start ; j < end ; ++j) {
            window.incrementComparisons();
            if(await this.help.compareLessEqual(j, end)) {
                i++;
                window.incrementSwaps();
                await this.help.swap(i, j);
            }
            await this.help.unmark(j);
        }
        window.incrementSwaps();
        await this.help.swap(i + 1, end);
        await this.help.unmark(end);
        return i + 1;
    }

    HeapSort = async () => {
        // Build max heap
        for (let i = Math.floor(this.size / 2) - 1; i >= 0; i--) {
            await this.heapify(this.size, i);
        }

        // One by one extract elements from heap
        for (let i = this.size - 1; i > 0; i--) {
            await this.help.swap(0, i); // Move current root to end
            this.list[i].classList.add("done"); // Mark as sorted

            await this.heapify(i, 0); // Call max heapify on the reduced heap
        }
        this.list[0].classList.add("done"); // Mark the last element (root) as sorted
        this.finalizeSortedArray(this.list);
    }

    heapify = async (n, i) => {
        let largest = i;
        let l = 2 * i + 1;
        let r = 2 * i + 2;
        if (l < n) {
            if(await this.help.compareLess(largest, l)) {
                largest = l;
            }
        }
        if (r < n) {
            if(await this.help.compareLess(largest, r)) {
                largest = r;
            }
        }
        if (largest != i) {
            await this.help.swap(i, largest);
            await this.heapify(n, largest);
        }
    }

    TimSort = async () => {
        const RUN = 32;
        for (let i = 0; i < this.size; i += RUN) {
            await this.insertionSortRun(i, Math.min((i + RUN - 1), (this.size - 1)));
        }
        for (let size = RUN; size < this.size; size = 2 * size) {
            for (let left = 0; left < this.size; left += 2 * size) {
                let mid = left + size - 1;
                let right = Math.min((left + 2 * size - 1), (this.size - 1));
                if (mid < right) {
                    await this.TimMerge(left, mid, right);
                }
            }
        }
        for(let counter = 0 ; counter < this.size ; ++counter) {
            this.list[counter].classList.add("done");
        }
        this.finalizeSortedArray(this.list);
    }

    insertionSortRun = async (left, right) => {
        for (let i = left + 1; i <= right; i++) {
            let tempValue = Number(this.list[i].getAttribute("value"));
            let tempSpanText = this.list[i].querySelector('span').innerText;
            let j = i;
            await this.help.markSpl(i);
            await this.help.pause();
            while (j > left) {
                if(await this.help.compare(j-1, j)) {
                    await this.help.setValue(j, Number(this.list[j-1].getAttribute("value")));
                    await this.help.unmark(j);
                    await this.help.unmark(j-1);
                    j--;
                } else {
                    await this.help.unmark(j);
                    await this.help.unmark(j-1);
                    break;
                }
            }
            await this.help.setValue(j, tempValue);
            this.list[j].querySelector('span').innerText = tempSpanText;
            await this.help.unmark(j);
        }
         for(let k = left; k <= right; k++){
             await this.help.unmark(k);
         }
    }

    TimMerge = async (left, mid, right) => {
        let len1 = mid - left + 1;
        let len2 = right - mid;
        let leftArr = new Array(len1);
        let rightArr = new Array(len2);
        let mergeIndices = [];
        for(let i = left; i <= right; i++) {
            mergeIndices.push(i);
            await this.help.markComparing(i);
        }
        await this.help.pause();
        for (let i = 0; i < len1; i++) {
            leftArr[i] = Number(this.list[left + i].getAttribute("value"));
        }
        for (let i = 0; i < len2; i++) {
            rightArr[i] = Number(this.list[mid + 1 + i].getAttribute("value"));
        }
        let i = 0, j = 0, k = left;
        while (i < len1 && j < len2) {
            window.incrementComparisons();
            if (leftArr[i] <= rightArr[j]) {
                window.incrementSwaps();
                await this.help.setValue(k, leftArr[i]);
                i++;
            } else {
                window.incrementSwaps();
                await this.help.setValue(k, rightArr[j]);
                j++;
            }
            k++;
        }
        while (i < len1) {
            window.incrementSwaps();
            await this.help.setValue(k, leftArr[i]);
            i++;
            k++;
        }
        while (j < len2) {
            window.incrementSwaps();
            await this.help.setValue(k, rightArr[j]);
            j++;
            k++;
        }
        await this.help.unmarkMany(mergeIndices);
    }


    CountingSort = async () => {
        const max_value = 100;
        const count = Array(max_value + 1).fill(0);
        const output = Array(this.size).fill(0);
        for (let i = 0; i < this.size; i++) {
            await this.help.markComparing(i);
            await this.help.pause();
            playCompareSound();
            count[Number(this.list[i].getAttribute("value"))]++;
            window.incrementComparisons();
            await this.help.unmark(i);
        }
        for (let i = 1; i <= max_value; i++) {
            count[i] += count[i - 1];
        }
        for (let i = this.size - 1; i >= 0; i--) {
            let value = Number(this.list[i].getAttribute("value"));
            let position = count[value] - 1;
            await this.help.markSwapping(i);
            await this.help.markSwapping(position);
            await this.help.pause();
            playSwapSound();
            output[position] = value;
            window.incrementSwaps();
            count[value]--;
            await this.help.unmark(i);
            await this.help.unmark(position);
        }
        for(let i = 0; i < this.size; i++) {
            await this.help.setValue(i, output[i], true);
            this.list[i].classList.add("done");
        }
        this.finalizeSortedArray(this.list);
    }

    RadixSort = async () => {
        const max_value = 100;
        for (let exp = 1; Math.floor(max_value / exp) > 0; exp *= 10) {
            await this.countSortByDigit(exp);
        }
        for(let i = 0; i < this.size; i++) {
            this.list[i].classList.add("done");
        }
        this.finalizeSortedArray(this.list);
    }
    countSortByDigit = async (exp) => {
        const output = Array(this.size).fill(0);
        const count = Array(10).fill(0);
        for (let i = 0; i < this.size; i++) {
            let value = Number(this.list[i].getAttribute("value"));
            let digit = Math.floor(value / exp) % 10;
            await this.help.markComparing(i);
            await this.help.pause();
            playCompareSound();
            count[digit]++;
            window.incrementComparisons();
            await this.help.unmark(i);
        }
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }
        for (let i = this.size - 1; i >= 0; i--) {
            let value = Number(this.list[i].getAttribute("value"));
            let digit = Math.floor(value / exp) % 10;
            let position = count[digit] - 1;
            await this.help.markSwapping(i);
            await this.help.markSwapping(position);
            await this.help.pause();
            playSwapSound();
            output[position] = value;
            window.incrementSwaps();
            count[digit]--;
            await this.help.unmark(i);
            await this.help.unmark(position);
        }
        for(let i = 0; i < this.size; i++) {
            await this.help.setValue(i, output[i], true);
        }
    }


    ShellSort = async () => {
        for (let gap = Math.floor(this.size / 2); gap > 0; gap = Math.floor(gap / 2)) {
            for (let i = gap; i < this.size; i += 1) {
                let tempValue = Number(this.list[i].getAttribute("value"));
                let tempSpanText = this.list[i].querySelector('span').innerText;
                let j = i;
                await this.help.markSpl(i);
                await this.help.pause();
                while (j >= gap) {
                     await this.help.markComparing(j);
                     await this.help.markComparing(j - gap);
                     await this.help.pause();
                     let jMinusGapValue = Number(this.list[j - gap].getAttribute("value"));
                     window.incrementComparisons();
                     if (jMinusGapValue > tempValue) {
                         await this.help.setValue(j, jMinusGapValue);
                         window.incrementSwaps();
                         await this.help.unmark(j);
                         await this.help.unmark(j - gap);
                         j -= gap;
                     } else {
                         await this.help.unmark(j);
                         await this.help.unmark(j - gap);
                         break;
                     }
                }
                 await this.help.setValue(j, tempValue);
                 this.list[j].querySelector('span').innerText = tempSpanText;
                 await this.help.unmark(i);
                 await this.help.unmark(j);
            }
        }
         for(let i = 0; i < this.size; i++) {
             this.list[i].classList.add("done");
         }
         this.finalizeSortedArray(this.list);
    }
}

let hasInteracted = false;
