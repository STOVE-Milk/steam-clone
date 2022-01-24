FROM adoptopenjdk/openjdk11
ADD gateway.jar /app/app.jar
ENV JAVA_OPTS=""
ENTRYPOINT ["java","-jar","/app/app.jar"]