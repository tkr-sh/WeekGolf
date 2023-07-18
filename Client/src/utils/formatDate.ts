/**
 * Converts a Unix timestamp into a common date format string.
 * @param date - The Unix timestamp in seconds.
 * @returns A string representing the time difference between the Unix timestamp and current time, in the most appropriate
 * time unit (seconds, minutes, hours, days, or years) followed by "ago".
 */
function formatDate(date: number): string {
    const time = [1, 60, 3600, 84000, 31536000, Infinity];
    const name = ["second", "minute", "hour", "day", "year"];
    const currentDateTime = new Date();
    // const currentUTC = new Date(currentDateTime.getUTCFullYear(), currentDateTime.getUTCMonth(), currentDateTime.getUTCDate(), 
    //                     currentDateTime.getUTCHours(), currentDateTime.getUTCMinutes(), currentDateTime.getUTCSeconds());
    const currentUTC = currentDateTime;
    const diff = currentUTC.getTime() / 1000 - date;
  
    for (let i = 0; i < name.length; i++) {
        if (diff < time[i + 1]) {
            return `${Math.floor(diff / time[i])} ${name[i]}${Math.floor(diff / time[i]) === 1 ? "" : "s"} ago`;
        }
    }

    return "";

}


export default formatDate;
