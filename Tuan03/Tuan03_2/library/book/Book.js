class Book {
  constructor(id, title, author, genre) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.type = 'book';
    this.available = true;
  }
}

module.exports = Book;
