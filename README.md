# Arduino LED Matrix Generator

A small web tool to design custom 8×8 characters for an LED matrix and get the matching Arduino array code for the [LedControl](https://github.com/wayoda/LedControl) library. Built for a MAX7219 LED matrix and an Arduino Uno.

**[Try it live](https://aendom.github.io/arduinoledmatrix/)**

![Clicking LEDs to draw a heart while the Arduino code updates](images/demo.gif)

## How it works

1. Click any of the 64 cells to turn that LED on. Click it again to turn it off.
2. The panel on the right updates with one binary value per row (`B01100110`, …), ready to paste into an Arduino sketch.
3. Click the **i** button for a short description of the project.

![A finished heart with its eight binary rows](images/heart.png)

## Using the output in Arduino

Paste the eight values into a `byte` array and send each row to the matrix with `setRow`:

```cpp
#include <LedControl.h>

// DIN, CLK, CS pins and number of MAX7219 devices
LedControl lc = LedControl(12, 11, 10, 1);

byte heart[8] = {
  B01100110,
  B11111111,
  B11111111,
  B11111111,
  B01111110,
  B00111100,
  B00011000,
  B00000000
};

void setup() {
  lc.shutdown(0, false);   // wake up the MAX7219
  lc.setIntensity(0, 8);   // brightness 0–15
  lc.clearDisplay(0);
  for (int row = 0; row < 8; row++) {
    lc.setRow(0, row, heart[row]);
  }
}

void loop() {}
```

Adjust the pin numbers to match your wiring.

## Running locally

No build step or install needed. Download the repository and open `index.html` in a browser.

## Built with

- HTML, CSS and JavaScript
- jQuery 1.7
- Roboto (Google Fonts)

The layout is designed for desktop screens (960 px and wider), with a simplified stylesheet for smaller screens.

## License

[MIT](LICENSE)
