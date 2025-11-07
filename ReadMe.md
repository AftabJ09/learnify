# Learnify 

Learnify is a **Java Spring Boot based Learning Management System (LMS)** that helps learners and admins manage courses, quizzes, queries, and discussions in a structured way. It follows a layered architecture (Controller → Service → Repository → Entity) and integrates both backend (Spring Boot) and frontend (HTML, CSS, JS) for a complete learning platform.

---

##  Features

* **User Roles**

  * Learners: Register, log in, access subjects, topics, and quizzes.
  * Admins: Manage learners, subjects, topics, and monitor progress.

* **Learning Content**

  * Add, update, and delete subjects and topics.
  * Manage course content dynamically.

* **Quiz System**

  * Create and attempt quizzes.
  * Store quiz results and learner progress.

* **Query Forum**

  * Learners can raise queries.
  * Replies and discussions supported.

* **Authentication & Security**

  * Spring Security configuration for login/signup.
  * Session-based user handling.

* **Dashboard**

  * Admin Dashboard: Manage subjects, sections, learners.
  * Learner Dashboard: Track progress, quizzes, and content.

---

##  Project Structure

```
learnify/
├── src/main/java/com/LearnifyOrg/learnify
│   ├── config/                 # Spring Security & Web configuration
│   ├── Controller/             # Handles HTTP requests (REST APIs)
│   ├── Entity/                 # JPA Entities (Database Models)
│   ├── Repository/             # JPA Repositories for DB interaction
│   ├── Services/               # Business logic layer
│   └── LearnifyApplication.java # Main Spring Boot application
│
├── src/main/resources/
│   ├── static/                 # Frontend assets (css, js, html)
│   └── application.properties  # Spring Boot config
│
└── pom.xml                     # Maven dependencies
```

---

##  Tech Stack

* **Backend:** Spring Boot, Spring Security, Spring Data JPA
* **Frontend:** HTML, CSS, JavaScript, Bootstrap
* **Database:** MySQL (via JPA Repositories)
* **Build Tool:** Maven

---

##  Setup & Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AftabJ09/learnify.git
   cd learnify
   ```

2. Configure **application.properties**:

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/learnify
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   ```

3. Run the application:

   ```bash
   mvn spring-boot:run
   ```

4. Access in browser:

   * **Learner Dashboard:** `http://localhost:8081/learnerDashboard.html`
   * **Admin Dashboard:** `http://localhost:8081/adminDashboard.html`
   * **Forum:** `http://localhost:8081/forum.html`

---

##  API Endpoints Reference

###  Authentication & Learners (`LearnerController`)

* `POST /learners/register` → Register new learner
* `POST /learners/login` → Login with email & password
* `GET /learners/{id}` → Get learner details by ID
* `PUT /learners/{id}` → Update learner profile
* `DELETE /learners/{id}` → Delete learner

###  Admin (`AdminController`)

* `POST /admin/register` → Register new admin
* `POST /admin/login` → Admin login
* `GET /admin/learners` → Get list of learners
* `DELETE /admin/learner/{id}` → Remove learner

###  Subjects & Sections (`SubjectController`, `SectionController`)

* `GET /subjects` → Get all subjects
* `POST /subjects` → Add a new subject
* `PUT /subjects/{id}` → Update subject
* `DELETE /subjects/{id}` → Delete subject
* `GET /sections/{subjectId}` → Get all sections under a subject
* `POST /sections` → Add new section

###  Topics (`TopicController`)

* `GET /topics/{sectionId}` → Get topics by section
* `POST /topics` → Add new topic
* `PUT /topics/{id}` → Edit topic
* `DELETE /topics/{id}` → Delete topic

###  Quizzes (`QuizController`, `QuizDataController`)

* `GET /quizzes/{topicId}` → Get quizzes for a topic
* `POST /quizzes` → Create a new quiz
* `POST /quizzes/submit` → Submit quiz answers
* `GET /quizzes/results/{learnerId}` → Get learner’s quiz results

###  Queries & Replies (`QueryController`, `ReplyController`)

* `POST /queries` → Post a query
* `GET /queries` → Get all queries
* `POST /queries/{id}/reply` → Add reply to query
* `GET /queries/{id}/replies` → Get replies for a query

###  Progress (`ProgressRepository`)

* `GET /progress/{learnerId}` → Get learner’s progress
* `POST /progress` → Save/update progress

---

##  Important Modules

* **Controllers:** REST APIs to handle requests.
* **Services:** Business logic layer.
* **Repositories:** Database operations with JPA.
* **Entities:** Table mappings with Hibernate.
* **Static Files:** CSS, JS, and HTML for UI.

---

##  Contributing

Contributions are welcome! Please fork the repo and submit a PR for review.

---

## Admin

spring.security.user.name="your name"
spring.security.user.password="your password"


Config file inside learnify has SecurityConfig java file = remove the code for enabling security, it has been disabled temporarily
Th path is: D:\learnify\src\main\java\com\LearnifyOrg\learnify\config\SecurityConfig.java
