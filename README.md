# BiteSpeed Backend Task — Identity Reconciliation

This repository contains the backend implementation for the **BiteSpeed Identity Reconciliation Task**.  
The service exposes a single POST API `/identify` that consolidates and reconciles customer identities using **primary/secondary contact linking**, ensuring all related contact entries are unified under a single identity.

---

#  Features Implemented (As per BiteSpeed Task Document)

###  Identity Reconciliation Based on Email & Phone  
- Matches customers by **email**, **phone**, or both.  
- Links multiple contact entries belonging to the same person.

###  Primary & Secondary Contact Logic  
- Oldest contact becomes **primary**.  
- Additional matching contacts become **secondary**.  
- New unique information creates new secondary entries.

###  Automatic Merging of Multiple Identities  
- If separate identity clusters are discovered (email match in one, phone match in another),  
  they are **merged into a single primary identity**.
  
###  Full Deduplication  
- Returns unique lists of:
  - Emails  
  - Phone numbers  
  - Secondary contact IDs  

###  Stable, Repeatable Responses  
- Multiple calls with the same inputs will always return the same consolidated identity state.

###  Database Normalization with Prisma  
- Proper relational model using `linkedId` and `linkPrecedence`.  
- Automatic timestamping (`createdAt`, `updatedAt`).  

###  Clean Commit History  
- Project initialized, Prisma models, service logic, controllers, routes, and deployment  
  all committed with **clear descriptive commits**, as required.

###  Fully Deployed Public API  
- Backend hosted on **Render** with a live `/identify` endpoint.  

---

# Tech Stack

- **Node.js** – Server runtime  
- **Express.js** – API framework  
- **PostgreSQL (NeonDB)** – Cloud database  
- **Prisma ORM** – Database schema, queries, migrations  
- **Render** – Deployment

---

# Problem Summary (As per the BiteSpeed Document)

Customers may place orders using different:

- Emails  
- Phone numbers  

The goal is to determine whether these records belong to the **same person**.

### Rules from the problem:

1. **If no matching contact exists → Create a new Primary contact.**  
2. **If matching contact(s) exist →**  
   - Find the **oldest** contact → mark as `primary`.  
   - Any additional contacts become `secondary`.  
3. If new input introduces previously unseen data (new email/phone),  
   a **new secondary** contact is created and linked to the primary.  
4. Identity graph grows over time, and responses always reflect the full linked network.  

---

# Database Schema (Prisma)

```prisma
model Contact {
  id             Int       @id @default(autoincrement())
  phoneNumber    String?
  email          String?
  linkedId       Int?
  linkPrecedence String    @default("primary")  // "primary" | "secondary"
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
