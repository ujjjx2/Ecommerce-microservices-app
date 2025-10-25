# Deploying E-Commerce Platform to Render

## Prerequisites
- GitHub account
- Render account (sign up at https://render.com)
- Your code pushed to GitHub

## Deployment Steps

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Ready for Render deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Deploy Backend Services

You need to deploy each of the 4 Spring Boot services separately:

#### 2.1 Product Service

1. Go to Render Dashboard → Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `product-service`
   - **Environment**: `Docker`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend/product-service`
   - **Plan**: `Free`
4. Click **"Create Web Service"**
5. Copy the service URL (e.g., `https://product-service.onrender.com`)

#### 2.2 Order Service

Repeat the same steps with:
- **Name**: `order-service`
- **Root Directory**: `backend/order-service`

#### 2.3 User Service

Repeat with:
- **Name**: `user-service`
- **Root Directory**: `backend/user-service`

#### 2.4 API Gateway

Repeat with:
- **Name**: `api-gateway`
- **Root Directory**: `backend/api-gateway`
- **Environment Variables**: Add these after deployment:
  - `PRODUCT_SERVICE_URL`: URL of your deployed product-service
  - `ORDER_SERVICE_URL`: URL of your deployed order-service
  - `USER_SERVICE_URL`: URL of your deployed user-service

### Step 3: Deploy Frontend

1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `ecommerce-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your API Gateway URL (e.g., `https://api-gateway.onrender.com`)
5. Click **"Create Static Site"**

### Step 4: Update Frontend API Configuration

After deployment, you need to update your frontend to use the deployed API Gateway URL.

Edit `frontend/src/services/api.js` and update the base URL to your deployed API Gateway.

## Important Notes

### Free Tier Limitations
- Services sleep after 15 minutes of inactivity
- ~50 second cold start time when waking up
- 750 hours/month per service

### Service URLs
After deployment, you'll have:
- Product Service: `https://product-service.onrender.com`
- Order Service: `https://order-service.onrender.com`
- User Service: `https://user-service.onrender.com`
- API Gateway: `https://api-gateway.onrender.com`
- Frontend: `https://ecommerce-frontend.onrender.com`

### Troubleshooting

**Issue: Service won't start**
- Check logs in Render dashboard
- Ensure JAR files are built correctly
- Verify Dockerfile paths are correct

**Issue: CORS errors**
- Update API Gateway CORS configuration to allow your frontend URL
- Add your frontend domain to `allowedOrigins` in application.yml

**Issue: Services can't communicate**
- Update service URLs in API Gateway configuration
- Use full Render URLs (not localhost)

## Keeping Services Awake (Optional)

Free tier services sleep after 15 minutes. To keep them awake:
1. Use UptimeRobot (free) to ping services every 5 minutes
2. Or upgrade to Render's paid plan ($7/month per service)

## Cost Summary

- **Free Tier**: $0/month (with sleep after 15min inactivity)
- **Paid Tier**: $7/month per service for always-on

For this project (4 backend + 1 frontend):
- Free: $0/month
- Paid: $28/month (4 backend services × $7)
- Frontend static site: Always free
