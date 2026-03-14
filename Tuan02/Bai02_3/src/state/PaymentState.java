package state;

import context.Payment;

public interface PaymentState {
    void handle(Payment payment);
}
