import formatDuration from "../formatDuration";

describe('formatDuration', () => {
    test('formats seconds to DDday(s) HHhour(s) MMminute(s) SSsecond(s)', () => {
        expect(formatDuration(0)).toBe('0seconds');
        expect(formatDuration(1)).toBe('1second');
        expect(formatDuration(60)).toBe('1minute');
        expect(formatDuration(3600)).toBe('1hour');
        expect(formatDuration(86400)).toBe('1day');
        expect(formatDuration(123456)).toBe('1day 10hours 17minutes 36seconds');
        expect(formatDuration(86461)).toBe('1day 0hours 1minute 1second');
    });
});