mvn ^3.5.2
java jdk ^1.8

run service:

- mvn package
- java -cp target/recommender-service-1.0-SNAPSHOT.jar com.webservices.Main