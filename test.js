import test from 'tape';
import convert from '.';

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

