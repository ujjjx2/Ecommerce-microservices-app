package com.ecommerce.user.service;

import com.ecommerce.user.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class UserService {
    private final Map<Long, User> users = new ConcurrentHashMap<>();
    private final Map<String, Long> emailToUserId = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return new ArrayList<>(users.values());
    }

    public Optional<User> getUserById(Long id) {
        return Optional.ofNullable(users.get(id));
    }

    public Optional<User> getUserByEmail(String email) {
        Long userId = emailToUserId.get(email.toLowerCase());
        return userId != null ? Optional.ofNullable(users.get(userId)) : Optional.empty();
    }

    public Optional<User> registerUser(User user) {
        String email = user.getEmail().toLowerCase();
        
        if (emailToUserId.containsKey(email)) {
            return Optional.empty();
        }
        
        Long id = idCounter.getAndIncrement();
        user.setId(id);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        
        users.put(id, user);
        emailToUserId.put(email, id);
        
        return Optional.of(user);
    }

    public Optional<User> loginUser(String email, String password) {
        return getUserByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()));
    }

    public Optional<User> updateUser(Long id, User user) {
        if (users.containsKey(id)) {
            User existing = users.get(id);
            user.setId(id);
            user.setCreatedAt(existing.getCreatedAt());
            
            if (user.getEmail() != null && !user.getEmail().equals(existing.getEmail())) {
                emailToUserId.remove(existing.getEmail().toLowerCase());
                emailToUserId.put(user.getEmail().toLowerCase(), id);
            }
            
            users.put(id, user);
            return Optional.of(user);
        }
        return Optional.empty();
    }

    public boolean deleteUser(Long id) {
        User user = users.remove(id);
        if (user != null) {
            emailToUserId.remove(user.getEmail().toLowerCase());
            return true;
        }
        return false;
    }
}
