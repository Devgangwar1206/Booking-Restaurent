package com.dev.booking.service;

import com.dev.booking.dto.ReservationRequest;
import com.dev.booking.entity.Booking;
import com.dev.booking.entity.BookingItem;
import com.dev.booking.model.Reservation;
import com.dev.booking.model.ReservationStatus;
import com.dev.booking.model.RestaurantTable;
import com.dev.booking.repository.BookingRepository;
import com.dev.booking.repository.ReservationRepository;
import com.dev.booking.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RestaurantTableRepository tableRepository;
    private final TableHoldService tableHoldService;
    private final AvailabilityCacheService availabilityCacheService;
    private final BookingRepository bookingRepository;

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public Reservation confirmReservation(ReservationRequest request) {
        // 1. Fetch table
        RestaurantTable table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new IllegalArgumentException("Table not found with id: " + request.getTableId()));

        // 2. Capacity Check - allow large party arrangement
        if (request.getGuestCount() > table.getCapacity()) {
            log.info("Large party of {} for table {} (capacity {}). Special seating will be arranged.",
                    request.getGuestCount(), table.getTableNumber(), table.getCapacity());
        }

        // 3. Hold Validation (if holdToken was provided)
        if (request.getHoldToken() != null && !request.getHoldToken().isBlank()) {
            tableHoldService.validateHold(
                    request.getHoldToken(),
                    request.getTableId(),
                    request.getDate(),
                    request.getTimeSlot(),
                    request.getSessionId()
            ).ifPresent(hold -> log.info("Validated hold token {}", request.getHoldToken()));
        }

        // 4. Database Concurrency Check (Double Booking Prevention)
        boolean alreadyBooked = reservationRepository.existsByTableIdAndDateAndTimeSlotAndStatus(
                request.getTableId(),
                request.getDate(),
                request.getTimeSlot(),
                ReservationStatus.CONFIRMED
        );

        if (alreadyBooked) {
            throw new IllegalStateException("Table is already booked and confirmed for this date and time slot.");
        }

        // 5. Serialize cartItems and billBreakdown if present
        String cartItemsJson = request.getCartItems() != null ? String.valueOf(request.getCartItems()) : null;
        String billBreakdownJson = request.getBillBreakdown() != null ? String.valueOf(request.getBillBreakdown()) : null;

        // 6. Create Confirmed Reservation
        String ref = "BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Reservation reservation = Reservation.builder()
                .bookingReference(ref)
                .table(table)
                .date(request.getDate())
                .timeSlot(request.getTimeSlot())
                .guestCount(request.getGuestCount())
                .customerName(request.getCustomerName())
                .customerEmail(request.getCustomerEmail())
                .customerPhone(request.getCustomerPhone())
                .specialRequests(request.getSpecialRequests())
                .status(ReservationStatus.CONFIRMED)
                .holdTokenUsed(request.getHoldToken())
                .paymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : "PAY_AT_RESTAURANT")
                .paymentMethod(request.getPaymentMethod())
                .transactionId(request.getTransactionId())
                .cartItemsJson(cartItemsJson)
                .billBreakdownJson(billBreakdownJson)
                .createdAt(LocalDateTime.now())
                .build();

        Reservation saved = reservationRepository.save(reservation);

        // 6b. Also Save to Booking entity so Admin Dashboard immediately displays this booking
        try {
            Booking booking = new Booking();
            booking.setBookingId(ref);
            booking.setFullName(request.getCustomerName());
            booking.setEmail(request.getCustomerEmail());
            booking.setPhone(request.getCustomerPhone());
            booking.setDate(request.getDate());
            booking.setTime(request.getTimeSlot());
            booking.setGuests(request.getGuestCount() != null ? request.getGuestCount() : 1);
            booking.setTablePreference("Table " + table.getTableNumber() + " - " + table.getName() + " (" + table.getZone() + ")");
            booking.setSpecialRequest(request.getSpecialRequests() != null ? request.getSpecialRequests() : "");
            booking.setCreatedAt(LocalDateTime.now());

            List<BookingItem> bookingItems = new ArrayList<>();
            if (request.getCartItems() instanceof List<?> list) {
                for (Object obj : list) {
                    if (obj instanceof Map<?, ?> map) {
                        BookingItem item = new BookingItem();
                        item.setBooking(booking);

                        Object nameObj = map.get("name");
                        if (nameObj != null) item.setName(nameObj.toString());

                        Object idObj = map.get("id");
                        if (idObj instanceof Number n) {
                            item.setMenuItemId(n.longValue());
                        } else if (idObj != null) {
                            try {
                                item.setMenuItemId(Long.parseLong(idObj.toString().replaceAll("\\D", "")));
                            } catch (Exception ignored) {}
                        }

                        Object priceObj = map.get("price");
                        if (priceObj instanceof Number n) {
                            item.setPrice(n.doubleValue());
                        } else if (priceObj != null) {
                            try {
                                item.setPrice(Double.parseDouble(priceObj.toString()));
                            } catch (Exception ignored) {}
                        }

                        Object qtyObj = map.get("quantity");
                        if (qtyObj instanceof Number n) {
                            item.setQuantity(n.intValue());
                        } else if (qtyObj != null) {
                            try {
                                item.setQuantity(Integer.parseInt(qtyObj.toString()));
                            } catch (Exception ignored) {}
                        } else {
                            item.setQuantity(1);
                        }
                        bookingItems.add(item);
                    }
                }
            }
            booking.setCartItems(bookingItems);
            booking.setOrderPreference(!bookingItems.isEmpty() ? "preorder" : "dinein");
            booking.setPaymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : "PAY_AT_RESTAURANT");
            booking.setPaymentMethod(request.getPaymentMethod());
            booking.setTransactionId(request.getTransactionId());

            Double totalAmt = null;
            if (request.getBillBreakdown() instanceof Map<?, ?> billMap) {
                Object totalObj = billMap.get("total");
                if (totalObj instanceof Number n) {
                    totalAmt = n.doubleValue();
                } else if (totalObj != null) {
                    try { totalAmt = Double.parseDouble(totalObj.toString()); } catch (Exception ignored) {}
                }
            }
            if (totalAmt == null && !bookingItems.isEmpty()) {
                double sum = 0.0;
                for (BookingItem bi : bookingItems) {
                    sum += bi.getPrice() * bi.getQuantity();
                }
                if (sum > 0) totalAmt = sum;
            }
            booking.setTotalAmount(totalAmt);

            bookingRepository.save(booking);
            log.info("Saved reservation to Admin Booking table with ID: {}", ref);
        } catch (Exception e) {
            log.error("Failed to sync reservation into Admin Booking entity: {}", e.getMessage(), e);
        }

        // 7. Release Hold in Redis/In-Memory
        if (request.getHoldToken() != null && !request.getHoldToken().isBlank()) {
            tableHoldService.releaseHold(request.getHoldToken());
        }

        // 8. Invalidate Availability Cache
        availabilityCacheService.evictAvailability(request.getDate(), request.getTimeSlot());

        log.info("Reservation confirmed: ref={} for table={} on {} at {}",
                saved.getBookingReference(), table.getTableNumber(), request.getDate(), request.getTimeSlot());

        return saved;
    }

    public Optional<Reservation> getByReference(String reference) {
        return reservationRepository.findByBookingReference(reference);
    }

    @Transactional
    public void resetAllReservations() {
        reservationRepository.deleteAll();
        bookingRepository.deleteAll();
        log.info("All reservations and bookings have been cleared.");
    }
}
