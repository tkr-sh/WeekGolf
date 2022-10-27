const currentColorTheme = localStorage.colorTheme ? localStorage.colorTheme : "green";
document.documentElement.setAttribute('data-color-theme', currentColorTheme);