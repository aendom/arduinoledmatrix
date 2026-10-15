'use strict';

// LED Matrix Generator by AENDOM (aendom@gmail.com)
// Draw an 8x8 character and get its Arduino byte array for the LedControl
// library (MAX7219). Rows go top to bottom; the leftmost LED is the most
// significant bit, which is what LedControl's setRow() expects.

const SIZE = 8;
const leds = new Array(SIZE * SIZE).fill(false);

const app = document.querySelector('.app');
const grid = document.getElementById('grid');
const code = document.getElementById('code');

// Build the grid: one toggle button per LED.
const cells = leds.map((_, i) => {
  const cell = document.createElement('button');
  cell.type = 'button';
  cell.className = 'led';
  cell.dataset.index = i;
  cell.setAttribute('aria-label', `Row ${Math.floor(i / SIZE) + 1}, column ${(i % SIZE) + 1}`);
  grid.append(cell);
  return cell;
});

// One "B01100110" value per row.
function rows() {
  return Array.from({ length: SIZE }, (_, r) =>
    'B' + leds.slice(r * SIZE, (r + 1) * SIZE).map(on => (on ? 1 : 0)).join(''));
}

function render() {
  cells.forEach((cell, i) => cell.setAttribute('aria-pressed', leds[i]));
  code.textContent = rows().join(',\n');
}

function setLed(index, on) {
  if (leds[index] === on) return;
  leds[index] = on;
  render();
}

const ledAt = (x, y) => document.elementFromPoint(x, y)?.closest('.led');

// Mouse/touch: click toggles an LED; dragging paints every LED you pass
// over with the same state (on or off) as the first one.
let painting = null;
let pointerHandled = false; // skip the click event that follows a pointer press

grid.addEventListener('pointerdown', e => {
  const cell = e.target.closest('.led');
  if (!cell) return;
  e.preventDefault();
  pointerHandled = true;
  painting = !leds[cell.dataset.index];
  setLed(+cell.dataset.index, painting);
});

grid.addEventListener('pointermove', e => {
  const cell = painting !== null && ledAt(e.clientX, e.clientY);
  if (cell) setLed(+cell.dataset.index, painting);
});

['pointerup', 'pointercancel'].forEach(type =>
  window.addEventListener(type, () => {
    painting = null;
    setTimeout(() => { pointerHandled = false; }); // after any click event has fired
  }));

// Keyboard: Enter/Space on a focused LED toggles it. Clicks that come from a
// mouse or touch press were already handled on pointerdown.
grid.addEventListener('click', e => {
  if (pointerHandled) { pointerHandled = false; return; }
  const cell = e.target.closest('.led');
  if (cell) setLed(+cell.dataset.index, !leds[cell.dataset.index]);
});

// Briefly show feedback on a button, then restore its label.
function flash(button, text) {
  const label = button.textContent;
  button.textContent = text;
  setTimeout(() => { button.textContent = label; }, 1500);
}

// Copy a ready-to-paste Arduino array.
document.getElementById('copy').addEventListener('click', async e => {
  const button = e.currentTarget;
  const snippet = `byte character[${SIZE}] = {\n  ${rows().join(',\n  ')}\n};\n`;
  try {
    await navigator.clipboard.writeText(snippet);
    flash(button, 'Copied!');
  } catch {
    flash(button, 'Copy failed');
  }
});

document.getElementById('clear').addEventListener('click', () => {
  leds.fill(false);
  render();
});

// Info button opens/closes the About overlay.
const infoToggle = document.getElementById('info-toggle');
infoToggle.addEventListener('click', () => {
  infoToggle.setAttribute('aria-expanded', app.classList.toggle('show-about'));
});

render();
