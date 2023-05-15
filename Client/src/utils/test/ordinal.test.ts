import ordinal from '../ordinal';

describe('ordinal', () => {
    it('should return 1st for 1', () => {
        expect(ordinal(1)).toBe('1st');
    });

    it('should return 2nd for 2', () => {
        expect(ordinal(2)).toBe('2nd');
    });

    it('should return 3rd for 3', () => {
        expect(ordinal(3)).toBe('3rd');
    });

    it('should return 4th for 4', () => {
        expect(ordinal(4)).toBe('4th');
    });

    it('should return 11th for 11', () => {
        expect(ordinal(11)).toBe('11th');
    });

    it('should return 21st for 21', () => {
        expect(ordinal(21)).toBe('21st');
    });

    it('should return 112th for 112', () => {
        expect(ordinal(112)).toBe('112th');
    });
});
