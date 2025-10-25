package com.ecommerce.order.service;

import com.ecommerce.order.model.Order;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private final Map<Long, Order> orders = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public List<Order> getAllOrders() {
        return new ArrayList<>(orders.values());
    }

    public Optional<Order> getOrderById(Long id) {
        return Optional.ofNullable(orders.get(id));
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orders.values().stream()
                .filter(o -> o.getUserId().equals(userId))
                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public Order createOrder(Order order) {
        Long id = idCounter.getAndIncrement();
        order.setId(id);
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        orders.put(id, order);
        return order;
    }

    public Optional<Order> updateOrderStatus(Long id, String status) {
        Order order = orders.get(id);
        if (order != null) {
            order.setStatus(status);
            order.setUpdatedAt(LocalDateTime.now());
            return Optional.of(order);
        }
        return Optional.empty();
    }

    public boolean cancelOrder(Long id) {
        Order order = orders.get(id);
        if (order != null && "PENDING".equals(order.getStatus())) {
            order.setStatus("CANCELLED");
            order.setUpdatedAt(LocalDateTime.now());
            return true;
        }
        return false;
    }
}
