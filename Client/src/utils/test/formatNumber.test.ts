import formatNumber from "../formatNumber";

// Unit tests using Jest
describe("formatNumber", () => {
    it("should separate a string of digits into groups of three", () => {
      expect(formatNumber(123456789)).toEqual("123,456,789");
      expect(formatNumber(1234)).toEqual("1,234");
      expect(formatNumber(1)).toEqual("1");
      expect(formatNumber(0)).toEqual("0");
      expect(formatNumber(3.14)).toEqual("3");
      expect(formatNumber(3e5)).toEqual("300,000");
    });
});