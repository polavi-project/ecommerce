import assertString from './util/assertString.js';

export default function ltrim(str, chars) {
  assertString(str);
  const pattern = chars ? new RegExp(`^[${chars}]+`, 'g') : /^\s+/g;
  return str.replace(pattern, '');
}
