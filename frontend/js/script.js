document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. INSERT PAGE LOGIC (insert.html)
  // ==========================================
  const textInput = document.getElementById('text-input');
  const patternInput = document.getElementById('pattern-input');
  const textBlocks = document.getElementById('text-blocks');
  const patternBlocks = document.getElementById('pattern-blocks');
  const startBtn = document.querySelector('.start-btn');

  // ONLY run this if we are on the insert page
  if (textInput && patternInput) {
    // Handle Enter key on Text input
    textInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (textInput.value.trim() !== '') {
          patternInput.focus();
        }
      }
    });

    // Handle Enter key on Pattern input
    patternInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (patternInput.value.trim() !== '' && textInput.value.trim() !== '') {
          // Save the strings to local storage so the next pages can use them
          localStorage.setItem('kmpText', textInput.value.trim());
          localStorage.setItem('kmpPattern', patternInput.value.trim());

          // Trigger the button click to go to preprocessing.html
          if (startBtn) startBtn.click();
        }
      }
    });

    // Start Button Click Fallback (in case they click instead of pressing
    // Enter)
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (patternInput.value.trim() !== '' && textInput.value.trim() !== '') {
          localStorage.setItem('kmpText', textInput.value.trim());
          localStorage.setItem('kmpPattern', patternInput.value.trim());
        }
      });
    }

    // --- Event Listeners for Input Visuals ---
    textInput.addEventListener(
        'input',
        () => updateBlocks(textInput, textBlocks, 'Click to type text...'));
    textInput.addEventListener(
        'focus',
        () => updateBlocks(textInput, textBlocks, 'Click to type text...'));
    textInput.addEventListener(
        'blur',
        () => updateBlocks(textInput, textBlocks, 'Click to type text...'));

    patternInput.addEventListener(
        'input',
        () => updateBlocks(
            patternInput, patternBlocks, 'Click to type pattern...'));
    patternInput.addEventListener(
        'focus',
        () => updateBlocks(
            patternInput, patternBlocks, 'Click to type pattern...'));
    patternInput.addEventListener(
        'blur',
        () => updateBlocks(
            patternInput, patternBlocks, 'Click to type pattern...'));
  }

  // Function to generate the visual blocks and cursor (for insert.html)
  function updateBlocks(inputElement, blockContainer, placeholderText) {
    blockContainer.innerHTML = '';
    const value = inputElement.value;
    const isFocused = document.activeElement === inputElement;

    if (value.length === 0 && !isFocused) {
      blockContainer.innerHTML =
          `<span class="placeholder-text">${placeholderText}</span>`;
      return;
    }

    for (let i = 0; i < value.length; i++) {
      const block = document.createElement('div');
      block.className = 'char-block';
      block.textContent = value[i];
      blockContainer.appendChild(block);
    }

    if (isFocused) {
      const cursor = document.createElement('div');
      cursor.className = 'cursor';
      blockContainer.appendChild(cursor);
    }
  }


  // ==========================================
  // 2. PREPROCESSING PAGE LOGIC (preprocessing.html)
  // ==========================================
  const prePatternDisplay = document.getElementById('pattern-display');
  const prePiDisplay = document.getElementById('pi-display');

  // ONLY run this if we are on the preprocessing page
  if (prePatternDisplay && prePiDisplay) {
    const pattern = localStorage.getItem('kmpPattern');

    if (pattern) {
      // 1. Calculate the Pi Array using your backend function
      const piArray = computePiArray(pattern);

      // 2. Clear the loading placeholders
      prePatternDisplay.innerHTML = '';
      prePiDisplay.innerHTML = '';

      // 3. Create the blocks for the Pattern
      for (let i = 0; i < pattern.length; i++) {
        const block = document.createElement('div');
        block.className = 'char-block';
        block.textContent = pattern[i];
        prePatternDisplay.appendChild(block);
      }

      // 4. Create the blocks for the Pi Array with a cool animation
      for (let i = 0; i < piArray.length; i++) {
        const block = document.createElement('div');
        block.className = 'char-block';
        block.textContent = piArray[i];

        // This makes the Pi numbers appear one-by-one!
        setTimeout(() => {
          prePiDisplay.appendChild(block);
        }, i * 400);  // 400ms delay between each block
      }
    }
  }
});

// ==========================================
// 3. MAIN PROCESS PAGE LOGIC (mainprocess.html)
// ==========================================
const mainTextDisplay = document.getElementById('text-display');
const mainPatternDisplay = document.getElementById('pattern-display');
const mainPiDisplay = document.getElementById('pi-display');
const matchOutput = document.getElementById('match-output');
const startKmpBtn = document.getElementById('start-kmp-btn');

// ONLY run this if we are on the main process page
if (mainTextDisplay && mainPatternDisplay && startKmpBtn) {
  const text = localStorage.getItem('kmpText');
  const pattern = localStorage.getItem('kmpPattern');

  if (text && pattern) {
    // 1. Calculate Pi Array
    const piArray = computePiArray(pattern);

    // 2. Helper function to quickly create blocks
    function buildBlocks(container, data) {
      container.innerHTML = '';
      for (let i = 0; i < data.length; i++) {
        const block = document.createElement('div');
        block.className = 'char-block';
        block.textContent = data[i];
        container.appendChild(block);
      }
    }

    // 3. Populate all rows initially
    buildBlocks(mainPiDisplay, piArray);
    buildBlocks(mainTextDisplay, text);
    buildBlocks(mainPatternDisplay, pattern);

    // Reset pointers to start
    movePointer('text-pointer', 0);
    movePointer('pattern-pointer', 0);

    // Helper function to pause the code (for animation)
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 4. The Visual KMP Animation Logic
    startKmpBtn.addEventListener('click', async () => {
      // Disable button so user doesn't click it multiple times
      startKmpBtn.disabled = true;
      startKmpBtn.style.opacity = '0.5';
      matchOutput.innerHTML =
          `<span class="placeholder-text" style="color: #3A6B25;">Searching... 🐇</span>`;

      let n = text.length;
      let m = pattern.length;
      let i = 0;
      let j = 0;
      let matches = [];

      // The KMP Loop, but animated!
      while (i < n) {
        // Move the visual pointers to the current i and j
        movePointer('text-pointer', i);
        movePointer('pattern-pointer', j);

        // Pause for 800 milliseconds so the user can see the comparison
        await sleep(800);

        if (pattern[j] === text[i]) {
          // Characters match! Move both pointers forward.
          j++;
          i++;
        }

        if (j === m) {
          // Found a full match!
          matches.push(i - j);
          matchOutput.innerHTML = `Match found at index ${i - j}! 🎉`;

          // Pause longer to celebrate the match
          await sleep(1500);

          j = piArray[j - 1];
        } else if (i < n && pattern[j] !== text[i]) {
          // Mismatch
          if (j !== 0) {
            // Fallback using the Pi array (the triangle jumps back)
            j = piArray[j - 1];
          } else {
            // No fallback left, move the text pointer (the rabbit moves
            // forward)
            i++;
          }
        }
      }

      // Final result
      if (matches.length === 0) {
        matchOutput.innerHTML = `No matches found.`;
      } else {
        matchOutput.innerHTML = `Done! Total matches found: ${
            matches.length} (at indices ${matches.join(', ')})`;
      }

      startKmpBtn.textContent = 'Restart';
      startKmpBtn.style.opacity = '1';
      startKmpBtn.disabled = false;

      // Let the user restart if they click again
      startKmpBtn.addEventListener(
          'click', () => location.reload(), {once: true});
    });
  }
}


// ==========================================
// 3. KMP BACKEND LOGIC & UTILS
// ==========================================

// Calculates the Pi (LPS) array for KMP
function computePiArray(pattern) {
  const m = pattern.length;
  let pi = new Array(m).fill(0);
  let len = 0;
  let i = 1;

  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      pi[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = pi[len - 1];
      } else {
        pi[i] = 0;
        i++;
      }
    }
  }
  return pi;
}

// Performs the KMP Search and returns an array of match indices
function kmpSearch(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  const pi = computePiArray(pattern);
  let matches = [];

  let i = 0;
  let j = 0;

  while (i < n) {
    if (pattern[j] === text[i]) {
      j++;
      i++;
    }
    if (j === m) {
      matches.push(i - j);
      j = pi[j - 1];
    } else if (i < n && pattern[j] !== text[i]) {
      if (j !== 0) {
        j = pi[j - 1];
      } else {
        i++;
      }
    }
  }
  return matches;
}

// Function to move the visual pointers (rabbit/triangle)
// Function to move the visual pointers (rabbit/triangle)
function movePointer(pointerId, index) {
  // Block width (35px) + gap (5px) = 40px step per index
  const blockSize = 40;

  // Container padding (8px) + tweak to center the 30px image over 35px block
  const offset = 10;

  const newLeft = offset + (index * blockSize);

  const pointerElement = document.getElementById(pointerId);
  if (pointerElement) {
    pointerElement.style.left = `${newLeft}px`;
  }
}