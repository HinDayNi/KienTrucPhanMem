package state;

import context.Product;

public class NormalProductState  implements ProductState{
    @Override
    public void handle(Product product) {
        System.out.println("Sản phẩm thông thường");

        double tax = product.getTaxStrategy().calculateTax(product.getPrice());

        System.out.println("Tổng thuế: " + tax);
    }
}
