# E-commerce Microservices Platform

## Project Overview
A full-stack e-commerce platform built with Java Spring Boot microservices on the backend and React.js with Tailwind CSS on the frontend. The application demonstrates a microservices architecture with independent services communicating through an API Gateway.

## Recent Changes

### October 26, 2025 - AI Service Fix for Production
- **Fixed Frontend API Calls**: Updated `gemini.js` to use configured axios instance with proper base URL
- **Production Environment File**: Created `.env.production` with API Gateway URL
- **API Key Configuration**: Backend now checks both `GOOGLE_API_KEY` and `GEMINI_API_KEY` environment variables
- **Health Check Endpoint**: Added `/api/products/ai/health` to verify API key configuration
- **Debugging Tools**: Added startup logging to show API key status (without exposing the key)

### October 26, 2025 - Render Deployment Configuration
- **Environment-Aware Configuration**: API Gateway now uses environment variables with intelligent defaults
  - Local development: Routes to localhost services (http://localhost:8081, 8082, 8083)
  - Production (Render): Routes to deployed services via environment variables
  - Environment variables: `PRODUCT_SERVICE_URL`, `ORDER_SERVICE_URL`, `USER_SERVICE_URL`
- **Render URLs**: Configured for deployment to the following Render services
  - Product Service: https://product-service-cvrs.onrender.com
  - Order Service: https://order-service-okjq.onrender.com
  - User Service: https://user-service-1mgh.onrender.com
  - API Gateway: https://api-gateway-70ls.onrender.com
  - Frontend: https://ecommerce-microservices-app.onrender.com
- **CORS Security Enhancement**: Updated CORS configuration to only allow specific origins
  - Allows Render production domain (https://ecommerce-microservices-app.onrender.com)
  - Allows localhost for local development (http://localhost:5000, http://127.0.0.1:5000)
  - Changed allowCredentials to true for proper session handling
- **Frontend Environment Files**: Created separate environment files for development and production
  - `.env.development`: Uses Vite proxy for local development (empty VITE_API_URL)
  - `.env.production`: Uses API Gateway Render URL (https://api-gateway-70ls.onrender.com)
- **Deployment Documentation**: Created `RENDER_ENV_VARIABLES.md` with complete deployment checklist
- **Works Everywhere**: Application seamlessly works in both local (Replit) and production (Render) environments

### October 25, 2025 - Cart & Checkout Page Redesign
- **Modern Cart UI**: Complete redesign of the cart page with dark mode support
  - Glass-morphism effects with backdrop blur and gradient borders
  - Beautiful gradient price tags and animated badges
  - Product images with fallback icons
  - Enhanced quantity controls with icon buttons
  - Sticky order summary sidebar with tax calculation
  - Empty cart state with attractive messaging and call-to-action
  - "Continue Shopping" and "Proceed to Checkout" buttons
- **Checkout Page Created**: Full-featured checkout flow with order completion
  - Contact information section with email validation
  - Comprehensive shipping address form (name, address, city, state, ZIP)
  - Payment details section (card number, cardholder name, expiry, CVV)
  - Order summary sidebar showing all cart items
  - Real-time total calculation (subtotal + tax)
  - Security badges (SSL encryption, money-back guarantee)
  - Form validation with required fields
  - Order placement with cart clearing on success
- **Seamless Navigation**: Proper routing between cart and checkout pages
- **Consistent Design**: Both pages follow the modern gradient/glass aesthetic
- **Full Dark Mode Support**: Beautiful dark theme for both cart and checkout pages

### October 25, 2025 - AI Product Recommendations with Gemini
- **AI-Powered Analysis**: Added Google Gemini AI integration to provide intelligent product recommendations
- **Secure Backend Implementation**: AI service runs on backend to keep API keys secure (never exposed to client)
- **Smart Product Insights**: Each product has a "Get AI Recommendation" button that triggers AI analysis
- **Comprehensive Analysis**: AI provides:
  - Brief product summary
  - List of pros (positive aspects)
  - List of cons (areas for improvement)
  - Personalized recommendation on who should buy the product
- **Beautiful Modal UI**: Professional modal design with color-coded sections for summary, pros, cons, and recommendations
- **Error Handling**: Graceful error handling with user-friendly messages if AI service is unavailable
- **Production-Ready**: Uses Gemini 2.5 Flash model via secure backend endpoint at `/api/products/{id}/ai-recommendation`

### October 25, 2025 - Real Product Data Integration
- **DummyJSON API Integration**: Backend now fetches real product data from DummyJSON API on startup
- **Enhanced Product Model**: Added `brand`, `rating`, and `images` fields to support rich product information
- **Professional Product Display**: Frontend shows product images, star ratings, brand names, and stock indicators
- **Error Handling**: Production-ready error handling with user-visible messages and retry functionality
- **Stock Management**: Visual indicators for low stock (< 10) and out of stock items
- **Fallback Strategy**: Gracefully falls back to sample data if external API is unavailable
- **React Best Practices**: Frontend uses useCallback for proper hook dependency management

### October 25, 2025 - Registration Feature & API Proxy Setup
- **Registration Page Added**: Created complete user registration page with form validation
- **Navigation Updated**: Added "Sign Up" button to header navigation bar
- **API Proxy Configured**: Set up Vite proxy to forward `/api` requests to backend (localhost:8080)
- **Registration Features**:
  - Name, email, password fields with validation
  - Password confirmation matching
  - Minimum 6-character password requirement
  - Duplicate email detection
  - Auto-login after successful registration
  - Secure BCrypt password hashing on backend

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
- **Product Service** (Port 8081): Manages product catalog with CRUD operations and AI recommendations
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
- Product browsing with real product data from DummyJSON API
- Product images, star ratings, brand information, and stock indicators
- Shopping cart functionality
- User registration and login with BCrypt password hashing
- Order creation
- Production-ready error handling with user-friendly messages
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
