```mermaid
usecaseDiagram
title Student Management System (Use Cases)

actor Student as S
actor Instructor as I
actor Admin as A

S --> (Register)
S --> (Login)
S --> (Browse Courses)
S --> (Enroll in Course)
S --> (Drop Course)
S --> (View Enrollments)

I --> (Login)
I --> (Create Course)
I --> (Update Course)
I --> (View Enrolled Students)

A --> (Login)
A --> (Manage Users)
A --> (Manage Courses)
A --> (Assign Instructor)

(Register) ..> (Login) : includes
(Create Course) ..> (Manage Courses) : includes
(Update Course) ..> (Manage Courses) : includes
```

