package state;

import context.Order;
import strategy.ShippingStrategy;

public class ProcessingState implements OrderState {

    private ShippingStrategy strategy;

    public ProcessingState(ShippingStrategy strategy) {
        this.strategy = strategy;
    }

    @Override
    public void handleOrder(Order order) {
        System.out.println("Trạng thái: Đang xử lý");
        System.out.println("Đóng gói và vận chuyển...");

        strategy.ship();

        order.setState(new DeliveredState());
    }
}