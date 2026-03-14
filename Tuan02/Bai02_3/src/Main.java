import context.Payment;
import decorator.Discount;
import decorator.ProcessingFee;
import state.PendingState;
import strategy.CreditCardPayment;
import strategy.PaymentStrategy;

public class Main {
    public static void main(String[] args) {

        PaymentStrategy strategy =
                new Discount(
                        new ProcessingFee(
                                new CreditCardPayment()));

        Payment payment =
                new Payment(
                        1000,
                        strategy,
                        new PendingState());

        payment.process();
        payment.process();
    }
}