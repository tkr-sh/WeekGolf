declare global {
  interface Array<T> {
    shuffle(): T[];
  }
}

export {};

Array.prototype.shuffle = function () {
  let currentIndex = this.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [this[currentIndex], this[randomIndex]] = [this[randomIndex], this[currentIndex]];
  }

  return this;
};
