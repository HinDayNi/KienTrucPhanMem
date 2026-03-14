import abstractfactory.CinemaFactory;
import abstractfactory.PremiumCinemaFactory;
import abstractfactory.StandardCinemaFactory;
import factorymethod.Ticket;
import factorymethod.TicketFactory;
import singleton.CinemaSystem;

public class Main {
    // Hệ thống có các loại vé:
        //RegularTicket
        //VIPTicket
        //StudentTicket
    // Hệ thống cần:
    //Singleton
        //Quản lý CinemaSystem
        //chỉ có 1 hệ thống quản lý rạp
    //Factory Method
        //Tạo vé:
            //Regular
            //VIP
            //Student
    // Abstract Factory
    //Tạo vé theo loại rạp
        //Ví dụ:
            //StandardCinemaFactory
            //PremiumCinemaFactory
    public static void main(String[] args) {
        System.out.println("Hệ thống đặt vé rạp phim");

        System.out.println("=== Singleton ===");

        CinemaSystem s1 = CinemaSystem.getInstance();
        s1.showInfo();

        CinemaSystem s2 = CinemaSystem.getInstance();

        System.out.println("Same instance: " + (s1 == s2));


        System.out.println("\n=== Factory Method ===");

        Ticket t1 = TicketFactory.createTicket("vip");
        t1.book();

        Ticket t2 = TicketFactory.createTicket("student");
        t2.book();

        System.out.println("\n=== Abstract Factory ===");

        CinemaFactory factory;

        factory = new StandardCinemaFactory();
        Ticket ticket1 = factory.createTicket();
        ticket1.book();

        factory = new PremiumCinemaFactory();
        Ticket ticket2 = factory.createTicket();
        ticket2.book();
        
    }
}