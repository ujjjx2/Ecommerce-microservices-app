# Render Environment Variables Configuration

This document lists all environment variables needed for deploying the E-commerce platform on Render.

## API Gateway Service

Set these environment variables in your API Gateway service on Render:

```
PRODUCT_SERVICE_URL=https://product-service-cvrs.onrender.com
ORDER_SERVICE_URL=https://order-service-okjq.onrender.com
USER_SERVICE_URL=https://user-service-1mgh.onrender.com
```

## Frontend Service

Set this environment variable in your Frontend service on Render:

```
VITE_API_URL=https://api-gateway-70ls.onrender.com
```

## Individual Microservices

No additional environment variables are required for the individual microservices (Product, Order, User).
They only need the `PORT` environment variable, which Render sets automatically.

## Local Development

For local development in Replit:
- API Gateway automatically uses `http://localhost:8081`, `8082`, `8083` for service URLs
- Frontend uses the Vite proxy (configured in `vite.config.js`) to forward `/api` requests to `http://localhost:8080`
- No environment variables need to be set

## Production Deployment Checklist

### 1. Deploy Individual Microservices First
- [ ] Deploy Product Service to Render
- [ ] Deploy Order Service to Render  
- [ ] Deploy User Service to Render
- [ ] Verify each service is running and accessible

### 2. Deploy API Gateway
- [ ] Set environment variables (PRODUCT_SERVICE_URL, ORDER_SERVICE_URL, USER_SERVICE_URL)
- [ ] Deploy API Gateway
- [ ] Test gateway routing to all services

### 3. Deploy Frontend
- [ ] Set VITE_API_URL environment variable
- [ ] Build frontend with: `npm run build`
- [ ] Deploy build output (`dist` folder)
- [ ] Verify frontend can communicate with API Gateway

## Notes

- The API Gateway uses environment variables with sensible defaults for local development
- The frontend automatically uses the correct API URL based on the environment (.env.development or .env.production)
- CORS is configured to allow requests from both production (Render) and local development origins
