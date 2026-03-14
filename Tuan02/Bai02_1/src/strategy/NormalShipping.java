package strategy;

public class NormalShipping implements ShippingStrategy {

    @Override
    public void ship() {
        System.out.println("Giao hàng bình thường.");
    }
}