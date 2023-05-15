import formatDate from "../formatDate";


describe("formatDate", () => {
    it("Should return '1 second ago' for a timestamp 1 second in the past", () => {
        const now = Date.now() / 1000;
        const timestamp = now - 1;
        expect(formatDate(timestamp)).toBe("1 second ago");
    });
  
    it("Should return '2 seconds ago' for a timestamp 2 seconds in the past", () => {
        const now = Date.now() / 1000;
        const timestamp = now - 2;
        expect(formatDate(timestamp)).toBe("2 seconds ago");
    });
  
    it("Should return '1 minute ago' for a timestamp 60 seconds (1 minute) in the past", () => {
        const now = Date.now() / 1000;
        const timestamp = now - 60;
        expect(formatDate(timestamp)).toBe("1 minute ago");
    });
  
    it("Should return '2 minutes ago' for a timestamp 120 seconds (2 minutes) in the past", () => {
        const now = Date.now() / 1000;
        const timestamp = now - 120;
        expect(formatDate(timestamp)).toBe("2 minutes ago");
    });
  
    it("Should return '1 hour ago' for a timestamp 3600 seconds (1 hour) in the past", () => {
        const now = Date.now() / 1000;
        const timestamp = now - 3600;
        expect(formatDate(timestamp)).toBe("1 hour ago");
    });
  
    it("Should return '2 hours ago' for a timestamp 7200 seconds (2 hours) in the past", () => {
        const now = Date.now() / 1000;
        const timestamp = now - 7200;
        expect(formatDate(timestamp)).toBe("2 hours ago");
    });
  
    it("Should return '1 day ago' for a timestamp 86400 seconds (1 day) in the past", () => {
        const now = Date.now() / 1000;
        const timestamp = now - 86400;
        expect(formatDate(timestamp)).toBe("1 day ago");
    });
  
    it("Should return '2 days ago' for a timestamp 172800 seconds (2 days) in the past", () => {
        const now = Date.now() / 1000;
        const timestamp = now - 172800;
        expect(formatDate(timestamp)).toBe("2 days ago");
    });
  
    it("Should return '1 year ago' for a timestamp 31536000 seconds (1 year) in the past", () => {
        const now = Date.now() / 1000;
        const timestamp = now - 31536000;
        expect(formatDate(timestamp)).toBe("1 year ago");
    });
  
    it("Should return '2 years ago' for a timestamp 63072000 seconds (2 years) in the past", () => {
        const now = Date.now() / 1000;
        const timestamp = now - 63072000;
        expect(formatDate(timestamp)).toBe("2 years ago");
    });
});