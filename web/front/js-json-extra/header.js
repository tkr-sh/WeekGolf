// Animation of Header
const debounce = (fn) => {
    let frame;
    return (...params) => {
        if (frame) {
            cancelAnimationFrame(frame);
        }
        frame = requestAnimationFrame(() => {
            fn(...params);
        });
    }
};

const storeScroll = () => {
    document.documentElement.dataset.scroll = window.scrollY;
}
document.addEventListener('scroll', debounce(storeScroll), { passive: true });
storeScroll();


function clickWeekGolf() {
    if (document.getElementById("middle_header") != null) {
        document.getElementById("middle_header").addEventListener("click", function() {
            if (localStorage.token == null || localStorage.token === "" || localStorage.token.length !== 64) {
                document.location.href = "https://week.golf";
            } else {
                document.location.href = "https://week.golf/problems.html";
            }
        });
    } else {
      setTimeout(clickWeekGolf, 50);
    }
}

window.addEventListener("load", clickWeekGolf);

if (localStorage.zoom != null) {
    document.getElementsByTagName("html")[0].style.zoom = localStorage.zoom;
}