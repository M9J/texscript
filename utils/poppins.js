const COLOR_BOUNDARY = "\x1b[0m";

const fromRGB = (r, g, b) => `\x1b[38;2;${r};${g};${b}m`;

const COLORS = {
  black: fromRGB(0, 0, 0),
  white: fromRGB(255, 255, 255),
  red: fromRGB(255, 0, 0),
  green: fromRGB(0, 255, 0),
  blue: fromRGB(0, 0, 255),
  yellow: fromRGB(255, 255, 0),
  cyan: fromRGB(0, 255, 255),
  magenta: fromRGB(255, 0, 255),
  gray: fromRGB(128, 128, 128),
  lightRed: fromRGB(255, 102, 102),
  lightGreen: fromRGB(102, 255, 102),
  lightBlue: fromRGB(102, 102, 255),
  orange: fromRGB(255, 165, 0),
  purple: fromRGB(128, 0, 128),
  teal: fromRGB(0, 128, 128),
  pink: fromRGB(255, 192, 203),
  brown: fromRGB(165, 42, 42),
  gold: fromRGB(255, 215, 0),
  silver: fromRGB(192, 192, 192),
};

const coloredText = (color) => (text) => `${COLORS[color] + text + COLOR_BOUNDARY}`;
export default Object.keys(COLORS).reduce((p, c) => ({ ...p, [c]: coloredText(c) }), {});

const coloredTextRGB = (r, g, b) => (text) => fromRGB(r, g, b) + text + COLOR_BOUNDARY;
export const poppinsRGB = (r, g, b) => coloredTextRGB(r, g, b);
