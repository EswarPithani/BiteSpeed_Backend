# BiteSpeed Backend Task — Identity Reconciliation

This repository contains the backend implementation for the BiteSpeed Identity Reconciliation task.  
The service exposes a single POST API `/identify` that links customer identities based on email and phone numbers by maintaining primary/secondary relationships.

---

## Tech Stack

- **Node.js + Express**
- **PostgreSQL (Neon DB)**
- **Prisma ORM**
- **Render (for deployment)**

---

## Project Structure
src/
├── app.js
├── server.js
├── db.js
├── routes/
│ └── identify.route.js
├── controllers/
│ └── identify.controller.js
└── services/
└── identify.service.js

prisma/
├── schema.prisma
└── migrations/


---

## Problem Statement (Summary)

Customers may use different emails or phone numbers across purchases.  
The goal is to identify if multiple contacts belong to the same person.

A "Contact" record is stored as:

- **Primary contact** → the oldest entry
- **Secondary contact** → linked to primary via `linkedId`

A customer is considered the same if:

- email matches OR  
- phoneNumber matches

---

## API Endpoint

### **POST /identify**

#### Request Body:

```json
{
  "email": "abc@example.com",
  "phoneNumber": "1234567890"
}


### **Core Logic Implemented**

Search database for any contact matching email/phone

If none found → create new primary

If found →

Identify oldest record → primary

Add new secondary if new info exists

Merge all linked contacts and return consolidated identity