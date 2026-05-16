document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.getElementById('text-input');
  const patternInput = document.getElementById('pattern-input');
  const textBlocks = document.getElementById('text-blocks');
  const patternBlocks = document.getElementById('pattern-blocks');

  // Function to generate the visual blocks and cursor
  function updateBlocks(inputElement, blockContainer, placeholderText) {
    // 1. Clear current blocks
    blockContainer.innerHTML = '';

    const value = inputElement.value;
    const isFocused = document.activeElement === inputElement;

    // 2. If empty and NOT clicked on, show placeholder
    if (value.length === 0 && !isFocused) {
      blockContainer.innerHTML =
          `<span class="placeholder-text">${placeholderText}</span>`;
      return;
    }

    // 3. Create a block for each character
    for (let i = 0; i < value.length; i++) {
      const block = document.createElement('div');
      block.className = 'char-block';
      block.textContent = value[i];
      blockContainer.appendChild(block);
    }

    // 4. If clicked on (focused), add the blinking cursor at the end
    if (isFocused) {
      const cursor = document.createElement('div');
      cursor.className = 'cursor';
      blockContainer.appendChild(cursor);
    }
  }

  // --- Event Listeners for Text Input ---
  textInput.addEventListener(
      'input',
      () => updateBlocks(textInput, textBlocks, 'Click to type text...'));
  textInput.addEventListener(
      'focus',
      () => updateBlocks(textInput, textBlocks, 'Click to type text...'));
  textInput.addEventListener(
      'blur',
      () => updateBlocks(textInput, textBlocks, 'Click to type text...'));

  // --- Event Listeners for Pattern Input ---
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
});

function movePointer(pointerId, index) {
  const blockSize = 45;
  const offset = 120;
  const newLeft = offset + (index * blockSize);
  document.getElementById(pointerId).style.left = `${newLeft}px`;
}