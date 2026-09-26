# ==========================================
# STAGE 1: Build Spring Boot Application
# ==========================================

FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy Maven configuration first
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build Spring Boot JAR
RUN mvn clean package -DskipTests


# ==========================================
# STAGE 2: Run Spring Boot Application
# ==========================================

FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy the JAR created in the build stage
COPY --from=build /app/target/*.jar app.jar

# Spring Boot application port
EXPOSE 8050

# Start application
ENTRYPOINT ["java", "-jar", "app.jar"]