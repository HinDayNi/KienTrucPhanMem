package decorator;

public class Insurance extends OrderDecorator {

    public Insurance(OrderComponent order) {

        super(order);

    }

    public double cost() {

        return super.cost() + 20;

    }

}