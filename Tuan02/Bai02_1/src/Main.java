import decorator.GiftWrap;
import context.Order;
import decorator.Insurance;
import strategy.ExpressShipping;
import strategy.ShippingStrategy;

public class Main {
    public static void main(String[] args) {
        ShippingStrategy strategy =
                new Insurance(
                        new GiftWrap(
                                new ExpressShipping()));

        Order order = new Order(strategy);

        order.process();
        order.process();
        order.process();
    }
}