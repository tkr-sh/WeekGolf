/**
 * @brief Get the CSS class depending on the rank
 * 
 * @param {number} rank The rank of the user
 * @returns {string} The class
 */
const rankToClass = (rank: number): string => {
    if (rank === 1) {
        return "first";
    } else if (rank === 2) {
        return "second";
    } else if (rank === 3) {
        return "third";
    } else if (rank <= 10) {
        return "top10";;
    } else if (rank <= 100) {
        return "top100";
    } else {
        return "";
    }
} 

export default rankToClass;