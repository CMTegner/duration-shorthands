import test from 'tape';
import convert from '.';

test('convert simple shorthands to milliseconds', t => {
    t.equal(convert('ms'), 1);
    t.equal(convert('s'), 1000);
    t.equal(convert('m'), 60000);
    t.equal(convert('h'), 3600000);
    t.equal(convert('d'), 86400000);
    t.equal(convert('w'), 604800000);
    t.equal(convert('M'), 2592000000);
    t.equal(convert('y'), 31536000000);
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

