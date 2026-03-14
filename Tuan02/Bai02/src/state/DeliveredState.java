package state;

import order.Order;

public class DeliveredState implements OrderState {


    @Override
    public void handleOrder(Order order) {
        System.out.println("Đơn hàng đã giao thành công");
    }
}