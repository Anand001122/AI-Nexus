# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build 
WORKDIR /app
COPY pom.xml .
# Download dependencies to a separate layer for caching
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Production stage
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8087
ENTRYPOINT ["java", "-jar", "app.jar"]
