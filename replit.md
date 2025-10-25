# E-commerce Microservices Platform

## Project Overview
A full-stack e-commerce platform built with Java Spring Boot microservices on the backend and React.js with Tailwind CSS on the frontend. The application demonstrates a microservices architecture with independent services communicating through an API Gateway.

## Recent Changes

### October 25, 2025 - Project Import Completed
- **Migration Complete**: Successfully migrated E-commerce platform to Replit environment
- **Dependencies Installed**: All frontend packages (React, Vite, Tailwind CSS, Axios) installed via npm
- **Vite Configuration**: Fixed Vite server configuration to allow Replit proxy domains (`allowedHosts: true`)
- **Workflow Running**: All microservices (Product, Order, User, API Gateway) and frontend are running successfully
- **Verification Complete**: Frontend accessible and displaying products correctly

### October 25, 2025 - Security & Critical Fixes
- **Security Enhancement**: Implemented BCrypt password hashing in User Service with Spring Security
- **API Gateway Fix**: Removed unnecessary RewritePath filters that were causing routing issues
- **CORS Fix**: Removed duplicate CORS configuration from microservices (now handled centrally at API Gateway)
- **Startup Reliability**: Enhanced start-all.sh to automatically build JARs if missing
- **Password Security**: User registration now hashes passwords with BCrypt before storage
- **Authentication**: Login validates passwords using BCrypt's secure matching

## Architecture

### Backend Microservices (Java Spring Boot 3.2.0)
- **Product Service** (Port 8081): Manages product catalog with CRUD operations
- **Order Service** (Port 8082): Handles order creation and management
- **User Service** (Port 8083): Manages user registration, authentication, and profiles
- **API Gateway** (Port 8080): Routes all client requests to appropriate microservices

### Frontend (React.js + Tailwind CSS)
- **React 18** with React Router for navigation
- **Tailwind CSS v3** for responsive styling
- **Axios** for API communication
- **Vite** as build tool and dev server (Port 5000)

## Project Structure
```
ecommerce-microservices/
├── backend/
│   ├── product-service/     # Product catalog management
│   ├── order-service/        # Order processing
│   ├── user-service/         # User authentication
│   └── api-gateway/          # API routing
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   └── services/         # API service layer
│   └── package.json
├── start-all.sh             # Startup script for all services
└── replit.md                # This file
```

## Features

### Current Features
- Product browsing with sample product catalog
- Shopping cart functionality
- User registration and login
- Order creation
- Responsive UI with Tailwind CSS
- API documentation with Swagger/OpenAPI for each service

### In-Memory Storage
All services currently use in-memory storage (ConcurrentHashMap) for rapid development and prototyping. Data is reset when services restart.

## Running the Application

The application is configured to run automatically on Replit. All services start together via the "E-commerce Platform" workflow.

### Manual Startup
```bash
bash start-all.sh
```

This will start all services in the correct order:
1. Product, Order, and User services
2. API Gateway (after services are ready)
3. Frontend development server

### Access Points
- **Frontend**: http://localhost:5000
- **API Gateway**: http://localhost:8080
- **Product Service API**: http://localhost:8081/swagger-ui.html
- **Order Service API**: http://localhost:8082/swagger-ui.html
- **User Service API**: http://localhost:8083/swagger-ui.html

## API Endpoints

### Products (via API Gateway)
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products?category=Electronics` - Filter by category
- `GET /api/products?search=laptop` - Search products
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Orders (via API Gateway)
- `GET /api/orders` - Get all orders
- `GET /api/orders?userId={id}` - Get orders by user
- `GET /api/orders/{id}` - Get order by ID
- `POST /api/orders` - Create new order
- `PATCH /api/orders/{id}/status` - Update order status
- `DELETE /api/orders/{id}` - Cancel order

### Users (via API Gateway)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## Technology Stack

### Backend
- Java 17 (GraalVM)
- Spring Boot 3.2.0
- Spring Cloud Gateway 2023.0.0
- Lombok (boilerplate reduction)
- SpringDoc OpenAPI (API documentation)
- Maven (dependency management)

### Frontend
- React 18
- React Router DOM
- Tailwind CSS v3.4
- Axios
- Vite 7.1

## Development

### Building Services
```bash
# Build individual service
cd backend/product-service
mvn clean package -DskipTests

# Build all services (already done)
cd backend/product-service && mvn clean package -DskipTests
cd backend/order-service && mvn clean package -DskipTests
cd backend/user-service && mvn clean package -DskipTests
cd backend/api-gateway && mvn clean package -DskipTests
```

### Installing Frontend Dependencies
```bash
cd frontend
npm install
```

## Deployment on Replit

The application is fully configured for Replit deployment:
- All services start automatically via the workflow
- Frontend is configured to bind to 0.0.0.0:5000
- CORS is properly configured for all services
- Single command deployment via `start-all.sh`

## Next Steps

### Recommended Enhancements
1. **Database Integration**: Replace in-memory storage with PostgreSQL
2. **JWT Authentication**: Implement secure token-based authentication
3. **Payment Integration**: Add Stripe for payment processing
4. **Service Discovery**: Implement Eureka or Consul for dynamic service registration
5. **Message Queue**: Add RabbitMQ/Kafka for asynchronous communication
6. **Monitoring**: Implement distributed tracing and logging
7. **Admin Dashboard**: Create admin interface for managing products and orders
8. **Inventory Management**: Add stock tracking and management
9. **Email Notifications**: Send order confirmations via email
10. **Image Upload**: Implement actual product image uploads

## Contributing

When making changes:
1. Update individual service as needed
2. Rebuild affected services: `mvn clean package -DskipTests`
3. Restart the workflow to apply changes
4. Test API endpoints via Swagger UI
5. Verify frontend functionality

## Notes

- LSP diagnostics in Java files are expected until the language server indexes all Maven dependencies
- All Spring Boot services include Swagger UI for API testing
- The API Gateway provides a single entry point for all microservices
- Frontend uses environment-aware API URLs for development and production
