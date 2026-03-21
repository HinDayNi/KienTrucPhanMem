class BorrowDecorator {
  constructor(wrappee) {
    this.wrappee = wrappee;
  }

  getBorrowDays() {
    return this.wrappee.getBorrowDays();
  }

  getFeatures() {
    return this.wrappee.getFeatures();
  }
}

module.exports = BorrowDecorator;
