class SearchByGenre {
  search(books, keyword) {
    const k = keyword.toLowerCase();
    return books.filter((book) => book.genre.toLowerCase().includes(k));
  }
}

module.exports = SearchByGenre;
