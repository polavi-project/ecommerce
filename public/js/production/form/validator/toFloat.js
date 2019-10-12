import assertString from './util/assertString.js';

export default function toFloat(str) {
  assertString(str);
  return parseFloat(str);
}