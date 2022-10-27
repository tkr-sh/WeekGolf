function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


let pp_url = "";

function pp() {
    const header_xhttp = new XMLHttpRequest();

    header_xhttp.open("POST", "https://week.golf/getPpByToken.php", true);
    header_xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    header_xhttp.send(`t=${localStorage.token}`);

    header_xhttp.onload = function() {
        pp_url = JSON.parse(header_xhttp.response)["pfp"];
    }
}

pp()

function recursion() {
    if (document.getElementById("pp") != null && pp_url != "" ) {
        document.getElementById("pp").src = pp_url != null? pp_url:"img/nouser_white.jpg";
    } else {
        setTimeout(recursion, 10); // try again in 10 milliseconds
    }
}

recursion()

function updateHeader() {
    if (document.getElementById("left_header") != null) {
        if (localStorage.smallHeader == "small"){
            document.getElementById("left_header").style.display = "none";
        } else {
            document.getElementById("left_header_nav").style.display = "none";
        }
    } else {
        setTimeout("updateHeader()", 10); // try again in 10 milliseconds
    }
}
updateHeader()




function fromHeightTofloat(height) {
    return parseFloat(height.substring(0, height.length - 2));
}

function footer(){

    console.log("FOOTER")

    try {
        document.getElementsByTagName("html")[0].style.height = "100%";


        const y_coord = document.getElementById("footer").getBoundingClientRect().top;
        const y_length = fromHeightTofloat(window.getComputedStyle(document.getElementsByTagName("html")[0]).height);
        const height_footer = fromHeightTofloat(window.getComputedStyle(document.getElementById("footer")).height) + fromHeightTofloat(window.getComputedStyle(document.getElementById("footer")).paddingTop);
        const currentMarginTop = fromHeightTofloat(window.getComputedStyle(document.getElementById("footer")).marginTop);


        if ( y_coord + height_footer < y_length ){
            document.getElementById("footer").style.marginTop = (y_length - y_coord + currentMarginTop - height_footer) + "px"
        } else if ( currentMarginTop > 30 ){
            document.getElementById("footer").style.marginTop = "0px";
            for (let i = 1; i < 5; i++)
                setTimeout(footer, 10 * i);
        }

    } catch (error) {
        setTimeout(footer, 30);
    }
}
window.addEventListener('load', footer);
window.addEventListener('resize', footer);