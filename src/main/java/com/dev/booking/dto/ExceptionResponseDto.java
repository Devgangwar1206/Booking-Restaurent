package com.dev.booking.dto;

import java.time.LocalDateTime;

public class ExceptionResponseDto {
	
	
	private LocalDateTime timestamp;
	private int statuscode;
	private String error;
	private String path;
	private String message;
	
	public ExceptionResponseDto(LocalDateTime timestamp, int statuscode, String error, String message, String path) {
		
		this.timestamp = timestamp;
		this.statuscode = statuscode;
		this.error = error;
		this.message = message;
		this.path = path;
		
	}
	
	public LocalDateTime getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
	public int getStatuscode() {
		return statuscode;
	}
	public void setStatuscode(int statuscode) {
		this.statuscode = statuscode;
	}
	public String getError() {
		return error;
	}
	public void setError(String error) {
		this.error = error;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	

}
