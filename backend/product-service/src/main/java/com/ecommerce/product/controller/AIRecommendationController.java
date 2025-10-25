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

    @GetMapping("/{id}/ai-recommendation")
    public ResponseEntity<?> getAIRecommendation(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(product -> {
                    try {
                        Map<String, Object> recommendation = aiRecommendationService.analyzeProduct(product);
                        return ResponseEntity.ok(recommendation);
                    } catch (Exception e) {
                        return ResponseEntity.status(500)
                                .body(Map.of("error", "Failed to generate AI recommendation: " + e.getMessage()));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
