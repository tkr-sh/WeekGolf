import hslToRgb from '../hslToRGB';

describe('hslToRgb function', () => {
    test('Should convert hsl(0,0%,0%) to #000000', () => {
        expect(hslToRgb(0, 0, 0)).toBe('#000000');
    });

    test('Should convert hsl(0,100%,50%) to #ff0000', () => {
        expect(hslToRgb(0, 1, 0.5)).toBe('#ff0000');
    });

    test('Should convert hsl(120,100%,50%) to #00ff00', () => {
        expect(hslToRgb(120, 1, 0.5)).toBe('#00ff00');
    });

    test('Should convert hsl(240,100%,50%) to #0000ff', () => {
        expect(hslToRgb(240, 1, 0.5)).toBe('#0000ff');
    });

    test('Should convert hsl(0,100%,100%) to #ffffff', () => {
        expect(hslToRgb(0, 1, 1)).toBe('#ffffff');
    });

    test('Should convert hsl(60,50%,50%) to #bfbf40', () => {
        expect(hslToRgb(60, 0.5, 0.5)).toBe('#bfbf40');
    });

    test('Should convert hsl(159,48%,82%) to #bbe7d8', () => {
        expect(hslToRgb(159, 0.48, 0.82)).toBe('#bbe7d8');
    });
});
