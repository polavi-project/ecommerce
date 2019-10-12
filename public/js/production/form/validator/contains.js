import assertString from './util/assertString.js';
import toString from './util/toString.js';

export default function contains(str, elem) {
  assertString(str);
  return str.indexOf(toString(elem)) >= 0;
}