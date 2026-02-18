# Student Management System — Backend‑Focused Design

The Student Management System (SMS) is a lean full‑stack application with a backend emphasis (≈75%). It manages students, instructors, courses, and enrollments, showcasing object‑oriented modeling and clean architecture. The design separates domain entities, application services (use cases), and infrastructure adapters (persistence, web), using the Repository and Service patterns to keep business rules independent of frameworks and databases.

Key goals:
- Clear domain model: Student, Instructor, Course, Enrollment, User (auth).
- Use cases encapsulated in services (e.g., enroll, drop, manage courses).
- Repository interfaces for persistence abstraction and testability.
- Simple authentication and role‑based access (Student, Instructor, Admin).
- Minimal yet realistic data model to support core flows.
- Straightforward API endpoints to integrate a thin web frontend.

Core features (scope):
- User registration and login.
- Course catalog browsing.
- Student enrollment lifecycle: enroll and drop.
- Instructor course management: create and update courses.
- Basic access control by role.
- System observability basics (validation, simple logging).

Non‑goals (out of scope for v1):
- Payments, scheduling conflicts, waitlists, notifications, analytics.
- Complex grading workflows.

Architecture sketch:
- Domain: Entities (Student, Instructor, Course, Enrollment, User) with invariants.
- Application: Services (AuthService, EnrollmentService, CourseService, StudentService) orchestrate use cases via repository interfaces.
- Infrastructure: Implementations of repositories (e.g., SQL) and HTTP controllers.

