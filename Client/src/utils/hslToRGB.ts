function hslToRgb(h: number, s: number, l: number): string {
    const a = s * Math.min(l, 1 - l);
    const f = (n: number, k=(n + h / 30)%12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    const hexFormat = (n: number) => Math.round(n).toString(16).padStart(2, '0')

    return `#${[f(0), f(8), f(4)].map(e => hexFormat(e * 255)).join('')}`
}
  
export default hslToRgb;
  