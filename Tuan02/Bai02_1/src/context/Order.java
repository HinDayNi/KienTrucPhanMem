package context;

import state.OrderState;
import state.NewState;
import strategy.ShippingStrategy;

public class Order {

    private OrderState state;
    private ShippingStrategy shippingStrategy;

    public Order(ShippingStrategy shippingStrategy) {
        this.state = new NewState();
        this.shippingStrategy = shippingStrategy;
    }

    public ShippingStrategy getShippingStrategy() {
        return shippingStrategy;
    }

    public void setState(OrderState state) {
        this.state = state;
    }

    public void process() {
        state.handleOrder(this);
    }

}