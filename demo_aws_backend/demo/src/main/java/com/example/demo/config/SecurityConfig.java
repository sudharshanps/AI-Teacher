package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * NOTE: This opens up /api/** and /health with no authentication so the demo
 * endpoints work out of the box. Before running this anywhere real, replace
 * this with proper authentication (e.g. JWT, OAuth2, or an API key filter)
 * and lock down write operations (POST/DELETE) at minimum.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/health", "/api/**").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
