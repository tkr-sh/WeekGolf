/**
 * @jest-environment jsdom
 */
import changeTheme from "../ChangeTheme";
import themeCorrespondance from "../../data/themeCorrespondance.json";
import "jest-localstorage-mock";


type ThemeCorrespondance = {
	[key: string]: string;
}
  
const typedThemeCorrespondance: ThemeCorrespondance = themeCorrespondance;

describe("changeTheme", () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.style.cssText = "";
    });

    // Test with dark mode
    it("should set the color theme and update the CSS variables", () => {
        // Constants
        const n = "" + Math.round(Math.random() * 360);
        const mode = "dark";

        localStorage.setItem("mode", mode);
        changeTheme(n);

        // Expect
        expect(localStorage.getItem("color-theme")).toBe(n);
        expect(document.documentElement.style.getPropertyValue("--main-color")).toBe(`hsl(${n}, 60%,50%)` || `hsl(${n}, 60%, 50%)`);
        expect(document.documentElement.style.getPropertyValue("--golf-color")).toBe(`hsl(${n}, 57%,47%)` || `hsl(${n}, 60%, 47%)`);
        expect(document.documentElement.style.getPropertyValue("--hue")).toBe(`calc(${n}deg - 50deg)` || eval("n - 50") + "deg" );
    });

    // Test with light mode
    it("should set the color theme and update the CSS variables", () => {
        // Constants
        const n = "" + Math.round(Math.random() * 360);
        const mode = "light";

        localStorage.setItem("mode", mode);
        changeTheme(n);

        // Expect
        expect(localStorage.getItem("color-theme")).toBe(n);
        expect(document.documentElement.style.getPropertyValue("--main-color")).toBe(`hsl(${n}, 60%,50%)` || `hsl(${n}, 60%, 50%)`);
        expect(document.documentElement.style.getPropertyValue("--golf-color")).toBe(`hsl(${n}, 57%,53%)` || `hsl(${n}, 60%, 53%)`);
        expect(document.documentElement.style.getPropertyValue("--hue")).toBe(`calc(${n}deg - 50deg)` || eval("n - 50") + "deg" );
    });
});
