package decorator;

import strategy.TaxStrategy;

public class EnvironmentalTax extends TaxDecorator{

    public EnvironmentalTax(TaxStrategy strategy) {
        super(strategy);
    }

    @Override
    public double calculateTax(double price) {
        double tax = strategy.calculateTax(price);

        System.out.println("Thêm thuế môi trường 5%");
        return tax + price * 0.05;
    }
}
