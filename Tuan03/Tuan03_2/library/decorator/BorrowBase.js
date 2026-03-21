class BorrowBase {
  constructor(book, borrowerName) {
    this.book = book;
    this.borrowerName = borrowerName;
    this.baseDays = 14;
  }

  getBorrowDays() {
    return this.baseDays;
  }

  getFeatures() {
    return ['Mượn cơ bản'];
  }
}

module.exports = BorrowBase;
