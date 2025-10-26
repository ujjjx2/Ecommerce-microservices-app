package com.ecommerce.product.service;

import com.ecommerce.product.model.Product;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
public class AIRecommendationService {
    
    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String apiKey;
    
    public AIRecommendationService() {
        // Check for GOOGLE_API_KEY first (standard), then fall back to GEMINI_API_KEY
        String key = System.getenv("GOOGLE_API_KEY");
        if (key == null || key.isEmpty()) {
            key = System.getenv("GEMINI_API_KEY");
        }
        this.apiKey = key;
    }

    public Map<String, Object> analyzeProduct(Product product) throws Exception {
        if (apiKey == null || apiKey.isEmpty()) {
            System.err.println("ERROR: GOOGLE_API_KEY or GEMINI_API_KEY environment variable is not set");
            throw new IllegalStateException("AI recommendation service is not configured. Please set GOOGLE_API_KEY or GEMINI_API_KEY environment variable.");
        }

        String prompt = String.format(
            "Analyze the following product and provide a detailed recommendation with pros and cons.\n\n" +
            "Product Name: %s\n" +
            "Brand: %s\n" +
            "Category: %s\n" +
            "Price: $%s\n" +
            "Description: %s\n" +
            "Rating: %s/5\n" +
            "Stock: %d\n\n" +
            "Please provide:\n" +
            "1. A brief summary (2-3 sentences)\n" +
            "2. Pros (3-5 positive points)\n" +
            "3. Cons (3-5 negative points or areas for improvement)\n" +
            "4. A final recommendation (who should buy this product)\n\n" +
            "Respond with JSON in this exact format:\n" +
            "{\n" +
            "  \"summary\": \"Brief summary of the product\",\n" +
            "  \"pros\": [\"pro 1\", \"pro 2\", \"pro 3\"],\n" +
            "  \"cons\": [\"con 1\", \"con 2\", \"con 3\"],\n" +
            "  \"recommendation\": \"Final recommendation\"\n" +
            "}",
            product.getName(),
            product.getBrand() != null ? product.getBrand() : "N/A",
            product.getCategory(),
            product.getPrice(),
            product.getDescription(),
            product.getRating() != null ? product.getRating() : "N/A",
            product.getStock()
        );

        String requestBody = objectMapper.writeValueAsString(Map.of(
            "contents", List.of(Map.of(
                "parts", List.of(Map.of("text", prompt))
            )),
            "generationConfig", Map.of(
                "response_mime_type", "application/json",
                "response_schema", Map.of(
                    "type", "object",
                    "properties", Map.of(
                        "summary", Map.of("type", "string"),
                        "pros", Map.of(
                            "type", "array",
                            "items", Map.of("type", "string")
                        ),
                        "cons", Map.of(
                            "type", "array",
                            "items", Map.of("type", "string")
                        ),
                        "recommendation", Map.of("type", "string")
                    ),
                    "required", List.of("summary", "pros", "cons", "recommendation")
                )
            )
        ));

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            System.err.println("ERROR: Gemini API request failed with status: " + response.statusCode());
            System.err.println("Response body: " + response.body());
            throw new RuntimeException("AI recommendation service is temporarily unavailable");
        }

        Map<String, Object> responseData = objectMapper.readValue(response.body(), Map.class);
        
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseData.get("candidates");
        if (candidates == null || candidates.isEmpty()) {
            System.err.println("ERROR: No candidates in Gemini response");
            System.err.println("Full response: " + responseData);
            throw new RuntimeException("AI recommendation service returned an invalid response");
        }

        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        
        if (parts == null || parts.isEmpty()) {
            System.err.println("ERROR: No parts in Gemini response");
            System.err.println("Full response: " + responseData);
            throw new RuntimeException("AI recommendation service returned an invalid response");
        }

        String jsonText = (String) parts.get(0).get("text");
        return objectMapper.readValue(jsonText, Map.class);
    }
}
