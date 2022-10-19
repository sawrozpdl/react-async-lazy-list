function padZero(str: string, len: number): string {
  len = len || 2;
  let zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

export function invertColor(hex: string, bw: boolean) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  let r: number | string = parseInt(hex.slice(0, 2), 16),
    g: number | string = parseInt(hex.slice(2, 4), 16),
    b: number | string = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
  }

  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);

  return '#' + padZero(r, 2) + padZero(g, 2) + padZero(b, 2);
}

export function generateRandomColor() {
  let maxVal = 0xffffff; // 16777215
  let randomNumber: string | number = Math.random() * maxVal;
  randomNumber = Math.floor(randomNumber);
  randomNumber = randomNumber.toString(16);
  let randColor = randomNumber.padStart(6, '0');
  return `#${randColor.toUpperCase()}`;
}

export function randomNumber(a: number, b: number): number {
  return Math.floor(Math.random() * Math.abs(a - b) + Math.min(a, b));
}
