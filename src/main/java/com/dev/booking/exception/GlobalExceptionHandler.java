package com.dev.booking.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.dev.booking.dto.ExceptionResponseDto;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(DuplicateResourceException.class)
	public ResponseEntity<ExceptionResponseDto> handleduplicateresource(DuplicateResourceException ex, HttpServletRequest request){
		
		ExceptionResponseDto response = new ExceptionResponseDto(
				LocalDateTime.now(),
				HttpStatus.CONFLICT.value(),
				HttpStatus.CONFLICT.getReasonPhrase(),
				ex.getMessage(),
				request.getRequestURI()
				
				);
		return ResponseEntity
				.status(HttpStatus.CONFLICT)
				.body(response);
	}
	
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ExceptionResponseDto> handleresourcenotfound(ResourceNotFoundException ex, HttpServletRequest request){
		
		ExceptionResponseDto response = new ExceptionResponseDto(
				LocalDateTime.now(),
				HttpStatus.NOT_FOUND.value(),
				HttpStatus.NOT_FOUND.getReasonPhrase(),
				ex.getMessage(),
				request.getRequestURI()
				
				);
		return ResponseEntity
				.status(HttpStatus.NOT_FOUND)
				.body(response);
	}

	
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<ExceptionResponseDto> handleRuntimeEx(RuntimeException ex , HttpServletRequest request){
		
		ExceptionResponseDto exceptionresponse = new ExceptionResponseDto(
				LocalDateTime.now(),
				HttpStatus.INTERNAL_SERVER_ERROR.value(),
				HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
				ex.getMessage(),
				request.getRequestURI()
				
				);
		
		return ResponseEntity
				.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(exceptionresponse);
				
		
	}
	
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ExceptionResponseDto> handleallexception(Exception ex , HttpServletRequest request){
		
		ExceptionResponseDto response = new ExceptionResponseDto(
				LocalDateTime.now(),
				HttpStatus.INTERNAL_SERVER_ERROR.value(),
				HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
				ex.getMessage(),
				request.getRequestURI()
				);
		
		return ResponseEntity
					.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(response);
				
	}
	
	
}
