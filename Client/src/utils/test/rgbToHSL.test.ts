import rgbToHsl, { HslColor } from '../rgbToHSL';

const fixHSL = (HSL: HslColor) => {
    return {
        h: +HSL.h.toFixed(2),
        s: +HSL.s.toFixed(2),
        l: +HSL.l.toFixed(2),
    }
}

describe('rgbToHsl', () => {
    it('should return the correct HSL value for RGB (255, 0, 0)', () => {
        const expected: HslColor = { h: 0, s: 1, l: 0.5 };
        const result = fixHSL(rgbToHsl(255, 0, 0));
        expect(result).toEqual(expected);
    });

    it('should return the correct HSL value for RGB (0, 255, 0)', () => {
        const expected: HslColor = { h: 0.33, s: 1, l: 0.5 };
        const result = fixHSL(rgbToHsl(0, 255, 0));
        expect(result).toEqual(expected);
    });

    it('should return the correct HSL value for RGB (0, 0, 255)', () => {
        const expected: HslColor = { h: 0.66, s: 1, l: 0.5 };
        const expectedRounded: HslColor = { h: 0.67, s: 1, l: 0.5 };
        const result = fixHSL(rgbToHsl(0, 0, 255));
        expect(result).toEqual(expectedRounded);
    });

    it('should return the correct HSL value for RGB (128, 128, 128)', () => {
        const expected: HslColor = { h: 0, s: 0, l: 0.5 };
        const result = fixHSL(rgbToHsl(128, 128, 128));
        expect(result).toEqual(expected);
    });

    it('should return the correct HSL value for RGB (255, 255, 255)', () => {
        const expected: HslColor = { h: 0, s: 0, l: 1 };
        const result = fixHSL(rgbToHsl(255, 255, 255));
        expect(result).toEqual(expected);
    });

    it('should return the correct HSL value for RGB (0, 0, 0)', () => {
        const expected: HslColor = { h: 0, s: 0, l: 0 };
        const result = fixHSL(rgbToHsl(0, 0, 0));
        expect(result).toEqual(expected);
    });
});
