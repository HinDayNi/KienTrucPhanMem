package decorator;

import strategy.TaxStrategy;

public abstract class TaxDecorator implements TaxStrategy {
    protected  TaxStrategy strategy;

    public TaxDecorator(TaxStrategy strategy) {
        this.strategy = strategy;
    }
}
