package decorator;

import strategy.ShippingStrategy;

public class GiftWrap extends ShippingDecorator {

    public GiftWrap(ShippingStrategy strategy) {
        super(strategy);
    }

    @Override
    public void ship() {
        strategy.ship();
        System.out.println("Thêm dịch vụ gói quà.");
    }
}