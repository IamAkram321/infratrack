# InfraTrack

InfraTrack is a backend system designed to report, track, and prioritize urban infrastructure issues such as potholes, broken streetlights, and damaged utility poles.  
The project focuses on real-world backend engineering concepts like workflow management, prioritization, scalability, and performance optimization.

---

## Problem

Urban infrastructure issues are usually identified through manual inspections or limited government patrols.  
This makes detection slow, reactive, and inconsistent—especially in non-prime or remote areas.

---

## Solution

InfraTrack enables citizens to report infrastructure issues, while providing authorities with a centralized system to:

- Track reported issues
- Prevent duplicate reports
- Prioritize critical problems
- Manage resolution workflows efficiently

---
```
## Backend Architecture

backend/
├── src/
│ ├── app.js # Express app initialization
│ ├── config/
│ │ └── db.js # MongoDB connection
│ ├── models/
│ │ └── Issue.js # Issue schema & indexes
│ ├── controllers/
│ │ └── issueController.js # Business logic
│ ├── routes/
│ │ └── issueRoutes.js # API routes
│ └── middlewares/
│ └── errorHandler.js # Centralized error handling

```

---

## Core Backend Features

### Issue Reporting
- Users can report issues with type and location
- Duplicate reports are prevented within a 24-hour window

### Workflow Management
- Issues move through states:  
  `reported → in_progress → fixed`
- Status updates use REST-correct PATCH endpoints

### Severity & Prioritization
- Severity is automatically derived from issue type
- Priority score is calculated and used to order issues for resolution

### Listing & Scalability
- Supports pagination using `page` and `limit`
- Supports filtering by `status` and `severity`
- Returns pagination metadata for frontend usage

### Performance Optimization
- MongoDB compound indexes added for frequently filtered and sorted fields
- Query patterns optimized to avoid full collection scans

---

## API Design Decisions

- Query parameters used for pagination and filtering
- Centralized error handling for consistent API responses
- Business logic isolated in controllers
- Database interactions abstracted via Mongoose models

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose

---

## Running the Backend Locally

```bash
cd backend
npm install

npm run dev
