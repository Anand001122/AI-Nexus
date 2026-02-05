# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build 
WORKDIR /app
COPY pom.xml .
# Download dependencies to a separate layer for caching
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
