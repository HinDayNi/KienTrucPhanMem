import decorator.BasicOrder;
import decorator.GiftWrap;
import decorator.Insurance;
import decorator.OrderComponent;
import order.Order;
import strategy.ExpressShipping;
import strategy.ShippingStrategy;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== STATE PATTERN ===");

        Order order = new Order();

        order.process();
        order.process();
        order.process();


        System.out.println("\n=== STRATEGY PATTERN ===");

        ShippingStrategy shipping = new ExpressShipping();

        shipping.ship();


        System.out.println("\n=== DECORATOR PATTERN ===");

        OrderComponent myOrder = new BasicOrder();

        myOrder = new GiftWrap(myOrder);
        myOrder = new Insurance(myOrder);

        System.out.println("Total cost: " + myOrder.cost());
    }
}