package factorymethod;

public class RegularTicket implements Ticket{

    @Override
    public void book() {
        System.out.println("Regular ticket booked");
    }
}