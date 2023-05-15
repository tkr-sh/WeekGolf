const formatDuration = (seconds: number) => {
    let days = Math.floor(seconds / (24 * 60 * 60));
    seconds -= days * 24 * 60 * 60;
    let hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * 60 * 60;
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
  
    let result = '';
    if (days > 0) {
        result += days + (days === 1 ? 'day ' : 'days ');
    }
    if (hours > 0 || days > 0) {
        result += hours + (hours === 1 ? 'hour ' : 'hours ');
    }
    if (minutes > 0 || days > 0 || hours > 0) {
        result += minutes + (minutes === 1 ? 'minute ' : 'minutes ');
    }
    if (seconds > 0 || days > 0 || hours > 0 || minutes > 0 || result === '') {
        result += seconds + (seconds === 1 ? 'second' : 'seconds');
    }
  
    return result.trim();
}
  
export default formatDuration;