package com.dev.booking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dev.booking.entity.Booking;

import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long>{

	boolean existsByEmail(String email);

	Optional<Booking> findByBookingId(String bookingId);

	boolean existsByBookingId(String bookingId);

	void deleteByBookingId(String bookingId);

}
