package decorator;

import strategy.PaymentStrategy;

public class Discount extends PaymentDecorator{

    public Discount(PaymentStrategy strategy) {
        super(strategy);
    }

    @Override
    public double pay(double amount) {
        double result = paymentStrategy.pay(amount);

        System.out.println("Áp dụng mã giảm giá 10%");

        return result - amount * 0.1;
    }
}
