package strategy;

public class VATTax implements TaxStrategy{
    @Override
    public double calculateTax(double price) {
        System.out.println("Áp dụng thuế VAT 10%");
        return price * 0.1;
    }
}
