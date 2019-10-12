import assertString from './util/assertString.js';

export default function isJSON(str) {
  assertString(str);
  try {
    const obj = JSON.parse(str);
    return !!obj && typeof obj === 'object';
  } catch (e) {/* ignore */}
  return false;
}