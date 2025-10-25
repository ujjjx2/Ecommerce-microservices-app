package com.ecommerce.product.service;

import com.ecommerce.product.model.Product;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final Map<Long, Product> products = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public ProductService() {
        initializeSampleProducts();
    }

    private void initializeSampleProducts() {
        createProduct(new Product(null, "Laptop", "High-performance laptop", new BigDecimal("999.99"), "Electronics", 10, "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400"));
        createProduct(new Product(null, "Smartphone", "Latest smartphone model", new BigDecimal("699.99"), "Electronics", 25, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"));
        createProduct(new Product(null, "Headphones", "Wireless noise-canceling headphones", new BigDecimal("199.99"), "Electronics", 50, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400"));
        createProduct(new Product(null, "Running Shoes", "Comfortable running shoes", new BigDecimal("89.99"), "Sports", 40, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"));
        createProduct(new Product(null, "Backpack", "Durable travel backpack", new BigDecimal("59.99"), "Accessories", 30, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"));
        createProduct(new Product(null, "Water Bottle", "Insulated water bottle", new BigDecimal("24.99"), "Sports", 100, "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400"));
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
