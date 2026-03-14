package strategy;

public class CreditCardPayment implements PaymentStrategy{
    @Override
    public double pay(double amount) {
        System.out.println("Thanh toán bằng thẻ tín dụng");
        return amount;
    }
}
