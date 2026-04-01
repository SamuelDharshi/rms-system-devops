package com.rms.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Converts exceptions into clean JSON error responses.
 * Without this, Spring returns HTML error pages which the frontend can't parse.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles ResponseStatusException (thrown manually in services)
     * e.g. 404 Not Found, 409 Conflict, 401 Unauthorized
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatusException(
            ResponseStatusException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("statusCode", ex.getStatusCode().value());
        body.put("message",    ex.getReason());
        return ResponseEntity.status(ex.getStatusCode()).body(body);
    }

    /**
     * Handles @Valid validation failures from DTOs
     * Returns all field errors as a list
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException ex) {

        String errors = ex.getBindingResult().getFieldErrors()
            .stream()
            .map(FieldError::getDefaultMessage)
            .collect(Collectors.joining(" · "));

        Map<String, Object> body = new HashMap<>();
        body.put("statusCode", 400);
        body.put("message",    errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    /**
     * Catch-all for unexpected exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("statusCode", 500);
        body.put("message",    "Internal server error: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
