FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN mkdir -p /app/data
EXPOSE 8099
ENTRYPOINT ["sh", "-c", "java -Xmx384m -Dserver.port=${PORT:-8099} -jar app.jar"]
