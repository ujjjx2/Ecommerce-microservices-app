package com.ecommerce.product.service;

import com.ecommerce.product.model.Product;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final Map<Long, Product> products = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ProductService() {
        initializeProductsFromAPI();
    }

    private void initializeProductsFromAPI() {
        try {
            String apiUrl = "https://dummyjson.com/products?limit=30";
            String response = restTemplate.getForObject(apiUrl, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode productsNode = root.get("products");

            if (productsNode != null && productsNode.isArray()) {
                for (JsonNode productNode : productsNode) {
                    Product product = new Product();
                    product.setId(productNode.get("id").asLong());
                    product.setName(productNode.get("title").asText());
                    product.setDescription(productNode.get("description").asText());
                    product.setPrice(new BigDecimal(productNode.get("price").asText()));
                    product.setCategory(productNode.get("category").asText());
                    product.setStock(productNode.get("stock").asInt());
                    product.setBrand(productNode.get("brand") != null ? productNode.get("brand").asText() : "Generic");
                    product.setRating(productNode.get("rating") != null ? productNode.get("rating").asDouble() : 0.0);
                    
                    List<String> images = new ArrayList<>();
                    JsonNode imagesNode = productNode.get("images");
                    if (imagesNode != null && imagesNode.isArray()) {
                        imagesNode.forEach(img -> images.add(img.asText()));
                    }
                    product.setImages(images);
                    product.setImageUrl(images.isEmpty() ? null : images.get(0));

                    products.put(product.getId(), product);
                    if (product.getId() >= idCounter.get()) {
                        idCounter.set(product.getId() + 1);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to load products from API: " + e.getMessage());
            initializeFallbackProducts();
        }
    }

    private void initializeFallbackProducts() {
        createProduct(new Product(null, "Laptop", "High-performance laptop", new BigDecimal("999.99"), "Electronics", 10, "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400", "Generic", 4.5, Arrays.asList("https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400")));
        createProduct(new Product(null, "Smartphone", "Latest smartphone model", new BigDecimal("699.99"), "Electronics", 25, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400", "Generic", 4.7, Arrays.asList("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400")));
        createProduct(new Product(null, "Headphones", "Wireless noise-canceling headphones", new BigDecimal("199.99"), "Electronics", 50, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", "Generic", 4.3, Arrays.asList("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400")));
    }

    public List<Product> getAllProducts() {
        return new ArrayList<>(products.values());
    }

    public Optional<Product> getProductById(Long id) {
        return Optional.ofNullable(products.get(id));
    }

    public List<Product> getProductsByCategory(String category) {
        return products.values().stream()
                .filter(p -> p.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }

    public List<Product> searchProducts(String query) {
        String lowerQuery = query.toLowerCase();
        return products.values().stream()
                .filter(p -> p.getName().toLowerCase().contains(lowerQuery) || 
                            p.getDescription().toLowerCase().contains(lowerQuery))
                .collect(Collectors.toList());
    }

    public Product createProduct(Product product) {
        Long id = idCounter.getAndIncrement();
        product.setId(id);
        products.put(id, product);
        return product;
    }

    public Optional<Product> updateProduct(Long id, Product product) {
        if (products.containsKey(id)) {
            product.setId(id);
            products.put(id, product);
            return Optional.of(product);
        }
        return Optional.empty();
    }

    public boolean deleteProduct(Long id) {
        return products.remove(id) != null;
    }
}
