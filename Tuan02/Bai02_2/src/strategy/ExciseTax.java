package strategy;

public class ExciseTax implements TaxStrategy{
    @Override
    public double calculateTax(double price) {
        System.out.println("Áp dụng thuế tiêu thụ 20%");
        return price * 0.2;
    }
}
