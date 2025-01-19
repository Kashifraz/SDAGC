package fi.tuni.prog3.weatherapp;

import javafx.scene.layout.VBox;
import java.util.TreeMap;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javafx.beans.property.IntegerProperty;
import javafx.beans.property.MapProperty;
import javafx.beans.property.ObjectProperty;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.property.SimpleMapProperty;
import javafx.beans.property.SimpleObjectProperty;
import javafx.collections.FXCollections;
import javafx.geometry.Pos;
import javafx.scene.control.ScrollPane;
import javafx.scene.layout.HBox;

/*
   ChatGPT 3.5 was heavily utilized in learning the usage of JavaFX
   properties and iterating methods until solutions were found. This has enabled
   updating screen content dynamically without recreating all elements.
 */

/**
 * Class for creating the applications forecast view, encapsulating 
 * current, daily and hourly forecasts.
 * 
 * This class manages the forecast view, including current, daily, and hourly 
 * sections, and handles the display of weather forecast data.
 * 
 * @author Kalle Lahtinen
 */
public final class ForecastViewController {
    // Property values that update binded elements when value changes
    
    /**
     * Represents the current weather for today.
     */
    public final ObjectProperty<DailyWeather> todayWeather = 
            new SimpleObjectProperty<>();
    
    /**
     * Represents a map of daily weather forecasts keyed by date.
     */
    public final MapProperty<Instant, DailyWeather> dailyWeathers = 
            new SimpleMapProperty<>(FXCollections.observableHashMap());
    
    /**
     * Represents a map of hourly weather forecasts keyed by time.
     */
    public final MapProperty<Instant, HourlyWeather> hourlyWeathers =
            new SimpleMapProperty<>(FXCollections.observableHashMap());
    
    /**
     * Represents the index of the currently selected day.
     */
    public final IntegerProperty currentDayIndex = new SimpleIntegerProperty(-1);

    /**
     * Represents the list of ObjectProperty instances for displayed days.
     */
    public final List<ObjectProperty<DailyWeather>> displayedDays = new ArrayList<>();
    
    /**
     * Represents the current measurement system.
     */
    public final ObjectProperty<MeasurementSystem> measurementSystem =
        new SimpleObjectProperty<>();; 
    
    /**
     * Represents the current section of the forecast view.
     */
    public ForecastViewCurrentSection currentSection;
    
    /**
     * Represents the daily section of the forecast view.
     */
    public ForecastViewDailySection dailySection;
    
    /**
     * Represents the hourly section of the forecast view.
     */
    public ForecastViewHourlySection hourlySection;
    
    /**
     * Represents the main view of the forecast.
     */
    public final VBox view;

    /**
     * Constructs a ForecastView instance with the given daily and hourly 
     * weather data maps.
     * 
     * @param measurementSystem the MeasurementSystem object keeping track of 
     *        current system of measurement and measurement unit properties.
     * @param newDailyWeathers a map of daily weather data keyed by date.
     * @param newHourlyWeathers a map of hourly weather data keyed by time.
     */
    public ForecastViewController(MeasurementSystem measurementSystem,
                        Map<Instant, DailyWeather> newDailyWeathers, 
                        Map<Instant, HourlyWeather> newHourlyWeathers) {
        // Make a bindable ObjectProperty from current MeasurementSystem
        this.measurementSystem.set(measurementSystem);
        
        // Keep track of which day is selected
        currentDayIndex.addListener((obs, oldIndex, newIndex) -> {
            updateSelectedDayVisual((int) oldIndex, (int) newIndex);
        });
        
        this.currentSection = new ForecastViewCurrentSection();
        this.dailySection = new ForecastViewDailySection();
        this.hourlySection = new ForecastViewHourlySection(this);      
        
        updateDailyWeathers(newDailyWeathers);
        updateHourlyWeathers(newHourlyWeathers);
        
        view = initForecastView();
    }

    /**
     * Initializes and returns the main view containing the weather forecast sections.
     * Currently, only the daily weather section is included, but more sections can be added as needed.
     *
     * @return the combined VBox containing all sections of the weather forecast.
     */
    public VBox initForecastView() {
        VBox current = currentSection.createCurrentWeatherSection(this);
        HBox daily = dailySection.createDailyWeatherSection(this);
        ScrollPane hourly = hourlySection.createHourlyWeatherSection();

        // Combine all sections into a single VBox
        VBox root = new VBox();
        root.getChildren().addAll(current, daily, hourly);
        root.setAlignment(Pos.CENTER);

        return root;
    }
    
    /**
     * Binds the items in {@code displayedDays} to the first five days in {@code dailyWeathers}.
     */
    public void setupDailyWeatherBindings() {
        // Assume we care about the first 5 days
        List<Instant> keys = dailyWeathers.keySet().stream()
                .sorted()
                .limit(5)
                .collect(Collectors.toList());

        // Setup or update ObjectProperties for each day
        for (int i = 0; i < keys.size(); i++) {
            Instant key = keys.get(i);
            if (i < displayedDays.size()) {
                // Update existing property
                displayedDays.get(i).set(dailyWeathers.get(key));
            } else {
                // Add new property
                ObjectProperty<DailyWeather> prop = 
                        new SimpleObjectProperty<>(dailyWeathers.get(key));
                displayedDays.add(prop);
            }
        }

        // Adjust list size in case of fewer entries than before
        if (keys.size() < displayedDays.size()) {
            displayedDays.subList(keys.size(), displayedDays.size()).clear();
        }
    }
    
    /**
     * Updates the highlight styling to the selected day.
     * 
     * @param oldIndex The old selection's index.
     * @param newIndex The new selection's index.
     */
    private void updateSelectedDayVisual(int oldIndex, int newIndex) {
        HBox daysBox = dailySection.getDaysBox();
        if (oldIndex >= 0 && oldIndex < daysBox.getChildren().size()) {
            ((VBox) daysBox.getChildren().get(oldIndex)).getStyleClass().remove("selected-day");
        }
        if (newIndex >= 0 && newIndex < daysBox.getChildren().size()) {
            ((VBox) daysBox.getChildren().get(newIndex)).getStyleClass().add("selected-day");
        }
    }
    
    /**
     * Updates the daily weather data with the given map and 
     * sets the current weather to the earliest date available.
     *
     * @param newDailyWeathers the new map of daily weather data.
     */
    public void updateDailyWeathers(Map<Instant, DailyWeather> newDailyWeathers) {
        dailyWeathers.clear();
        dailyWeathers.putAll(newDailyWeathers);
        if (!dailyWeathers.isEmpty()) {
            todayWeather.set(new TreeMap<>(dailyWeathers).firstEntry().getValue());
        }
        setupDailyWeatherBindings();  // Update bindings for the HBox with daily weather data
    }
    
    /**
     * Updates the hourly weather data with the given map.
     *
     * @param newHourlyWeathers the new map of hourly weather data.
     */
    public void updateHourlyWeathers(Map<Instant, HourlyWeather> newHourlyWeathers) {
        hourlyWeathers.clear();
        hourlyWeathers.putAll(newHourlyWeathers);
        Instant earliestHour = hourlyWeathers.get().keySet().stream()
                             .min(Instant::compareTo)
                             .orElse(null);
        hourlySection.setupHourlyWeatherBindings(earliestHour);
    }
    
    /**
     * Retrieves the primary view of the weather forecast.
     *
     * @return the VBox representing the visual layout of the forecast.
     */
    public VBox getView() {
        return view;
    }
}