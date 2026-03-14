package decorator;

public abstract class OrderDecorator implements OrderComponent {

    protected OrderComponent order;

    public OrderDecorator(OrderComponent order) {

        this.order = order;

    }

    public double cost() {

        return order.cost();

    }

}