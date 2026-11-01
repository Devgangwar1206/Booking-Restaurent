package com.dev.booking.config;

import com.dev.booking.model.RestaurantTable;
import com.dev.booking.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class TableDataInitializer implements CommandLineRunner {

    private final RestaurantTableRepository tableRepository;

    @Override
    public void run(String... args) {
        if (tableRepository.count() == 0) {
            log.info("Initializing 10 default restaurant tables for interactive floor plan...");

            List<RestaurantTable> tables = List.of(
                RestaurantTable.builder()
                    .tableNumber("T-01")
                    .name("North Terrace A")
                    .capacity(4)
                    .minCapacity(2)
                    .shape("rect")
                    .zone("Main Dining")
                    .positionX(30.0)
                    .positionY(14.0)
                    .width(88.0)
                    .height(46.0)
                    .features("High Ceilings, Garden View")
                    .build(),

                RestaurantTable.builder()
                    .tableNumber("T-02")
                    .name("North Terrace B")
                    .capacity(4)
                    .minCapacity(2)
                    .shape("rect")
                    .zone("Main Dining")
                    .positionX(70.0)
                    .positionY(14.0)
                    .width(88.0)
                    .height(46.0)
                    .features("Spacious, Near Wine Cellar")
                    .build(),

                RestaurantTable.builder()
                    .tableNumber("T-03")
                    .name("West Alcove 1")
                    .capacity(2)
                    .minCapacity(1)
                    .shape("booth")
                    .zone("Wall Alcove")
                    .positionX(14.0)
                    .positionY(34.0)
                    .width(42.0)
                    .height(60.0)
                    .features("Quiet & Romantic, Plush Booth")
                    .build(),

                RestaurantTable.builder()
                    .tableNumber("T-04")
                    .name("West Alcove 2")
                    .capacity(2)
                    .minCapacity(1)
                    .shape("booth")
                    .zone("Wall Alcove")
                    .positionX(14.0)
                    .positionY(52.0)
                    .width(42.0)
                    .height(60.0)
                    .features("Quiet & Romantic, Cozy Ambiance")
                    .build(),

                RestaurantTable.builder()
                    .tableNumber("T-05")
                    .name("West Alcove 3")
                    .capacity(2)
                    .minCapacity(1)
                    .shape("booth")
                    .zone("Wall Alcove")
                    .positionX(14.0)
                    .positionY(70.0)
                    .width(42.0)
                    .height(60.0)
                    .features("Intimate Seating, Warm Lighting")
                    .build(),

                RestaurantTable.builder()
                    .tableNumber("T-06")
                    .name("Chef's Round Table")
                    .capacity(6)
                    .minCapacity(3)
                    .shape("round")
                    .zone("Center Lounge")
                    .positionX(50.0)
                    .positionY(38.0)
                    .width(86.0)
                    .height(86.0)
                    .features("Prime Center View, Padded Armchairs, Most Popular")
                    .build(),

                RestaurantTable.builder()
                    .tableNumber("T-07")
                    .name("Grand Round Table")
                    .capacity(6)
                    .minCapacity(3)
                    .shape("round")
                    .zone("Center Lounge")
                    .positionX(50.0)
                    .positionY(70.0)
                    .width(86.0)
                    .height(86.0)
                    .features("Chandelier Ambiance, Group Dining")
                    .build(),

                RestaurantTable.builder()
                    .tableNumber("T-08")
                    .name("East Alcove 1")
                    .capacity(2)
                    .minCapacity(1)
                    .shape("booth")
                    .zone("Wall Alcove")
                    .positionX(86.0)
                    .positionY(34.0)
                    .width(42.0)
                    .height(60.0)
                    .features("Boutique Booth, Soft Lighting")
                    .build(),

                RestaurantTable.builder()
                    .tableNumber("T-09")
                    .name("East Alcove 2")
                    .capacity(2)
                    .minCapacity(1)
                    .shape("booth")
                    .zone("Wall Alcove")
                    .positionX(86.0)
                    .positionY(52.0)
                    .width(42.0)
                    .height(60.0)
                    .features("Comfortable Seating, Discreet")
                    .build(),

                RestaurantTable.builder()
                    .tableNumber("T-10")
                    .name("East Alcove 3")
                    .capacity(2)
                    .minCapacity(1)
                    .shape("booth")
                    .zone("Wall Alcove")
                    .positionX(86.0)
                    .positionY(70.0)
                    .width(42.0)
                    .height(60.0)
                    .features("Near Bar, Intimate")
                    .build()
            );

            tableRepository.saveAll(tables);
            log.info("Successfully seeded 10 restaurant tables.");
        }
    }
}
