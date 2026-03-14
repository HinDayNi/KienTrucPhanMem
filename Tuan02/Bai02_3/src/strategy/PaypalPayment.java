package strategy;

public class PaypalPayment implements PaymentStrategy{
    @Override
    public double pay(double amount) {
        System.out.println("Thanh toán bằng PayPal");
        return amount;
    }
}
