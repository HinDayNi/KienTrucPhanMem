package state;

import order.Order;

public class NewState implements OrderState {


    @Override
    public void handleOrder(Order order) {
        System.out.println("Kiểm tra thông tin đơn hàng");

        order.setState(new ProcessingState());
    }
}