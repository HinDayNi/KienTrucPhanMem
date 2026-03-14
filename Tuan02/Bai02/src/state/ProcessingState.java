package state;

import order.Order;

public class ProcessingState implements OrderState {

    @Override
    public void handleOrder(Order order) {
        System.out.println("Đóng gói và vận chuyển");

        order.setState(new DeliveredState());
    }
}