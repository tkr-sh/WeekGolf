import { darkenColor } from "../darkenRGB";

describe('darkenColor function', () => {
    it('should return the original color if the input is not valid', () => {
        const color = '#12';
        const factor = 0.5;
        expect(darkenColor(color, factor)).toEqual(color);
    });
  
    it('should darken the color by the factor', () => {
        const color = '#8A2BE2';
        const factor = 0.5;
        const darkenedColor = darkenColor(color, factor);
        expect(darkenedColor).not.toEqual(color);
        expect(darkenedColor).toEqual('#451671');
    });
  
    it('should return the same color if the factor is 0', () => {
        const color = '#8A2BE2';
        const factor = 0;
        expect(darkenColor(color, factor)).toBe("#8a2be2");
    });
  
    it('should return black if the factor is 1', () => {
        const color = '#8A2BE2';
        const factor = 1;
        expect(darkenColor(color, factor)).toEqual('#000000');
    });
  
    it('should work for lowercase color values', () => {
        const color = '#8a2be2';
        const factor = 0.5;
        const darkenedColor = darkenColor(color, factor);
        expect(darkenedColor).not.toEqual(color);
        expect(darkenedColor).toEqual('#451671');
    });
});
  