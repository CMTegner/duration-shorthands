import test from 'tape'
import { parse, replace, format } from '.'

test('parse simple shorthands to milliseconds', t => {
  t.equal(parse('42ms'), 42)
  t.equal(parse('123s'), 123000)
  t.equal(parse('9m'), 540000)
  t.equal(parse('10000h'), 36000000000)
  t.equal(parse('7d'), 604800000)
  t.equal(parse('2w'), 1209600000)
  t.equal(parse('24M'), 62208000000)
  t.equal(parse('2y'), 63072000000)
  t.end()
})

test('parse compound shorthands', t => {
  t.equal(parse('42h30m'), 153000000)
  t.equal(parse('42h30m15s'), 153015000)
  t.equal(parse('2w1s'), 1209601000)
  t.end()
})

test('fail on compound shorthands containing at least one invalid shorthand', t => {
  t.throws(() => parse('2w1xs'), /Unrecognised shorthand: 2w1xs/)
  t.throws(() => parse('2x1s'), /Unrecognised shorthand: 2x1s/)
  t.throws(() => parse('2S1S'), /Unrecognised shorthand: 2S1S/)
  t.end()
})

test('error on shorthand with no amount', t => {
  t.throws(() => parse('ms'), /Unrecognised shorthand: ms/)
  t.throws(() => parse('s'), /Unrecognised shorthand: s/)
  t.throws(() => parse('m'), /Unrecognised shorthand: m/)
  t.throws(() => parse('h'), /Unrecognised shorthand: h/)
  t.throws(() => parse('d'), /Unrecognised shorthand: d/)
  t.throws(() => parse('w'), /Unrecognised shorthand: w/)
  t.throws(() => parse('M'), /Unrecognised shorthand: M/)
  t.throws(() => parse('y'), /Unrecognised shorthand: y/)
  t.end()
})

test('error on unrecognised shorthand', t => {
  t.throws(() => parse('foo'), /Unrecognised shorthand: foo/)
  t.throws(() => parse('x'), /Unrecognised shorthand: x/)
  t.throws(() => parse('42S'), /Unrecognised shorthand: 42S/)
  t.end()
})

test('inline replace standalone shorthands with corresponding millisecond amount', t => {
  t.equals(replace('1w + 3m - 2s'), '604800000 + 180000 - 2000')
  t.equals(replace('1h+30m-75m=?'), '3600000+1800000-4500000=?')
  t.equals(replace('9m59s and 1s is 10m'), '599000 and 1000 is 600000')
  t.equals(replace('I\'ve drunk 99bottles of rum in 1w'), 'I\'ve drunk 99bottles of rum in 604800000')
  t.equals(replace('foo500msbar'), 'foo500msbar')
  t.end()
})

test('pass millis and the parsed parts that make up the shorthand through an optional callback before inline replacing whatever the callback returns', t => {
  replace('42m5s', (millis, parts) => {
    t.equals(millis, 2525000)
    t.deepEqual(parts[0], { amount: 42, unit: 'm' })
    t.deepEqual(parts[1], { amount: 5, unit: 's' })
  })
  let sum = 0
  replace('9m59s and 1s is 10m', millis => sum += millis)
  t.equals(sum, 1200000)
  const estimateify = (_, [{ amount }]) => `${amount}w`
  t.equals(replace('it\'ll take 2d to complete', estimateify), 'it\'ll take 2w to complete')
  t.end()
})

test('format a millisecond count as a duration shorthand', t => {
  t.equals(format(420000), '7m')
  t.equals(format(1468800000), '2w3d')
  t.equals(format(1468800001), '2w3d1ms')
  t.equals(format(-1468800001), '-2w3d1ms')
  t.end()
})

