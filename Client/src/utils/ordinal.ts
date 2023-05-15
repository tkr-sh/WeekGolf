const ordinal = (n: number): string => {
    if (n % 100 >= 11 && n % 100 <= 13) {
        return `${n}th`;
    } else {
        switch (n % 10) {
            case 1:
                return `${n}st`;
            case 2:
                return `${n}nd`;
            case 3:
                return `${n}rd`;
            default:
                return `${n}th`;
        }
    }
}
  

export default ordinal;