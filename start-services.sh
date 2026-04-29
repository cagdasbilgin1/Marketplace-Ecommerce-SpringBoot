#!/bin/bash

echo "Starting all microservices in the background..."
mkdir -p logs

nohup ./mvnw -pl services/api-gateway spring-boot:run > logs/api-gateway.log 2>&1 &
echo "Started api-gateway"

nohup ./mvnw -pl services/user-profile-service spring-boot:run > logs/user-profile-service.log 2>&1 &
echo "Started user-profile-service"

nohup ./mvnw -pl services/catalog-service spring-boot:run > logs/catalog-service.log 2>&1 &
echo "Started catalog-service"

nohup ./mvnw -pl services/inventory-service spring-boot:run > logs/inventory-service.log 2>&1 &
echo "Started inventory-service"

nohup ./mvnw -pl services/cart-service spring-boot:run > logs/cart-service.log 2>&1 &
echo "Started cart-service"

nohup ./mvnw -pl services/order-service spring-boot:run > logs/order-service.log 2>&1 &
echo "Started order-service"

nohup ./mvnw -pl services/payment-service spring-boot:run > logs/payment-service.log 2>&1 &
echo "Started payment-service"

nohup ./mvnw -pl services/notification-service spring-boot:run > logs/notification-service.log 2>&1 &
echo "Started notification-service"

echo "All services are starting. You can check the logs in the 'logs' directory."
