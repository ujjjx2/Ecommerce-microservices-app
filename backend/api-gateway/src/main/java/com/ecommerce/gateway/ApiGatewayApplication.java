package com.ecommerce.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class ApiGatewayApplication implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(ApiGatewayApplication.class);

    @Value("${PRODUCT_SERVICE_URL:http://localhost:8081}")
    private String productServiceUrl;

    @Value("${ORDER_SERVICE_URL:http://localhost:8082}")
    private String orderServiceUrl;

    @Value("${USER_SERVICE_URL:http://localhost:8083}")
    private String userServiceUrl;

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Override
    public void run(String... args) {
        log.info("🚀 API Gateway started successfully.");
        log.info("🔗 Connected service endpoints:");
        log.info("   ➜ Product Service URL: {}", productServiceUrl);
        log.info("   ➜ Order Service URL:   {}", orderServiceUrl);
        log.info("   ➜ User Service URL:    {}", userServiceUrl);
        log.info("🌍 Server running on port: {}", System.getenv("PORT") != null ? System.getenv("PORT") : "8080 (default)");
    }
}
