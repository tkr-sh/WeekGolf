export interface HslColor {
    h: number;
    s: number;
    l: number;
}

const rgbToHsl = (r: number, g: number, b: number): HslColor => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
  
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;

        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }
    
    return {h, s, l};
};
  


export default rgbToHsl