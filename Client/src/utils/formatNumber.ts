/**
 * Separates a string of digits into groups of three, separated by commas.
 * @param {number} n - A number that we need to separate
 * @returns {string} A new string with the digits separated into groups of three.
 */
const formatNumber = (n: number): string => {
    const reversed = (Math.round(n)+"").split("").reverse().join("");
    const groups = reversed.match(/.{1,3}/g);

    return groups ? groups.join(",").split("").reverse().join("") : "";
}

export default formatNumber;