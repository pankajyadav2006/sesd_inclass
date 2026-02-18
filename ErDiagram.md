```mermaid
erDiagram
title Student Management System (ER)

USER {
  UUID user_id PK
  string email
  string password_hash
  string role
  datetime created_at
}

STUDENT {
  UUID student_id PK
  UUID user_id FK
  string name
  string major
  datetime created_at
}

INSTRUCTOR {
  UUID instructor_id PK
  UUID user_id FK
  string name
  string department
  datetime created_at
}

COURSE {
  UUID course_id PK
  string code
  string title
  int capacity
  UUID instructor_id FK
  datetime created_at
}

ENROLLMENT {
  UUID enrollment_id PK
  UUID student_id FK
  UUID course_id FK
  string status
  datetime created_at
}

USER ||--o| STUDENT : "has profile"
USER ||--o| INSTRUCTOR : "has profile"
INSTRUCTOR ||--o{ COURSE : "teaches"
STUDENT ||--o{ ENROLLMENT : "enrolls"
COURSE ||--o{ ENROLLMENT : "contains"
```

