const matcher = /([0-9]*)(ms|s|m|h|d|w|M|y)/;
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
    const match = matcher.exec(shorthand);
    if (match) {
        const [,num,unit] = match;
        return (parseInt(num, 10) || 1) * mapper[unit];
    } else {
        throw new Error(`Unrecognised shorthand: ${shorthand}`);
    }
}

