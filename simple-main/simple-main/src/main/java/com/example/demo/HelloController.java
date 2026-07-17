package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
public class HelloController {

    @GetMapping("/")
    public Map<String, Object> home() {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("status", "SUCCESS");
        response.put("message", "🚀 Spring Boot Backend is Running Successfully on AWS EC2");
        response.put("developer", "Sudharshan P S");
        response.put("application", "Portfolio Backend API");
        response.put("version", "v1.0.0");
        response.put("server", "AWS EC2 Ubuntu");
        response.put("framework", "Spring Boot 3");
        response.put("javaVersion", "Java 17");
        response.put("timestamp", LocalDateTime.now());
        response.put("apiStatus", "ACTIVE");
        response.put("host", "18.209.12.182:8080");

        Map<String, String> endpoints = new LinkedHashMap<>();
        endpoints.put("Home", "/");
        endpoints.put("About", "/about");
        endpoints.put("Health", "/health");

        response.put("availableEndpoints", endpoints);

        return response;
    }

    @GetMapping("/about")
    public Map<String, Object> about() {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("application", "Portfolio Backend API");
        response.put("developer", "Sudharshan P S");
        response.put("description", "A simple Spring Boot REST API deployed on AWS EC2.");
        response.put("technology", "Spring Boot + Java 17 + Maven + AWS EC2");
        response.put("status", "Running Successfully ✅");

        return response;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("status", "UP");
        response.put("server", "Healthy");
        response.put("database", "Not Connected");
        response.put("uptime", "Running");
        response.put("timestamp", LocalDateTime.now());

        return response;
    }
}