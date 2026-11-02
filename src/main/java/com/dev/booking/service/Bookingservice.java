package com.dev.booking.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dev.booking.dto.BookingItemDto;
import com.dev.booking.dto.CreateRequestdto;
import com.dev.booking.dto.CreateResponsedto;
import com.dev.booking.dto.UpdateRequestdto;
import com.dev.booking.dto.UpdateResponsedto;
import com.dev.booking.entity.Booking;
import com.dev.booking.entity.BookingItem;
import com.dev.booking.exception.DuplicateResourceException;
import com.dev.booking.exception.ResourceNotFoundException;
import com.dev.booking.repository.BookingRepository;

@Service
public class Bookingservice {
	
	@Autowired
	private BookingRepository bookingrepo;

	@Autowired(required = false)
	private com.dev.booking.repository.ReservationRepository reservationRepository;

	@Autowired(required = false)
	private AvailabilityCacheService availabilityCacheService;
	
	public CreateResponsedto booknewservice(CreateRequestdto bookingdto) {
		
		Booking booking = maptoEntity(bookingdto);
		
		
		if(bookingrepo.existsByEmail(booking.getEmail())) {
			throw new DuplicateResourceException("Booking with email " + booking.getEmail()
            + " already exists");
		}
		
		
		booking.setBookingId(
		        "BK-" + UUID.randomUUID()
		                .toString()
		                .substring(0, 8)
		                .toUpperCase()
		    );

		booking.setCreatedAt(LocalDateTime.now());

		Booking savedBooking = bookingrepo.save(booking);
		    
		return maptodto(savedBooking);
		
	}
	
	

	public CreateResponsedto getbookbyid(Long id) {
		Booking getbookingbyid = bookingrepo
									.findById(id)
									.orElseThrow(() -> 
									new ResourceNotFoundException("Booking with id " + id + " not found"));
									
									
//		if(getbookingbyid.isEmpty()) return null;
		
		return maptodto(getbookingbyid);
	}
	
	
	public List<CreateResponsedto> getallbookingdto() {

	    // Auto-sync any confirmed reservations that don't have a booking record yet
	    if (reservationRepository != null) {
	        try {
	            List<com.dev.booking.model.Reservation> reservations = reservationRepository.findAll();
	            for (com.dev.booking.model.Reservation res : reservations) {
	                if (res.getStatus() == com.dev.booking.model.ReservationStatus.CONFIRMED && res.getBookingReference() != null) {
	                    if (!bookingrepo.existsByBookingId(res.getBookingReference())) {
	                        Booking b = new Booking();
	                        b.setBookingId(res.getBookingReference());
	                        b.setFullName(res.getCustomerName());
	                        b.setEmail(res.getCustomerEmail());
	                        b.setPhone(res.getCustomerPhone());
	                        b.setDate(res.getDate());
	                        b.setTime(res.getTimeSlot());
	                        b.setGuests(res.getGuestCount() != null ? res.getGuestCount() : 1);
	                        if (res.getTable() != null) {
	                            b.setTablePreference("Table " + res.getTable().getTableNumber() + " - " + res.getTable().getName() + " (" + res.getTable().getZone() + ")");
	                        } else {
	                            b.setTablePreference("Reserved Table");
	                        }
	                        b.setSpecialRequest(res.getSpecialRequests() != null ? res.getSpecialRequests() : "");
	                        b.setCreatedAt(res.getCreatedAt() != null ? res.getCreatedAt() : LocalDateTime.now());
	                        b.setOrderPreference("dinein");
	                        b.setPaymentStatus(res.getPaymentStatus() != null ? res.getPaymentStatus() : "PAY_AT_RESTAURANT");
	                        b.setPaymentMethod(res.getPaymentMethod());
	                        b.setTransactionId(res.getTransactionId());
	                        b.setCartItems(new ArrayList<>());
	                        bookingrepo.save(b);
	                    }
	                }
	            }
	        } catch (Exception ignored) {}
	    }

	    List<Booking> bookings = bookingrepo.findAll();

	    List<CreateResponsedto> responseList = new ArrayList<>();

	    for (Booking booking : bookings) {
	        // Backfill payment fields for existing bookings if missing
	        if (booking.getPaymentStatus() == null && reservationRepository != null && booking.getBookingId() != null) {
	            try {
	                reservationRepository.findByBookingReference(booking.getBookingId()).ifPresent(res -> {
	                    booking.setPaymentStatus(res.getPaymentStatus() != null ? res.getPaymentStatus() : "PAY_AT_RESTAURANT");
	                    booking.setPaymentMethod(res.getPaymentMethod());
	                    booking.setTransactionId(res.getTransactionId());
	                    if (res.getBillBreakdownJson() != null && !res.getBillBreakdownJson().isBlank()) {
	                        try {
	                            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
	                            com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(res.getBillBreakdownJson());
	                            if (root.has("total")) {
	                                booking.setTotalAmount(root.get("total").asDouble());
	                            }
	                        } catch (Exception ignored) {}
	                    }
	                    if (booking.getTotalAmount() == null && booking.getCartItems() != null) {
	                        double sum = 0.0;
	                        for (BookingItem bi : booking.getCartItems()) {
	                            sum += bi.getPrice() * bi.getQuantity();
	                        }
	                        booking.setTotalAmount(sum);
	                    }
	                    bookingrepo.save(booking);
	                });
	            } catch (Exception ignored) {}
	        }

	        responseList.add(maptodto(booking));

	    }

	    return responseList;
	}
	

	public UpdateResponsedto updatebook(UpdateRequestdto newbooking , Long id) {
		
		Booking optionalBooking = bookingrepo.findById(id)
												.orElseThrow(() ->
													new ResourceNotFoundException("Student with id " + id + " not found"));
		
//		if(optionalBooking.isEmpty()) return null;
		
		 Booking currbooking = optionalBooking;

		    currbooking.setFullName(newbooking.getFullName());
		    currbooking.setEmail(newbooking.getEmail());
		    currbooking.setPhone(newbooking.getPhone());
		    currbooking.setDate(newbooking.getDate());
		    currbooking.setTime(newbooking.getTime());
		    currbooking.setGuests(newbooking.getGuests());
		    currbooking.setTablePreference(newbooking.getTablePreference());
		    currbooking.setSpecialRequest(newbooking.getSpecialRequest());
		    currbooking.setOrderPreference(newbooking.getOrderPreference());
		    
		    bookingrepo.save(currbooking);
		    
		    UpdateResponsedto updatedResponsedto =maptoUpdatedResponsedto(currbooking);
		    return updatedResponsedto;
	}
	
	

	public Boolean deletebookings(Long id) {
		Booking getbooking = bookingrepo
									.findById(id)
									.orElseThrow(() -> 
													new ResourceNotFoundException("Booking with id " + id + " not found"));
		
		String bookingId = getbooking.getBookingId();
		if (bookingId != null && !bookingId.isBlank() && reservationRepository != null) {
			try {
				reservationRepository.findByBookingReference(bookingId).ifPresent(res -> {
					res.setStatus(com.dev.booking.model.ReservationStatus.CANCELLED);
					reservationRepository.save(res);
					if (availabilityCacheService != null) {
						availabilityCacheService.evictAvailability(res.getDate(), res.getTimeSlot());
					}
				});
			} catch (Exception ignored) {}
		}
		
		bookingrepo.deleteById(id);
		return true;
	}
	


	private UpdateResponsedto maptoUpdatedResponsedto(Booking currbooking) {
		
		UpdateResponsedto updatedresponsedto = new UpdateResponsedto();
		
		updatedresponsedto.setId(currbooking.getId());
	    updatedresponsedto.setFullName(currbooking.getFullName());
	    updatedresponsedto.setEmail(currbooking.getEmail());
	    updatedresponsedto.setPhone(currbooking.getPhone());
	    updatedresponsedto.setDate(currbooking.getDate());
	    updatedresponsedto.setTime(currbooking.getTime());
	    updatedresponsedto.setGuests(currbooking.getGuests());
	    updatedresponsedto.setTablePreference(currbooking.getTablePreference());
	    updatedresponsedto.setSpecialRequest(currbooking.getSpecialRequest());
	    updatedresponsedto.setOrderPreference(currbooking.getOrderPreference());
	    updatedresponsedto.setBookingId(currbooking.getBookingId());
	    updatedresponsedto.setCreatedAt(currbooking.getCreatedAt());
		
		return updatedresponsedto;
		
	}
	
	
	
	private CreateResponsedto maptodto(Booking savedBooking) {

	    CreateResponsedto responseDto = new CreateResponsedto();

	    responseDto.setFullName(savedBooking.getFullName());
	    responseDto.setId(savedBooking.getId());
	    responseDto.setEmail(savedBooking.getEmail());
	    responseDto.setPhone(savedBooking.getPhone());
	    responseDto.setDate(savedBooking.getDate());
	    responseDto.setTime(savedBooking.getTime());
	    responseDto.setGuests(savedBooking.getGuests());
	    responseDto.setTablePreference(savedBooking.getTablePreference());
	    responseDto.setSpecialRequest(savedBooking.getSpecialRequest());
	    responseDto.setOrderPreference(savedBooking.getOrderPreference());
	    responseDto.setBookingId(savedBooking.getBookingId());
	    responseDto.setCreatedAt(savedBooking.getCreatedAt());

	    // PRE-ORDER ITEMS
	    List<BookingItemDto> itemDtos = new ArrayList<>();

	    if (savedBooking.getCartItems() != null) {

	        for (BookingItem item : savedBooking.getCartItems()) {

	            BookingItemDto itemDto = new BookingItemDto();

	            itemDto.setId(item.getId());
	            itemDto.setMenuItemId(item.getMenuItemId());
	            itemDto.setName(item.getName());
	            itemDto.setPrice(item.getPrice());
	            itemDto.setQuantity(item.getQuantity());

	            itemDtos.add(itemDto);
	        }
	    }

	    responseDto.setCartItems(itemDtos);
	    responseDto.setPaymentStatus(savedBooking.getPaymentStatus());
	    responseDto.setPaymentMethod(savedBooking.getPaymentMethod());
	    responseDto.setTransactionId(savedBooking.getTransactionId());
	    responseDto.setTotalAmount(savedBooking.getTotalAmount());

	    return responseDto;
	}


	private Booking maptoEntity(CreateRequestdto bookingdto) {

	    Booking booking = new Booking();

	    booking.setFullName(bookingdto.getFullName());
	    booking.setEmail(bookingdto.getEmail());
	    booking.setPhone(bookingdto.getPhone());
	    booking.setDate(bookingdto.getDate());
	    booking.setTime(bookingdto.getTime());
	    booking.setGuests(bookingdto.getGuests());
	    booking.setTablePreference(bookingdto.getTablePreference());
	    booking.setSpecialRequest(bookingdto.getSpecialRequest());
	    booking.setOrderPreference(bookingdto.getOrderPreference());

	    // PRE-ORDER ITEMS
	    if (bookingdto.getCartItems() != null &&
	        !bookingdto.getCartItems().isEmpty()) {

	        List<BookingItem> items = new ArrayList<>();

	        for (BookingItemDto itemDto : bookingdto.getCartItems()) {

	            BookingItem item = new BookingItem();

	            item.setMenuItemId(itemDto.getMenuItemId());
	            item.setName(itemDto.getName());
	            item.setPrice(itemDto.getPrice());
	            item.setQuantity(itemDto.getQuantity());

	            // IMPORTANT
	            item.setBooking(booking);

	            items.add(item);
	        }

	        booking.setCartItems(items);
	    }

	    return booking;
	}
	
	
	
	

}
