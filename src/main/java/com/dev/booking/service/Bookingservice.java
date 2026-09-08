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
import com.dev.booking.repository.BookingRepository;

@Service
public class Bookingservice {
	
	@Autowired
	private BookingRepository bookingrepo;
	
	public CreateResponsedto booknewservice(CreateRequestdto bookingdto) {
		
		Booking booking = maptoEntity(bookingdto);
		
		
//		if(emailExists(booking)) {
//			throw new DuplicateResourceException("Booking with email " + booking.getEmail()
//            + " already exists");
//		}
//		
		
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
	
//	
//	private boolean emailExists(Booking booking) {
//        return bookingrepo.existsByEmail(booking.getEmail());
//    }

	
	


	public Booking getbookbyid(Long id) {
		Optional<Booking> getbookingbyid = bookingrepo.findById(id);
		
		if(getbookingbyid.isEmpty()) return null;
		
		return getbookingbyid.get();
	}
	
	public List<CreateResponsedto> getallbookingdto() {

	    List<Booking> bookings = bookingrepo.findAll();

	    List<CreateResponsedto> responseList = new ArrayList<>();

	    for (Booking booking : bookings) {

	        responseList.add(maptodto(booking));

	    }

	    return responseList;
	}
	

	public UpdateResponsedto updatebook(UpdateRequestdto newbooking , Long id) {
		
		Optional<Booking> optionalBooking = bookingrepo.findById(id);
		
		if(optionalBooking.isEmpty()) return null;
		 
		 
		 Booking currbooking = optionalBooking.get();

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





	public Boolean deletebookings(Long id) {
		Optional<Booking> getbooking = bookingrepo.findById(id);
		
		if(getbooking.isEmpty()) return false;
		
		bookingrepo.deleteById(id);
		return true;
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
