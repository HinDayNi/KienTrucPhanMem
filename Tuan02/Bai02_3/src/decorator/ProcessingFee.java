package decorator;

import strategy.PaymentStrategy;

public class ProcessingFee extends PaymentDecorator{

    public ProcessingFee(PaymentStrategy strategy) {
        super(strategy);
    }

    @Override
    public double pay(double amount) {
        double result = paymentStrategy.pay(amount);

        System.out.println("Thêm phí xử lý 5%");

        return result + amount * 0.05;
    }
}
