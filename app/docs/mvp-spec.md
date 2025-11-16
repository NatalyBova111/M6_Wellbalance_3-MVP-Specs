# MVP Specification (BMAD Style)

## 1. **Background**

The *WellBalance* application is a wellness‑tracking tool that helps users monitor their nutrition, hydration, sleep, and overall health patterns. The goal is to create a simple and intuitive MVP that allows users to register, log in, manage basic health-related entries (e.g., meals/foods), and view their wellness dashboard.

This MVP will serve as the foundation for future development such as advanced analytics, habit formation tools, charts, and interactive coaching.

---

## 2. **Motivation**

Modern users want to track their health habits without complexity. Many existing apps are overloaded, require subscriptions, or have poor UX. The motivation behind *WellBalance* is to provide:

* **Simple onboarding** with email authentication via Supabase.
* **Clean and minimal dashboard** to monitor wellness activities.
* **Easy data entry** for foods and meals.
* **Secure storage** of user data tied to user profile.

This MVP ensures:
✔ Foundational architecture
✔ Authentication flow
✔ Basic CRUD functionality
✔ Ready-to-extend database schema

---

## 3. **Actions**

This section lists all user-facing and system actions for the MVP.

### **3.1 Authentication**

* **Sign Up** using email + password (Supabase Auth)
* **Login** using email + password
* **Email confirmation** flow
* Redirect to dashboard after login
* Store user profile in `profiles` table

### **3.2 Dashboard**

* Display welcome message with user name
* Show base sections (Meals, Water & Sleep, Dashboard)
* Display placeholder blocks for upcoming features

### **3.3 Foods (basic CRUD)**

* Form “Add food” with fields: `name`, `calories_per_serving`
* Insert entry into `foods` table
* List existing food entries
* Automatically refresh dashboard (`revalidatePath('/dashboard')`)

### **3.4 UI / Component Library**

* Use **shadcn/ui** for input components and buttons
* Uniform UI style across sign-in and sign-up pages
* Tailwind + shadcn theme integration

### **3.5 Developer Infrastructure**

* Supabase CLI installed
* `supabase gen types typescript` configured
* `database.types.ts` integrated into server and client Supabase clients
* Project structured for future expansion (e.g., charts, hydration logs, sleep tracking)

---

## 4. **Deliverables**

The MVP is considered complete when all items below are functional and tested.

### **4.1 Files / Code**

* ✔ Next.js project with App Router
* ✔ Supabase client configured (server + browser)
* ✔ `database.types.ts` included
* ✔ Sign Up page (with email confirmation)
* ✔ Login page
* ✔ Profiles table working
* ✔ Dashboard page with food list
* ✔ Food creation form
* ✔ shadcn/ui installed with at least Button + Input used
* ✔ All pages translated into English

### **4.2 Documentation**

* ✔ MVP Spec (this document)
* ✔ Database Schema (`schema.md` upcoming)
* ✔ Short notes on setup (CLI, types generation)

### **4.3 Functional Criteria**

* New users can sign up → email confirmation → log in → see dashboard
* User can add foods to the database
* Dashboard displays added entries
* No console errors

---

## 5. **Future Extensions (Optional)**

* Charts for calorie intake
* Daily logs (hydration, sleep, meals)
* AI‑powered habit suggestions
* Mobile layout improvements
* Multi-language support

---

## ✔ MVP Status: *Ready for Submission*

This document summarizes the BMAD-style MVP spec required for Task 3 and confirms that the application meets all core requirements.
