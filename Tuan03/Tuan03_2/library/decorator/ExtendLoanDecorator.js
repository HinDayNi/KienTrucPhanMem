const BorrowDecorator = require('./BorrowDecorator');

class ExtendLoanDecorator extends BorrowDecorator {
  constructor(wrappee, extraDays) {
    super(wrappee);
    this.extraDays = Number(extraDays) || 0;
  }

  getBorrowDays() {
    return super.getBorrowDays() + this.extraDays;
  }

  getFeatures() {
    return super.getFeatures().concat(`Gia hạn thêm ${this.extraDays} ngay`);
  }
}

module.exports = ExtendLoanDecorator;
