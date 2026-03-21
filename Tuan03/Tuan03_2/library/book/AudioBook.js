const Book = require('./Book');

class AudioBook extends Book {
  constructor(id, title, author, genre) {
    super(id, title, author, genre);
    this.type = 'audio';
  }
}

module.exports = AudioBook;
