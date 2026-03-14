package factorymethod;

public class TicketFactory {

    public static Ticket createTicket(String type){

        if(type.equalsIgnoreCase("regular"))
            return new RegularTicket();

        if(type.equalsIgnoreCase("vip"))
            return new VIPTicket();

        if(type.equalsIgnoreCase("student"))
            return new StudentTicket();

        return null;
    }

}