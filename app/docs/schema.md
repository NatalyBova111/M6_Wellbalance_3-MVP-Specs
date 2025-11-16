# WellBalance – Database Schema

This document describes the **public schema** used by the WellBalance app
(Supabase project).

**Tables:**

- `profiles`
- `foods`
- `meals`
- `meal_items`
- `daily_logs`
- `sleep_logs`
- `water_intake`

The schema is designed for a wellness & nutrition tracker with:

- user profiles
- a food catalog
- meals composed of foods
- daily summary logs
- water intake tracking
- sleep tracking

---

## ER Diagram (Mermaid)

> This is a conceptual diagram; some column names can be slightly different in the actual DB.

```mermaid
erDiagram

  auth_users {
    uuid id PK
  }

  profiles {
    uuid id PK
    text full_name
    text avatar_url
    timestamptz created_at
  }

  foods {
    uuid id PK
    text name
    int4 calories_per_serving
    timestamptz created_at
  }

  meals {
    uuid id PK
    uuid user_id FK
    date meal_date
    text meal_type
    text notes
    timestamptz created_at
  }

  meal_items {
    uuid id PK
    uuid meal_id FK
    uuid food_id FK
    numeric servings
    timestamptz created_at
  }

  daily_logs {
    uuid id PK
    uuid user_id FK
    date log_date
    int4 calories_goal
    int4 calories_actual
    int4 water_goal_ml
    text mood
    timestamptz created_at
  }

  sleep_logs {
    uuid id PK
    uuid user_id FK
    date log_date
    numeric hours
    text quality
    timestamptz created_at
  }

  water_intake {
    uuid id PK
    uuid user_id FK
    date log_date
    int4 ml
    timestamptz created_at
  }

  auth_users ||--o| profiles      : "1 : 1"
  auth_users ||--o{ meals         : "1 : many"
  auth_users ||--o{ daily_logs    : "1 : many"
  auth_users ||--o{ sleep_logs    : "1 : many"
  auth_users ||--o{ water_intake  : "1 : many"

  meals ||--o{ meal_items : "1 : many"
  foods ||--o{ meal_items : "1 : many"
