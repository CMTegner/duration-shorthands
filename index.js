const expr = '([0-9]+)(ms|s|m|h|d|w|M|y)'
const matcher = new RegExp(`^(${expr})+$`)
const replacer = new RegExp(expr, 'g')
const inline = new RegExp(`\\b(${expr})+\\b`, 'g')
const identity = v => v
const units = {
  ms: 1,
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
  w: 7 * 24 * 60 * 60 * 1000,
  M: 30 * 24 * 60 * 60 * 1000, // Note: assumes 30 days in a month
  y: 365 * 24 * 60 * 60 * 1000
}
const amounts = []
for (let unit in units) {
  amounts.push([units[unit], unit])
}
amounts.sort(([a], [b]) => b - a) // Descending order

function _parse (shorthand) {
  const parts = []
  shorthand.replace(replacer, (match, num, unit) => parts.push({ amount: parseInt(num, 10), unit }))
  return parts
}

function toMillis (parts) {
  return parts.reduce((millis, { amount, unit }) => millis + (amount * units[unit]), 0)
}

/**
 * Convert a duration shorthand into milliseconds.
 *
 * @param {String} shorthand the duration shorthand to evaluate
 * @returns {Number} the amount of milliseconds the shorthand spans
 */
export function parse (shorthand) {
  if (matcher.test(shorthand)) {
    return toMillis(_parse(shorthand))
  } else {
    throw new Error(`Unrecognised shorthand: ${shorthand}`)
  }
}

/**
 * Perform inline replacement of shorthand instances in a string.
 *
 * @param {String} str the string to evaluate
 * @param {replaceCallback} [cb] the callback which is invoked for each shorthand. The return value is used as the replacement. The default replacement value is the shorthand's millisecond count.
 */
export function replace (str, cb = identity) {
  return str.replace(inline, match => {
    const parts = _parse(match)
    return cb(toMillis(parts), parts)
  })
}

/**
 * Invoked by `replace` for each shorthand instance in a string.
 *
 * @callback replaceCallback
 * @param {Number} millis the amount of milliseconds the shorthand spans
 * @param {Object[]} parts an array of the (amount, unit) pairs that make up the shorthand
 * @param {Number} parts[].amount the part's amount
 * @param {String} parts[].unit the part's unit
 * @returns {*} a value which will be cast to a String and used as the shorthand's replacement
 */

/**
 * Format a millisecond count as a duration shorthand.
 *
 * @param {Number} millis the millisecond count to format
 * @returns {String} a duration shorthand
 */
export function format (millis) {
  let result = millis < 0 ? '-' : ''
  for (let i = 0, rest = Math.abs(millis); rest; i++) {
    const [amount, unit] = amounts[i]
    const c = Math.floor(rest / amount)
    if (c < 1) continue
    result += c + unit
    rest = rest % amount
  }
  return result
}

