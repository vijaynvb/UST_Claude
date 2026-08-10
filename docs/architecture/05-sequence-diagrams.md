# 5. Sequence Diagrams

This document details the runtime behavior of the key use cases defined in BRD Section 11.

## 5.1 Registration (UC-01)

```mermaid
sequenceDiagram
    actor U as User
    participant SPA as React SPA
    participant API as Auth API
    participant Svc as Auth Service
    participant DB as PostgreSQL

    U->>SPA: Enter email + password
    SPA->>API: POST /auth/register
    API->>API: Validate payload (schema)
    API->>Svc: register(email, password)
    Svc->>DB: SELECT user WHERE email = ?
    alt Email already exists
        DB-->>Svc: existing user found
        Svc-->>API: 409 Conflict
        API-->>SPA: Error: email already registered
        SPA-->>U: Show error message
    else Email available
        DB-->>Svc: no user found
        Svc->>Svc: hash password (bcrypt)
        Svc->>DB: INSERT user
        DB-->>Svc: user created
        Svc-->>API: 201 Created
        API-->>SPA: Registration success
        SPA-->>U: Redirect to login/dashboard
    end
```

## 5.2 Login (UC-02)

```mermaid
sequenceDiagram
    actor U as User
    participant SPA as React SPA
    participant API as Auth API
    participant Svc as Auth Service
    participant DB as PostgreSQL
    participant Cache as Redis

    U->>SPA: Enter credentials
    SPA->>API: POST /auth/login
    API->>Svc: authenticate(email, password)
    Svc->>DB: SELECT user WHERE email = ?
    DB-->>Svc: user record (or none)
    alt Invalid credentials
        Svc-->>API: 401 Unauthorized
        API-->>SPA: Generic error (no detail on which field failed)
        SPA-->>U: Show login error
    else Valid credentials
        Svc->>Svc: verify password hash
        Svc->>Svc: issue JWT access + refresh token
        Svc->>Cache: store refresh token metadata
        Svc-->>API: 200 OK + tokens
        API-->>SPA: Tokens
        SPA->>SPA: store access token, redirect
        SPA-->>U: Show task dashboard
    end
```

## 5.3 Create Task (UC-03)

```mermaid
sequenceDiagram
    actor U as User
    participant SPA as React SPA
    participant Gw as Auth Guard
    participant API as Task API
    participant Svc as Task Service
    participant DB as PostgreSQL

    U->>SPA: Fill task form, submit
    SPA->>Gw: POST /tasks (Bearer JWT)
    Gw->>Gw: verify JWT, extract userId
    alt Invalid/expired token
        Gw-->>SPA: 401 Unauthorized
        SPA-->>U: Redirect to login
    else Valid token
        Gw->>API: forward request with userId
        API->>API: validate DTO (title required)
        alt Title missing
            API-->>SPA: 400 Bad Request
            SPA-->>U: Show validation error
        else Valid payload
            API->>Svc: createTask(userId, payload)
            Svc->>DB: INSERT task (status=Pending)
            DB-->>Svc: task record
            Svc-->>API: 201 Created
            API-->>SPA: New task
            SPA-->>U: Task appears in list
        end
    end
```

## 5.4 Update Task with Ownership Check (UC-04)

```mermaid
sequenceDiagram
    actor U as User
    participant SPA as React SPA
    participant Gw as Auth Guard
    participant API as Task API
    participant Svc as Task Service
    participant DB as PostgreSQL

    U->>SPA: Edit task, save
    SPA->>Gw: PUT /tasks/{id} (Bearer JWT)
    Gw->>API: forward with userId
    API->>Svc: updateTask(userId, taskId, changes)
    Svc->>DB: SELECT task WHERE id = ?
    DB-->>Svc: task record
    alt task.userId != userId
        Svc-->>API: 403 Forbidden
        API-->>SPA: Authorization error
        SPA-->>U: Show access denied
    else Owner matches
        Svc->>Svc: validate status transition
        Svc->>DB: UPDATE task SET ...
        DB-->>Svc: updated record
        Svc-->>API: 200 OK
        API-->>SPA: Updated task
        SPA-->>U: Reflect updated details
    end
```

## 5.5 Delete Task (UC-05)

```mermaid
sequenceDiagram
    actor U as User
    participant SPA as React SPA
    participant API as Task API
    participant Svc as Task Service
    participant DB as PostgreSQL

    U->>SPA: Click "Delete", confirm
    SPA->>API: DELETE /tasks/{id} (Bearer JWT)
    API->>Svc: deleteTask(userId, taskId)
    Svc->>DB: SELECT task WHERE id = ?
    alt Not owner
        Svc-->>API: 403 Forbidden
        API-->>SPA: Authorization error
    else Owner matches
        Svc->>DB: DELETE task WHERE id = ?
        DB-->>Svc: deletion confirmed
        Svc-->>API: 204 No Content
        API-->>SPA: Success
        SPA-->>U: Task removed from list
    end
```

## 5.6 Due-Date Reminder (UC-06)

```mermaid
sequenceDiagram
    participant Cron as Scheduler (Cron Trigger)
    participant Notif as Notification Module
    participant DB as PostgreSQL
    participant Queue as Redis Queue
    participant Worker as Notification Worker
    participant Email as Email Provider
    actor U as User

    Cron->>Notif: trigger reminder scan
    Notif->>DB: SELECT tasks WHERE due_date <= threshold AND status != 'Completed'
    DB-->>Notif: matching tasks
    loop for each matching task
        Notif->>DB: check reminder already sent?
        alt Not yet sent
            Notif->>Queue: enqueue reminder job
        end
    end
    Queue->>Worker: dequeue job
    Worker->>Email: send reminder email/notification
    Email-->>Worker: delivery accepted
    Worker->>DB: mark reminder as sent
    Email-->>U: Reminder received
```

Related: [Data Flow](06-data-flow.md) shows these same interactions from a data-movement perspective.
