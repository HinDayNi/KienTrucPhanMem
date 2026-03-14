package state;

import context.Order;

public class DeliveredState implements OrderState {

    @Override
    public void handleOrder(Order order) {
        System.out.println("Trạng thái: Đã giao");
        System.out.println("Đơn hàng đã được giao thành công.");
    }
}