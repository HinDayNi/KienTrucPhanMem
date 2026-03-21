const PaperBook = require('../book/PaperBook');
const EBook = require('../book/EBook');
const AudioBook = require('../book/AudioBook');

class BookFactory {
  static createBook(type, payload) {
    const { id, title, author, genre } = payload;

    switch (type) {
      case 'paper':
        return new PaperBook(id, title, author, genre);
      case 'ebook':
        return new EBook(id, title, author, genre);
      case 'audio':
        return new AudioBook(id, title, author, genre);
      default:
        throw new Error('Loại sách không hợp lệ. Chỉ hỗ trợ: paper, ebook, audio.');
    }
  }
}

module.exports = BookFactory;
