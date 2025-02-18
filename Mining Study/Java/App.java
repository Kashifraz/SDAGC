import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Calendar;
public class App {
    public static void main(String[] args) throws Exception {
        //skipped exception handling for this solution and provided default values
        //did not use user supplied values, saw it unnecessary.
        String date = getDay(2019, 03, 25);
        System.out.println("on 2019-03-25 it was " + date);


        
    }

    public static String getDay(int year, int month, int day) {
        LocalDate date = LocalDate.of(year, month, day);
        return date.getDayOfWeek().name();
    }


//this function makes the code to be clean - I did't want to delete my practice 
    public static void helper() {
        /*  
        * 
        * This solution was inpired by linkedin learn java 8 for professionals course
        * ChatGpt was used ONLY for checking how to convert the DayofWeek enum into a string
        *
        * dates are now managed by the java.time; package as opposed to the .calander package
        * I used LocalDates instead of calendar because calender are old and LocalDate are easier
        * to work with

        * working with dates using java 8 - for practicing and understanding

        LocalDate ld = LocalDate.now();
        LocalDate ld2 = LocalDate.of(2019, 03, 25);
        LocalTime lt = LocalTime.now();
        String today_date = ld.getDayOfWeek().name();
        System.out.println(ld);
        System.out.println("It is " + ld2.getDayOfWeek());
        System.out.println("it is " + ld.getDayOfWeek());
        System.out.println("variable day is:" + today_date);
        String customDate = getDay(2019, 03, 25);
        System.out.println(customDate);
*/
    }
}
