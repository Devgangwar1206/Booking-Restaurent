package com.dev.booking.repository;

import com.dev.booking.model.Reservation;
import com.dev.booking.model.ReservationStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByDateAndTimeSlotAndStatus(String date, String timeSlot, ReservationStatus status);

    Optional<Reservation> findByBookingReference(String bookingReference);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Reservation r WHERE r.table.id = :tableId AND r.date = :date AND r.timeSlot = :timeSlot AND r.status = :status")
    Optional<Reservation> findWithLockForBooking(
        @Param("tableId") Long tableId,
        @Param("date") String date,
        @Param("timeSlot") String timeSlot,
        @Param("status") ReservationStatus status
    );

    boolean existsByTableIdAndDateAndTimeSlotAndStatus(Long tableId, String date, String timeSlot, ReservationStatus status);
}
