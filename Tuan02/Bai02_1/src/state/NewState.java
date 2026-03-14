package state;

import context.Order;

public class NewState implements OrderState {


    @Override
    public void handleOrder(Order order) {
        System.out.println("Trạng thái: Mới tạo");
        System.out.println("Kiểm tra thông tin đơn hàng...");

        order.setState(new ProcessingState(order.getShippingStrategy()));
    }
}