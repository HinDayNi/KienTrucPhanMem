package state;

import order.Order;

public interface OrderState {
    void handleOrder(Order order);
}
