export function snakeToCamel(str) {
  return str.replace(/(-\w)/g, (match) => match[1].toUpperCase());
}

export function nextFrame(fn) {
  // Twice because of firefox
  requestAnimationFrame(() => requestAnimationFrame(() => fn()));
}
