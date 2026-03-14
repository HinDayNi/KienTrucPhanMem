package abstractfactory;

import factorymethod.*;

public class PremiumCinemaFactory implements CinemaFactory{
    @Override
    public Ticket createTicket() {
        return new VIPTicket();
    }
}