package context;

import state.PaymentState;
import strategy.PaymentStrategy;

public class Payment {
    private double amount;
    private PaymentStrategy strategy;
    private PaymentState state;

    public Payment(double amount, PaymentStrategy strategy, PaymentState state) {
        this.amount = amount;
        this.strategy = strategy;
        this.state = state;
    }

    public double getAmount() {
        return amount;
    }

    public PaymentStrategy getStrategy() {
        return strategy;
    }

    public void setState(PaymentState state) {
        this.state = state;
    }

    public void process() {
        state.handle(this);
    }
}
