package context;

import state.ProductState;
import strategy.TaxStrategy;

public class Product {
    private double price;
    private ProductState state;
    private TaxStrategy taxStrategy;

    public Product(double price, ProductState state, TaxStrategy taxStrategy) {
        this.price = price;
        this.state = state;
        this.taxStrategy = taxStrategy;
    }

    public double getPrice() {
        return price;
    }

    public  TaxStrategy getTaxStrategy() {
        return taxStrategy;
    }

    public  void calculate() {
        state.handle(this);
    }
}
