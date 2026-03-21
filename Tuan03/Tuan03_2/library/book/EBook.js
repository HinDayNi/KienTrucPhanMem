const Book = require('./Book');

class EBook extends Book {
  constructor(id, title, author, genre) {
    super(id, title, author, genre);
    this.type = 'ebook';
  }
}

module.exports = EBook;
