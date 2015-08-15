import test from 'tape';
import convert, { replace } from '.';

test('convert simple shorthands to milliseconds', t => {
    t.equal(convert('42ms'), 42);
    t.equal(convert('123s'), 123000);
    t.equal(convert('9m'), 540000);
    t.equal(convert('10000h'), 36000000000);
    t.equal(convert('7d'), 604800000);
    t.equal(convert('2w'), 1209600000);
    t.equal(convert('24M'), 62208000000);
    t.equal(convert('2y'), 63072000000);
    t.end();
});

test('convert compound shorthands', t => {
    t.equal(convert('42h30m'), 153000000);
    t.equal(convert('42h30m15s'), 153015000);
    t.equal(convert('2w1s'), 1209601000);
    t.end();
});

test('fail on compound shorthands containing at least one invalid shorthand', t => {
    t.throws(() => convert('2w1xs'), /Unrecognised shorthand: 2w1xs/);
    t.throws(() => convert('2x1s'), /Unrecognised shorthand: 2x1s/);
    t.throws(() => convert('2S1S'), /Unrecognised shorthand: 2S1S/);
    t.end();
});

test('error on shorthand with no amount', t => {
    t.throws(() => convert('ms'), /Unrecognised shorthand: ms/);
    t.throws(() => convert('s'), /Unrecognised shorthand: s/);
    t.throws(() => convert('m'), /Unrecognised shorthand: m/);
    t.throws(() => convert('h'), /Unrecognised shorthand: h/);
    t.throws(() => convert('d'), /Unrecognised shorthand: d/);
    t.throws(() => convert('w'), /Unrecognised shorthand: w/);
    t.throws(() => convert('M'), /Unrecognised shorthand: M/);
    t.throws(() => convert('y'), /Unrecognised shorthand: y/);
    t.end();
});

test('error on unrecognised shorthand', t => {
    t.throws(() => convert('foo'), /Unrecognised shorthand: foo/);
    t.throws(() => convert('x'), /Unrecognised shorthand: x/);
    t.throws(() => convert('42S'), /Unrecognised shorthand: 42S/);
    t.end();
});

test('inline replace standalone shorthands', t => {
    t.equals(replace('1w + 3m - 2s'), '604800000 + 180000 - 2000');
    t.equals(replace('9m59s and 1s is 10m'), '599000 and 1000 is 600000');
    t.equals(replace('I\'ve drunk 99bottles of rum in 1w'), 'I\'ve drunk 99bottles of rum in 604800000');
    t.equals(replace('foo500msbar'), 'foo500msbar');
    t.end();
});

