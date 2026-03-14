package decorator;

import strategy.ShippingStrategy;

public class Insurance extends ShippingDecorator{

    public Insurance(ShippingStrategy strategy) {
        super(strategy);
    }

    @Override
    public void ship() {
        strategy.ship();
        System.out.println("Thêm bảo hiểm đơn hàng.");
    }
}
