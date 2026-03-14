package singleton;

public class CinemaSystem {

    private static CinemaSystem instance;

    private CinemaSystem() {
        System.out.println("Cinema System started");
    }

    public static CinemaSystem getInstance() {

        if(instance == null){
            instance = new CinemaSystem();
        }

        return instance;
    }

    public void showInfo(){
        System.out.println("Cinema booking system");
    }
}