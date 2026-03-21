class SearchContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  execute(books, keyword) {
    return this.strategy.search(books, keyword);
  }
}

module.exports = SearchContext;
