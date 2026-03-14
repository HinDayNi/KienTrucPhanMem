package state;

import order.Order;

public class CancelledState implements OrderState {

    @Override
    public void handleOrder(Order order) {
        System.out.println("Đơn hàng đã bị hủy và hoàn tiền");
    }
}