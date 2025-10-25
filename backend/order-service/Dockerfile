FROM eclipse-temurin:19-jdk-alpine
WORKDIR /app
COPY target/order-service-1.0.0.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
