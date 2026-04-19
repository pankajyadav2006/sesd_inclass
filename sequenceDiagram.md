# Sequence Diagram: Enrollment Process

```mermaid
sequenceDiagram
    autonumber

    actor Student
    participant WebApp
    participant API as HTTP API
    participant AuthS as AuthService
    participant EnrollS as EnrollmentService
    participant UserRepo as UserRepository
    participant CourseRepo
    participant EnrollRepo as EnrollmentRepository
    database DB

    Note over Student, DB: Login Flow
    Student->>WebApp: Enter credentials
    WebApp->>API: POST /auth/login
    API->>AuthS: validateCredentials(email, password)
    AuthS->>UserRepo: findByEmail(email)
    UserRepo->>DB: SELECT * FROM users WHERE email=?
    DB-->>UserRepo: user + password_hash + role
    AuthS-->>API: JWT token
    API-->>WebApp: 200 OK (token)
    WebApp-->>Student: Logged in

    Note over Student, DB: Enrollment Flow
    Student->>WebApp: Choose course to enroll
    WebApp->>API: POST /enrollments {courseId} (Authorization: Bearer)
    API->>EnrollS: enroll(studentId, courseId)
    EnrollS->>CourseRepo: getById(courseId)
    CourseRepo->>DB: SELECT * FROM courses WHERE id=?
    DB-->>CourseRepo: course (capacity, instructorId, etc.)
    EnrollS->>EnrollRepo: create(studentId, courseId, status=ACTIVE)
    EnrollRepo->>DB: INSERT INTO enrollments (...)
    DB-->>EnrollRepo: row created
    EnrollRepo-->>EnrollS: enrollment
    EnrollS-->>API: Enrollment created
    API-->>WebApp: 201 Created (enrollment)
    WebApp-->>Student: Enrollment confirmed
```
