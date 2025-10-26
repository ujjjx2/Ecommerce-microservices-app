package com.ecommerce.product.controller;

import com.ecommerce.product.model.Product;
import com.ecommerce.product.service.AIRecommendationService;
import com.ecommerce.product.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class AIRecommendationController {

    @Autowired
    private ProductService productService;
    
    @Autowired
    private AIRecommendationService aiRecommendationService;

    @GetMapping("/ai/health")
    public ResponseEntity<?> checkAIHealth() {
        boolean configured = aiRecommendationService.isConfigured();
        String googleKey = System.getenv("GOOGLE_API_KEY");
        String geminiKey = System.getenv("GEMINI_API_KEY");
        
        return ResponseEntity.ok(Map.of(
            "configured", configured,
            "status", configured ? "AI service is ready" : "AI service not configured - API key missing",
            "environment_variables", Map.of(
                "GOOGLE_API_KEY", googleKey != null && !googleKey.isEmpty() ? "SET (length: " + googleKey.length() + ")" : "NOT SET",
                "GEMINI_API_KEY", geminiKey != null && !geminiKey.isEmpty() ? "SET (length: " + geminiKey.length() + ")" : "NOT SET"
            )
        ));
    }

    @GetMapping("/{id}/ai-recommendation")
    public ResponseEntity<?> getAIRecommendation(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(product -> {
                    try {
                        Map<String, Object> recommendation = aiRecommendationService.analyzeProduct(product);
                        return ResponseEntity.ok(recommendation);
                    } catch (IllegalStateException e) {
                        System.err.println("AI service configuration error for product " + id + ": " + e.getMessage());
                        return ResponseEntity.status(503)
                                .body(Map.of("error", "AI recommendation service is currently unavailable"));
                    } catch (Exception e) {
                        System.err.println("AI recommendation error for product " + id + ": " + e.getMessage());
                        e.printStackTrace();
                        return ResponseEntity.status(500)
                                .body(Map.of("error", "Unable to generate AI recommendation at this time"));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
