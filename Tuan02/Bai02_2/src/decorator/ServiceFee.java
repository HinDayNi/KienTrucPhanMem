package decorator;

import strategy.TaxStrategy;

public class ServiceFee  extends TaxDecorator{

    public ServiceFee(TaxStrategy strategy) {
        super(strategy);
    }

    @Override
    public double calculateTax(double price) {
        double tax = strategy.calculateTax(price);

        System.out.println("Thêm phí dịch vụ 2%");
        return tax + price * 0.02;
    }
}
