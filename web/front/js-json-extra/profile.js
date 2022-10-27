function switch_sub(page) {
    const friends = document.getElementById("friends");
    const info = document.getElementById("info");
    const activity = document.getElementById("activity");

    friends.style.display = (page === "friends")?"block":"none";
    info.style.display = (page === "info")?"block":"none";
    activity.style.display = (page === "activity")?"block":"none";

    setTimeout(footer,100);
}