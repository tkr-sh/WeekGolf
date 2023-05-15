import capitalize from "../capitalize";

describe("capitalize function", () => {
    it("capitalizes the first letter of a non-empty string", () => {
        expect(capitalize("hello")).toBe("Hello");
        expect(capitalize("wORLD")).toBe("World");
        expect(capitalize("a")).toBe("A");
    });

    it("returns '' if the input string is empty", () => {
        expect(capitalize("")).toBe("");
    });
});