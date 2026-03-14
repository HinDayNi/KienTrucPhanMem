package state;

import context.Product;

public interface ProductState {
    void handle(Product product);
}
