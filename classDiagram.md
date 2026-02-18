```mermaid
classDiagram
title Core domain and services (OOP + Clean Architecture)

class User {
  +UUID id
  +string email
  +string passwordHash
  +Role role
}

class Role {
  <<enumeration>>
  +STUDENT
  +INSTRUCTOR
  +ADMIN
}

class Student {
  +UUID id
  +UUID userId
  +string name
  +enroll(courseId)
  +drop(enrollmentId)
}

class Instructor {
  +UUID id
  +UUID userId
  +string name
  +createCourse(code, title, capacity)
  +updateCourse(courseId, attrs)
}

class Course {
  +UUID id
  +string code
  +string title
  +int capacity
  +UUID instructorId
  +bool hasSeat()
}

class Enrollment {
  +UUID id
  +UUID studentId
  +UUID courseId
  +Status status
  +Date createdAt
}

class Status {
  <<enumeration>>
  +PENDING
  +ACTIVE
  +DROPPED
}

class IStudentRepository {
  <<interface>>
  +findById(id) Student
  +save(student) void
}
class IInstructorRepository {
  <<interface>>
  +findById(id) Instructor
}
class ICourseRepository {
  <<interface>>
  +getById(id) Course
  +findOpenByCode(code) Course
  +save(course) void
}
class IEnrollmentRepository {
  <<interface>>
  +create(studentId, courseId) Enrollment
  +findByStudent(studentId) Enrollment[]
  +delete(id) void
}
class IUserRepository {
  <<interface>>
  +findByEmail(email) User
  +save(user) void
}

class AuthService {
  +login(email, password) Token
  +register(email, password, role) User
}
class EnrollmentService {
  +enroll(studentId, courseId) Enrollment
  +drop(enrollmentId) void
}
class CourseService {
  +create(instructorId, code, title, capacity) Course
  +update(courseId, attrs) Course
}
class StudentService {
  +profile(studentId) Student
}

User --> Role
Student "1" --> "0..*" Enrollment : owns
Course "1" --> "0..*" Enrollment : contains
Instructor "1" --> "0..*" Course : teaches
User "1" --> "0..1" Student : profile
User "1" --> "0..1" Instructor : profile
Enrollment --> Status

AuthService ..> IUserRepository : uses
EnrollmentService ..> ICourseRepository : uses
EnrollmentService ..> IEnrollmentRepository : uses
CourseService ..> ICourseRepository : uses
StudentService ..> IStudentRepository : uses
```

