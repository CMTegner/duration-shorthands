const expr = '([0-9]+)(ms|s|m|h|d|w|M|y)'
const matcher = new RegExp(`^(${expr})+$`)
const replacer = new RegExp(expr, 'g')
const inline = new RegExp(`\\b(${expr})+\\b`, 'g')
const identity = v => v
const mapper = {
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
for (let unit in mapper) {
  amounts.push([mapper[unit], unit])
}
amounts.sort(([a], [b]) => b - a) // Descending order

function _parse (shorthand) {
  const parts = []
  shorthand.replace(replacer, (match, num, unit) => parts.push([parseInt(num, 10), unit]))
  return parts
}

function toMillis (parts) {
  return parts.reduce((millis, [amount, unit]) => millis + (amount * mapper[unit]), 0)
}

export function parse (shorthand) {
  if (matcher.test(shorthand)) {
    return toMillis(_parse(shorthand))
  } else {
    throw new Error(`Unrecognised shorthand: ${shorthand}`)
  }
}

export function replace (str, cb = identity) {
  return str.replace(inline, match => {
    const parts = _parse(match)
    return cb(toMillis(parts), parts)
  })
}

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

