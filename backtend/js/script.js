document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.getElementById('text-input');
  const patternInput = document.getElementById('pattern-input');
  const textBlocks = document.getElementById('text-blocks');
  const patternBlocks = document.getElementById('pattern-blocks');
  const startBtn = document.querySelector('.start-btn');

  if (textInput && patternInput) {
    textInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (textInput.value.trim() !== '') {
          patternInput.focus();
        }
      }
    });

    patternInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (patternInput.value.trim() !== '' && textInput.value.trim() !== '') {
          localStorage.setItem('kmpText', textInput.value.trim());
          localStorage.setItem('kmpPattern', patternInput.value.trim());
          if (startBtn) startBtn.click();
        }
      }
    });

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (patternInput.value.trim() !== '' && textInput.value.trim() !== '') {
          localStorage.setItem('kmpText', textInput.value.trim());
          localStorage.setItem('kmpPattern', patternInput.value.trim());
        }
      });
    }

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

  const prePatternDisplay = document.getElementById('pattern-display');
  const prePiDisplay = document.getElementById('pi-display');

  // Create a check to see if we are on the Main Process page
  const isMainProcessPage = document.getElementById('text-display');

  // ONLY run this if we are on the preprocessing page (meaning text-display
  // does NOT exist)
  if (prePatternDisplay && prePiDisplay && !isMainProcessPage) {
    const pattern = localStorage.getItem('kmpPattern');

    if (pattern) {
      prePatternDisplay.innerHTML = '';
      prePiDisplay.innerHTML = '';

      for (let i = 0; i < pattern.length; i++) {
        const block = document.createElement('div');
        block.className = 'char-block';
        block.textContent = pattern[i];
        prePatternDisplay.appendChild(block);
      }

      const piBlocks = [];
      for (let i = 0; i < pattern.length; i++) {
        const block = document.createElement('div');
        block.className = 'char-block';
        block.textContent = '?';
        prePiDisplay.appendChild(block);
        piBlocks.push(block);
      }

      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      async function animatePiArray() {
        let m = pattern.length;
        let pi = new Array(m).fill(0);
        let len = 0;
        let i = 1;

        piBlocks[0].textContent = '0';
        piBlocks[0].classList.add('highlight-pi');
        await sleep(600);

        while (i < m) {
          clearAllHighlights('pattern-display');
          setHighlight('pattern-display', i, 'active');
          setHighlight('pattern-display', len, 'active');
          await sleep(600);

          if (pattern[i] === pattern[len]) {
            setHighlight('pattern-display', i, 'match');
            setHighlight('pattern-display', len, 'match');
            len++;
            pi[i] = len;
            piBlocks[i].textContent = len;
            piBlocks[i].classList.add('highlight-pi');
            i++;
            await sleep(600);
          } else {
            setHighlight('pattern-display', i, 'mismatch');
            setHighlight('pattern-display', len, 'mismatch');
            await sleep(600);

            if (len !== 0) {
              len = pi[len - 1];
            } else {
              pi[i] = 0;
              piBlocks[i].textContent = '0';
              piBlocks[i].classList.add('highlight-pi');
              i++;
            }
          }
        }
        clearAllHighlights('pattern-display');
      }

      setTimeout(animatePiArray, 500);
    }
  }

  const mainTextDisplay = document.getElementById('text-display');
  const mainPatternDisplay = document.getElementById('pattern-display');
  const mainPiDisplay = document.getElementById('pi-display');
  const matchOutput = document.getElementById('match-output');
  const startKmpBtn = document.getElementById('start-kmp-btn');

  if (mainTextDisplay && mainPatternDisplay && startKmpBtn) {
    const text = localStorage.getItem('kmpText');
    const pattern = localStorage.getItem('kmpPattern');

    if (text && pattern) {
      const piArray = computePiArray(pattern);

      function buildBlocks(container, data) {
        container.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
          const block = document.createElement('div');
          block.className = 'char-block';
          block.textContent = data[i];
          container.appendChild(block);
        }
      }

      buildBlocks(mainPiDisplay, piArray);
      buildBlocks(mainTextDisplay, text);
      buildBlocks(mainPatternDisplay, pattern);

      const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      startKmpBtn.addEventListener('click', async () => {
        startKmpBtn.disabled = true;
        matchOutput.innerHTML =
            `<span class="placeholder-text" style="color: #3A6B25;">Searching...</span>`;

        let n = text.length;
        let m = pattern.length;
        let i = 0;
        let j = 0;
        let matches = [];

        while (i < n) {
          clearAllHighlights('text-display');
          clearAllHighlights('pattern-display');

          setHighlight('text-display', i, 'active');
          setHighlight('pattern-display', j, 'active');
          await sleep(600);

          if (pattern[j] === text[i]) {
            setHighlight('text-display', i, 'match');
            setHighlight('pattern-display', j, 'match');
            await sleep(400);
            j++;
            i++;
          } else {
            setHighlight('text-display', i, 'mismatch');
            setHighlight('pattern-display', j, 'mismatch');
            await sleep(400);
          }

          if (j === m) {
            matches.push(i - j);
            matchOutput.innerHTML = `Match found at index ${i - j}! 🎉`;
            await sleep(1500);
            j = piArray[j - 1];
          } else if (i < n && pattern[j] !== text[i]) {
            if (j !== 0) {
              j = piArray[j - 1];
            } else {
              i++;
            }
          }
        }

        clearAllHighlights('text-display');
        clearAllHighlights('pattern-display');

        // Final Output with specific Indices
        if (matches.length === 0) {
          matchOutput.innerHTML = `No matches found.`;
        } else {
          matchOutput.innerHTML =
              `Done! Match is found at index: ${matches.join(', ')} 🎉`;
        }

        startKmpBtn.textContent = 'Restart';
        startKmpBtn.disabled = false;
        startKmpBtn.addEventListener(
            'click', () => location.reload(), {once: true});
      });
    }
  }
});


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

function setHighlight(containerId, index, type) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const blocks = container.getElementsByClassName('char-block');
  if (blocks[index]) {
    blocks[index].classList.remove(
        'highlight-active', 'highlight-match', 'highlight-mismatch',
        'highlight-pi');
    if (type) {
      blocks[index].classList.add(`highlight-${type}`);
    }
  }
}

function clearAllHighlights(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const blocks = container.getElementsByClassName('char-block');
  for (let block of blocks) {
    block.classList.remove(
        'highlight-active', 'highlight-match', 'highlight-mismatch',
        'highlight-pi');
  }
}