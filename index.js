const expr = '([0-9]+)(ms|s|m|h|d|w|M|y)';
const matcher = new RegExp(`^(${expr})+$`);
const replacer = new RegExp(expr, 'g');
const inline = new RegExp(`\\b(${expr})+\\b`, 'g');
const identity = v => v;
const mapper = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
    M: 30 * 24 * 60 * 60 * 1000, // Note: assumes 30 days in a month
    y: 365 * 24 * 60 * 60 * 1000
};

function parse(shorthand) {
    const parts = [];
    shorthand.replace(replacer, (match, num, unit) => parts.push([parseInt(num, 10), unit]));
    return parts;
}

function toMillis(parts) {
    return parts.reduce((millis, [amount, unit]) => millis + (amount * mapper[unit]), 0);
}

export default shorthand => {
    if (matcher.test(shorthand)) {
        return toMillis(parse(shorthand));
    } else {
        throw new Error(`Unrecognised shorthand: ${shorthand}`);
    }
}

export function replace(str, cb = identity) {
    return str.replace(inline, match => {
        const parts = parse(match);
        return cb(toMillis(parts), parts);
    });
}

