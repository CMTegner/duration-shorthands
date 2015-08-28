const identity = v => v
let units
let amounts
let matcher
let replacer
let inline

init()

function init () {
  units = {}
  _setUnit('ms', 1)
  _setUnit('s', 1000)
  _setUnit('m', 60 * 1000)
  _setUnit('h', 60 * 60 * 1000)
  _setUnit('d', 24 * 60 * 60 * 1000)
  _setUnit('w', 7 * 24 * 60 * 60 * 1000)
  _setUnit('M', 30 * 24 * 60 * 60 * 1000) // Note: assumes 30 days in a month
  _setUnit('y', 365 * 24 * 60 * 60 * 1000)
  compilePatterns()
}

function _setUnit (unit, millis) {
  units[unit] = millis
}

function compilePatterns () {
  const keys = Object.keys(units)
  amounts = keys // TODO: Remove dups (aliases)
    .map(unit => [units[unit], unit])
    .sort(([a], [b]) => b - a) // Descending order
  keys.sort((a, b) => b.length - a.length)
  const expr = `([0-9]+)(${keys.join('|')})`
  matcher = new RegExp(`^(${expr})+$`)
  replacer = new RegExp(expr, 'g')
  inline = new RegExp(`\\b(${expr})+\\b`, 'g')
}

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

export function setUnit (unit, millis) {
  _setUnit(unit, millis)
  compilePatterns()
}

export { init as reset }

