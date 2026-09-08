package com.dev.booking.dto;

import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

// DTO = Data Transfer Object

public class CreateRequestdto {

    @NotBlank(message = "NAME IS REQUIRED")
    private String fullName;

    @NotBlank(message = "EMAIL IS REQUIRED")
    @Email(message = "INVALID EMAIL")
    private String email;

    @NotBlank(message = "PHONE IS REQUIRED")
    private String phone;

    @NotBlank(message = "date not be blank")
    private String date;

    private String time;

    @Min(value = 1, message = "Guests must be at least 1")
    private int guests;

    private String tablePreference;

    private String specialRequest;

    private String orderPreference;

    // PRE-ORDER ITEMS
    private List<BookingItemDto> cartItems;


    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public int getGuests() {
        return guests;
    }

    public void setGuests(int guests) {
        this.guests = guests;
    }

    public String getTablePreference() {
        return tablePreference;
    }

    public void setTablePreference(String tablePreference) {
        this.tablePreference = tablePreference;
    }

    public String getSpecialRequest() {
        return specialRequest;
    }

    public void setSpecialRequest(String specialRequest) {
        this.specialRequest = specialRequest;
    }

    public String getOrderPreference() {
        return orderPreference;
    }

    public void setOrderPreference(String orderPreference) {
        this.orderPreference = orderPreference;
    }

    public List<BookingItemDto> getCartItems() {
        return cartItems;
    }

    public void setCartItems(List<BookingItemDto> cartItems) {
        this.cartItems = cartItems;
    }
}