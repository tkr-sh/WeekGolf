import "../uniq";

describe('uniq', () => {
    it('Should return an array with only unique items', () => {
        const arr = [1, 2, 2, 3, 3, 3];
        const expected = [1, 2, 3];
        const result = arr.uniq();
        expect(result).toEqual(expected);
    });
  
    it('Should return an empty array when given an empty array', () => {
        const arr: number[] = [];
        const expected: number[] = [];
        const result = arr.uniq();
        expect(result).toEqual(expected);
    });
  
    it('Should return an array with one item when given an array with one item', () => {
        const arr = [1];
        const expected = [1];
        const result = arr.uniq();
        expect(result).toEqual(expected);
    });
  
    it('Should return an array with all items when given an array with all unique items', () => {
        const arr = [1, 2, 3, 4, 5];
        const expected = [1, 2, 3, 4, 5];
        const result = arr.uniq();
        expect(result).toEqual(expected);
    });

    it('Should keep it sorted', () => {
        const arr = [1, 3, 2, 3, 1, 3, 2];
        const expected = [1, 3, 2];
        const result = arr.uniq();
        expect(result).toEqual(expected);
    });

    it('Should also works with other data types', () => {
        const arr = ["Hello", "World", "!", "!", "!"];
        const expected = ["Hello", "World", "!",];
        const result = arr.uniq();
        expect(result).toEqual(expected);
    });
});