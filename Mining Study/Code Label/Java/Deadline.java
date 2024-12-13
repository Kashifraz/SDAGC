package seedu.address.model.task;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Pattern;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Represents the Deadline of the task.
 * Guarantees: details are present and not null, immutable.
 */
public class Deadline implements Comparable<Deadline> {

    public static final String MESSAGE_CONSTRAINTS =
            "Deadlines need to be in the format [ DD(- OR /)MM(- OR /)YYYY HHMM OR HH(: OR /)MM ] "
                    + "OR [ DD(- OR /)MM(- OR /)YYYY ].";
    public static final String INVALID_DATE = "Please input a valid date/time!";

    //@@author asdfghjkxd-reused
    // Regex strings are reused with some modification from ChatGPT, and is also built and tested with
    // https://regex101.com/.
    /**
     * Regex for recognising DateTime inputs. The regex pattern below are adapted from ChatGPT,
     * modified to better meet the requirements of TaskWise.
     * <p>
     * <a href="https://regex101.com/">This</a> was used to build and test the new regex patterns.
     */
    public static final String DATETIME_REGEX = "^(0?[1-9]|[12][0-9]|3[01])(\\/|-)(0?[1-9]|1[0-2])(\\/|-)\\d{4} "
            + "([01]?[0-9]|2[0-3])?(-|:)?[0-5][0-9]$";

    /**
     * Regex for recognising Date inputs. The regex pattern below are adapted from ChatGPT,
     * modified to better meet the requirements of TaskWise.
     * <p>
     * <a href="https://regex101.com/">This</a> was used to build and test the new regex patterns.
     */
    public static final String DATE_REGEX = "^(0?[1-9]|[12][0-9]|3[01])(\\/|-)(0?[1-9]|1[0-2])(\\/|-)\\d{4}";
    //@@ author

    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final LocalDateTime details;
    private final boolean isNull;

    /**
     * Constructor used by Jackson to help create an instance of {@code Deadline}
     *
     * @param localDateTime {@code LocalDateTime} object
     * @param isNull boolean representing if the Deadline is indeed a null deadline (infinitely late deadline)
     */
    public Deadline(@JsonProperty("details") LocalDateTime localDateTime, @JsonProperty("isNull") boolean isNull) {
        this.isNull = isNull;
        this.details = localDateTime;
    }

    /**
     * Constructs a {@code Deadline} with the current date and time.
     */
    private Deadline(boolean isNull, LocalDateTime deadline) {
        this.isNull = isNull;
        this.details = deadline;

        assert deadline != null;
    }

    public static Deadline of(LocalDateTime localDateTime) {
        return new Deadline(false, localDateTime);
    }

    public static Deadline ofNull() {
        return new Deadline(true, LocalDateTime.MAX);
    }

    public static Deadline now() {
        return new Deadline(false, LocalDateTime.now());
    }

    /**
     * Checks if the input date is of the correct Date format. A Date format is specified by only the date
     * and does not include the time.
     *
     * @param date Input date
     * @return true if the String is a valid Date format, else false
     */
    public static boolean isValidDate(String date) {
        return Pattern.matches(DATE_REGEX, date);
    }

    /**
     * Checks if the input date is of the correct DateTime format. A DateTime format specifies both the date
     * and the time.
     *
     * @param datetime Input datetime
     * @return true if the String is a valid DateTime format, else false
     */
    public static boolean isValidDateTime(String datetime) {
        return Pattern.matches(DATETIME_REGEX, datetime);
    }

    @Override
    public boolean equals(Object other) {
        if (other == this) {
            return true;
        }

        if (!(other instanceof Deadline)) {
            return false;
        }

        Deadline otherStatus = (Deadline) other;

        return this.details.equals(otherStatus.details) && this.isNull == otherStatus.isNull;
    }

    /**
     * Format state as text for viewing.
     */
    public String toString() {
        if (this.isNull) {
            return "No Deadline";
        }

        return details.format(formatter);
    }

    /**
     * Compares two {@code Deadline} objects. Tasks with no deadlines are always assumed to have an infinitely
     * late deadline, and hence will always be greater than a task with deadline.
     *
     * @param o the object to be compared.
     * @return 0 if both {@code Deadline} objects are equal, 1 if this {@code Deadline} object is greater than
     *     the other, and -1 if this {@code Deadline} object is smaller than the other
     */
    @Override
    public int compareTo(Deadline o) {
        if (this.isNull && !o.isNull) {
            return 1;
        } else if (o.isNull && !this.isNull) {
            return -1;
        }

        return this.details.compareTo(o.details);

    }
}
