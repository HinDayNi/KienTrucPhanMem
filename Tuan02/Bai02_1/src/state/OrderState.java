package state;

import context.Order;

public interface OrderState {
    void handleOrder(Order order);
}
