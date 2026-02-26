# BiteSpeed Backend Task — Identity Reconciliation

This repository contains the backend implementation for the **BiteSpeed Identity Reconciliation Task**.  
The service exposes a single POST API `/identify` that links customer identities based on email and phone numbers by maintaining primary/secondary relationships across multiple contact entries.

---

## Tech Stack

- **Node.js**
- **Express.js**
- **PostgreSQL (NeonDB)**
- **Prisma ORM**
- **Render (Deployment)**

---

## Problem Summary

Customers may make purchases using different combinations of:

- Email addresses
- Phone numbers

The goal of this service is to identify whether multiple such contacts belong to the same individual.  

To do this, we maintain a **Contact** table where:

- The **oldest record** among related contacts becomes the **primary** contact.
- Any additional records linked by matching email or phone become **secondary** contacts.
- All contacts linked to a single user are reconciled and returned as a consolidated identity response.

---

## Database Schema (Prisma)

```prisma
model Contact {
  id             Int       @id @default(autoincrement())
  phoneNumber    String?
  email          String?
  linkedId       Int?
  linkPrecedence String    @default("primary")  // "primary" or "secondary"
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  deletedAt      DateTime?


  primaryContact     Contact?     @relation("PrimarySecondary", fields: [linkedId], references: [id])
  secondaryContacts  Contact[]    @relation("PrimarySecondary")
}


## Project Structure

bitespeed-backend/
├── prisma/
│ ├── schema.prisma
│ └── migrations/
├── src/
│ ├── routes/
│ │ └── identify.route.js
│ ├── controllers/
│ │ └── identify.controller.js
│ ├── services/
│ │ └── identify.service.js
│ ├── db.js
│ ├── app.js
│ └── server.js
├── package.json
├── package-lock.json
├── .gitignore
├── .env 
└── README.md


## Request Body

{
  "email": "abc@example.com",
  "phoneNumber": "1234567890"
}

## Response Body

{
  "contact": {
    "primaryContactId": 1,
    "emails": ["abc@example.com", "another@example.com"],
    "phoneNumbers": ["1234567890", "9876543210"],
    "secondaryContactIds": [5, 8]
  }
}


1. Install dependencies
npm install

2. Run migrations
npx prisma migrate dev

3. Start server
npm run dev

Server runs on:
http://localhost:3000

Test API:
POST → http://localhost:3000/identify

Deployment (Render)

This backend is deployed on Render.

Live API Endpoint:
<YOUR_RENDER_BACKEND_URL>/identify
