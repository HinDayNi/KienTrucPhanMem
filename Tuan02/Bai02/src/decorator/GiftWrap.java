package decorator;

public class GiftWrap extends OrderDecorator {

    public GiftWrap(OrderComponent order) {

        super(order);

    }

    public double cost() {

        return super.cost() + 10;

    }

}