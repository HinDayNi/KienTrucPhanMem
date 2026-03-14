package factorymethod;

public class StudentTicket implements Ticket{

    @Override
    public void book() {
        System.out.println("Student ticket booked");
    }
}