import themeCorrespondance from "../data/themeCorrespondance.json";

type ThemeCorrespondance = {
	[key: string]: string;
}
  
const typedThemeCorrespondance: ThemeCorrespondance = themeCorrespondance;


// Change the theme 
const changeTheme = (n: string) => {

    const mode: string = localStorage.getItem("mode") ?? "dark";

    Object.keys(typedThemeCorrespondance).map((k) => {
        const expr: string = typedThemeCorrespondance[k].split("[").slice(-1)[0].split("]")[0];
        const res: string = mode === "dark" ? expr : eval("100 - expr")

        return document
        .documentElement
        .style
        .setProperty(
            k, 
            typedThemeCorrespondance[k]
            .replace('n', n)
            .replace(/\[[^\]]*\]/g, res)
        )
    });

    localStorage.setItem("color-theme", n);
}

export default changeTheme;