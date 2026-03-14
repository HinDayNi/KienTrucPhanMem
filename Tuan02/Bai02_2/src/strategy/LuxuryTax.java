package strategy;

public class LuxuryTax implements TaxStrategy {
    @Override
    public double calculateTax(double price) {
        System.out.println("Áp dụng thuế xa xỉ 30%");
        return price * 0.3;
    }
}
