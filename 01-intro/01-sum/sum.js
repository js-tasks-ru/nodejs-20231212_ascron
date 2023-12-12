function sum(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new TypeError('sum() expects only numbers.');
    }
    return a + b;
}

module.exports = sum;
