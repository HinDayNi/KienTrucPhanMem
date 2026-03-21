const Book = require('./Book');

class PaperBook extends Book {
  constructor(id, title, author, genre) {
    super(id, title, author, genre);
    this.type = 'paper';
  }
}

module.exports = PaperBook;
