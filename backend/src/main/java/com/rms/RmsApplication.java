package com.rms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the RMS Spring Boot application.
 * Run with: mvn spring-boot:run
 */
@SpringBootApplication
public class RmsApplication {
    public static void main(String[] args) {
        SpringApplication.run(RmsApplication.class, args);
    }
}
