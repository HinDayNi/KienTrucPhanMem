const BorrowDecorator = require('./BorrowDecorator');

class SpecialEditionDecorator extends BorrowDecorator {
  constructor(wrappee, editionName) {
    super(wrappee);
    this.editionName = editionName || 'Phien ban dac biet';
  }

  getFeatures() {
    return super.getFeatures().concat(`Yeu cau ${this.editionName}`);
  }
}

module.exports = SpecialEditionDecorator;
