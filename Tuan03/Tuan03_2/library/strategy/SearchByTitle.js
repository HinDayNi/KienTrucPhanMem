class SearchByTitle {
  search(books, keyword) {
    const k = keyword.toLowerCase();
    return books.filter((book) => book.title.toLowerCase().includes(k));
  }
}

module.exports = SearchByTitle;
