import context.Product;
import decorator.EnvironmentalTax;
import decorator.ServiceFee;
import state.LuxuryProductState;
import strategy.TaxStrategy;
import strategy.VATTax;

public class Main {
    public static void main(String[] args) {

        TaxStrategy strategy =
                new ServiceFee(
                        new EnvironmentalTax(
                                new VATTax()));

        Product product =
                new Product(
                        1000,
                        new LuxuryProductState(),
                        strategy);

        product.calculate();
    }
}