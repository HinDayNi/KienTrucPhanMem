package factorymethod;

public class VIPTicket implements Ticket{

    @Override
    public void book() {
        System.out.println("VIP ticket booked");
    }
}