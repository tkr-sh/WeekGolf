import { createEffect, createSignal, onMount } from "solid-js";
import formatDuration from '../utils/formatDuration';


const timeUntilNextSunday = (): number => {
    const now: Date = new Date(); // Get the current date and time in local timezone
    const utcNow: Date = new Date(now.valueOf() + now.getTimezoneOffset() * 60 * 1000); // Convert to UTC
    let daysUntilSunday: number = 7 - utcNow.getUTCDay(); // Calculate days until next Sunday

    if (daysUntilSunday === 7) {
      daysUntilSunday = 0;
    }

    const sundayAt8pm: Date = new Date(
      utcNow.getUTCFullYear(),
      utcNow.getUTCMonth(),
      utcNow.getUTCDate() + daysUntilSunday,
    ); // Set the next Sunday
    sundayAt8pm.setUTCHours(20); // Set the hour to 8pm in UTC

    const timeRemaining: number = sundayAt8pm.valueOf() - utcNow.valueOf(); // Calculate the time remaining in milliseconds
  
    return timeRemaining; // Return the time remaining in milliseconds
};
  


const Timer = (props: any) => {
    const [timeRemaining, setTimeRemaining] =
        createSignal(props.time, {equals: false});

    // Decrease the timer
    const updateTimer = () => {
        setTimeRemaining(t => t - 1);
        setTimeout(updateTimer, 1_000);
    }


    onMount(() => {
        updateTimer();
    });


    // Update the time remaining
    createEffect(() => {
        setTimeRemaining(props.time)
    })

    return <time class='timer-problem'>
    {
        timeRemaining() > 0?
        formatDuration(timeRemaining()) :
        "FINISHED!"
    }
</time>

}

export default Timer;