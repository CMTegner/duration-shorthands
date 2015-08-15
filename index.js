const expr = '([0-9]+)(ms|s|m|h|d|w|M|y)';
const matcher = new RegExp(`^(${expr})+$`);
const replacer = new RegExp(expr, 'g');
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

export default shorthand => {
    if (matcher.test(shorthand)) {
        let sum = 0;
        shorthand.replace(replacer, (match, num, unit) => {
            sum += parseInt(num, 10) * mapper[unit];
        });
        return sum;
    } else {
        throw new Error(`Unrecognised shorthand: ${shorthand}`);
    }
}

