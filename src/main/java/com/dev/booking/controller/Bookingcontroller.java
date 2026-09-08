package com.dev.booking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.dev.booking.dto.CreateRequestdto;
import com.dev.booking.dto.CreateResponsedto;
import com.dev.booking.dto.UpdateRequestdto;
import com.dev.booking.dto.UpdateResponsedto;
import com.dev.booking.entity.Booking;
import com.dev.booking.service.Bookingservice;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class Bookingcontroller {
	
	@Autowired
	private Bookingservice bookingservice;
	
	@GetMapping
	public String hello() {
		return "hello";
	}
	
	@PostMapping("/create")
	public ResponseEntity<CreateResponsedto> createbooking(@Valid @RequestBody CreateRequestdto bookingdto) {
		
		CreateResponsedto newbooking = 
				bookingservice.booknewservice(bookingdto);
		
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(newbooking);
	}
	
	@GetMapping("/read/{id}")
	public ResponseEntity<Booking> getbooking(@PathVariable Long id) {
		Booking getbooking = bookingservice.getbookbyid(id);
		return ResponseEntity.ok(getbooking);
	}
	
	@GetMapping("/read")
	public ResponseEntity<List<CreateResponsedto>> getAllBookings() {

	    List<CreateResponsedto> bookings =
	            bookingservice.getallbookingdto();

	    return ResponseEntity.ok(bookings);
	}
	
	@PutMapping("/update/{id}")
	public ResponseEntity<UpdateResponsedto> updatebooking(@RequestBody UpdateRequestdto newbooking ,@PathVariable Long id) {
		UpdateResponsedto updatedbooking = bookingservice.updatebook(newbooking , id);
		
		
		return ResponseEntity.ok(updatedbooking);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<String> deletebooking(@PathVariable Long id) {
		Boolean isdeleted = bookingservice.deletebookings(id);
		
		if(isdeleted) {
			return ResponseEntity.ok("Succesfully deleted booking");
		}
		return ResponseEntity.notFound().build();
	}
	
}
