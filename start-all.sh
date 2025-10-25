#!/bin/bash

echo "Starting E-commerce Microservices Platform..."

# Function to build service if JAR doesn't exist
build_if_needed() {
    local service_path=$1
    local jar_name=$2
    
    if [ ! -f "$service_path/target/$jar_name" ]; then
        echo "Building $service_path..."
        (cd $service_path && mvn clean package -DskipTests)
    fi
}

# Build services if needed
build_if_needed "backend/product-service" "product-service-1.0.0.jar"
build_if_needed "backend/order-service" "order-service-1.0.0.jar"
build_if_needed "backend/user-service" "user-service-1.0.0.jar"
build_if_needed "backend/api-gateway" "api-gateway-1.0.0.jar"

echo "Starting Product Service on port 8081..."
(cd backend/product-service && java -jar target/product-service-1.0.0.jar) &

echo "Starting Order Service on port 8082..."
(cd backend/order-service && java -jar target/order-service-1.0.0.jar) &

echo "Starting User Service on port 8083..."
(cd backend/user-service && java -jar target/user-service-1.0.0.jar) &

sleep 5

echo "Starting API Gateway on port 8080..."
(cd backend/api-gateway && java -jar target/api-gateway-1.0.0.jar) &

sleep 3

echo "Starting Frontend on port 5000..."
cd frontend && npm run dev
