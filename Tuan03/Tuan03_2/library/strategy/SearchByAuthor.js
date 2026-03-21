class SearchByAuthor {
  search(books, keyword) {
    const k = keyword.toLowerCase();
    return books.filter((book) => book.author.toLowerCase().includes(k));
  }
}

module.exports = SearchByAuthor;
