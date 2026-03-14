package state;

import context.Payment;

public class PendingState implements PaymentState{
    @Override
    public void handle(Payment payment) {

        System.out.println("Trạng thái: Đang chờ thanh toán");

        double result =
                payment.getStrategy().pay(payment.getAmount());

        System.out.println("Tổng tiền cần thanh toán: " + result);

        payment.setState(new CompletedState());
    }
}
