import rankToClass from "../rankToClass";

describe("rankToClass", () => {
    it("should return 'first' for rank 1", () => {
       expect(rankToClass(1)).toBe("first");
    });

    it("should return 'second' for rank 2", () => {
       expect(rankToClass(2)).toBe("second");
    });

    it("should return 'third' for rank 3", () => {
       expect(rankToClass(3)).toBe("third");
    });

    it("should return 'top10' for rank between 4 and 10 inclusive", () => {
       expect(rankToClass(4)).toBe("top10");
       expect(rankToClass(7)).toBe("top10");
       expect(rankToClass(10)).toBe("top10");
    });

    it("should return 'top100' for rank between 11 and 100 inclusive", () => {
       expect(rankToClass(11)).toBe("top100");
       expect(rankToClass(50)).toBe("top100");
       expect(rankToClass(100)).toBe("top100");
    });

    it("should return empty string for rank greater than 100", () => {
       expect(rankToClass(101)).toBe("");
       expect(rankToClass(1000)).toBe("");
       expect(rankToClass(1000000)).toBe("");
    });
});
