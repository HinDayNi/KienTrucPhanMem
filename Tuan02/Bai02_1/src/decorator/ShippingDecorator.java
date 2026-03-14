package decorator;

import strategy.ShippingStrategy;

public abstract class ShippingDecorator implements ShippingStrategy {
    protected ShippingStrategy strategy;

    public ShippingDecorator(ShippingStrategy strategy) {
        this.strategy = strategy;
    }
}
