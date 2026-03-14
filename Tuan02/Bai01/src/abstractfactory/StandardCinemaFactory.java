package abstractfactory;

import factorymethod.*;

public class StandardCinemaFactory implements CinemaFactory{
    @Override
    public Ticket createTicket() {
        return new RegularTicket();
    }
}