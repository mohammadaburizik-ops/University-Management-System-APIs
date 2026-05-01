# University Management System APIs

A Spring Boot-based University Management System API for managing students, courses, enrollments, and student grades.

This project provides REST APIs for creating, reading, updating, and deleting students and courses. It also supports enrolling students in courses, assigning grades, and checking whether a student passed or failed a course.

## Features

- Manage students
  - Add new students
  - Get all students
  - Get a student by ID
  - Update student information
  - Delete students

- Manage courses
  - Add new courses
  - Get all courses
  - Get a course by ID
  - Update course information
  - Delete courses

- Manage student-course enrollment
  - Enroll a student in a course
  - Get all students registered in a course
  - Get all courses registered by a student
  - Set student grade for a course
  - Get student course grade
  - Show pass/fail status

- SOAP support for retrieving student data

## Technologies Used

- Java 18
- Spring Boot 3.3.2
- Spring Web
- Spring Data JPA
- Spring Web Services
- Maven
- Oracle Database
- MySQL Connector
- Lombok
- HTML, CSS, and JavaScript

## Project Structure

```text
University-Management-System-APIs/
│
├── README.md
├── LICENSE
├── .gitignore
│
└── un/
    ├── pom.xml
    ├── mvnw
    ├── mvnw.cmd
    │
    └── src/
        ├── main/
        │   ├── java/com/un/un/
        │   │   ├── Config/
        │   │   ├── Models/
        │   │   ├── controller/
        │   │   ├── repository/
        │   │   ├── services/
        │   │   └── UnApplication.java
        │   │
        │   └── resources/
        │       ├── application.properties
        │       ├── un.xsd
        │       └── static/
        │           ├── index.html
        │           ├── app.css
        │           └── app.js
        │
        └── test/