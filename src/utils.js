/**
 * Converts a snake-case String to camel-case
 * @param {string} str String to convert to camel case
 */
export function snakeToCamel(str) {
  return str.replace(/(-\w)/g, (match) => match[1].toUpperCase());
}

/**
 * Calls a function after the next frame on all browsers.
 * @param {Function} fn Function to call after the next frame
 */
export function nextFrame(fn) {
  // Twice because of firefox
  requestAnimationFrame(() => requestAnimationFrame(() => fn()));
}
