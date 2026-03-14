package state;

import context.Product;

public class LuxuryProductState implements ProductState{
    @Override
    public void handle(Product product) {
        System.out.println("Sản phẩm xa xỉ");

        double tax = product.getTaxStrategy().calculateTax(product.getPrice());

        System.out.println("Tổng thuế: " + tax);
    }
}
