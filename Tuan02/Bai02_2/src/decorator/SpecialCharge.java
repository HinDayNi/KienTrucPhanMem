package decorator;

import strategy.TaxStrategy;

public class SpecialCharge extends TaxDecorator{

    public SpecialCharge(TaxStrategy strategy) {
        super(strategy);
    }

    @Override
    public double calculateTax(double price) {
        double tax = strategy.calculateTax(price);

        System.out.println("Thêm phụ phí đặc biệt 3%");

        return tax + price * 0.03;
    }
}
