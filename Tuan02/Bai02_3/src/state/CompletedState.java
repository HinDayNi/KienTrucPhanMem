package state;

import context.Payment;

public class CompletedState implements PaymentState{
    @Override
    public void handle(Payment payment) {
        System.out.println("Thanh toán đã hoàn tất");
    }
}
