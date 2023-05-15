declare global {
    interface Array<T> {
        uniq(): T[];
    }
}
  

export {};

Array.prototype.uniq = function() {
    return this.filter((item, index) => this.indexOf(item) === index);
};