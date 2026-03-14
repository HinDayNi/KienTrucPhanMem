package state;

import context.Product;

public class ImportedProductState implements ProductState{
    @Override
    public void handle(Product product) {
        System.out.println("Sản phẩm nhập khẩu");

        double tax = product.getTaxStrategy().calculateTax(product.getPrice());

        System.out.println("Tổng thuế phải trả: " + tax);
    }
}
