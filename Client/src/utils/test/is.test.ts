import { isAlnum, isAlpha, isNumeric } from "../is";

describe('isAlpha', () => {
    test('returns true when input is all alphabetical characters', () => {
        expect(isAlpha('abcdefghijklmnopqrstuvwxyz')).toBe(true);
        expect(isAlpha('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe(true);
        expect(isAlpha('AbCdEfGhIjKlMnOpQrStUvWxYz')).toBe(true);
    });

    test('returns false when input contains non-alphabetical characters', () => {
        expect(isAlpha('abc123')).toBe(false);
        expect(isAlpha('ABC!')).toBe(false);
        expect(isAlpha('AbCdEfGhIjKlMnOpQrStUvWxYz!')).toBe(false);
    });
});

describe('isNumeric', () => {
    test('returns true when input is all numeric characters', () => {
        expect(isNumeric('0123456789')).toBe(true);
        expect(isNumeric('1234567890')).toBe(true);
        expect(isNumeric('00000')).toBe(true);
    });

    test('returns false when input contains non-numeric characters', () => {
        expect(isNumeric('123abc')).toBe(false);
        expect(isNumeric('1,000')).toBe(false);
        expect(isNumeric('1.0')).toBe(false);
    });
});

describe('isAlnum', () => {
    test('returns true when input is all alphanumeric characters', () => {
        expect(isAlnum('abcdefghijklmnopqrstuvwxyz0123456789')).toBe(true);
        expect(isAlnum('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')).toBe(true);
        expect(isAlnum('AbCdEfGhIjKlMnOpQrStUvWxYz0123456789')).toBe(true);
    });

    test('returns false when input contains non-alphanumeric characters', () => {
        expect(isAlnum('abc!')).toBe(false);
        expect(isAlnum('123-456')).toBe(false);
        expect(isAlnum('AbCdEfGhIjKlMnOpQrStUvWxYz!')).toBe(false);
    });
});
