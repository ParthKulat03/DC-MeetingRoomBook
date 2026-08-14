# Room Booker Pro

Yes. Since you want **separate frontend and backend prompts**, the frontend prompt should be completely focused on the **React/Vite UI and API contract**, while still defining every API route the frontend expects.

I’ve also made the API contract explicit enough that when you later give the backend prompt to Claude/Lovable, the backend can implement the **exact same routes and response structure**.

# LOVABLE AI PROMPT — FRONTEND ONLY

## Corporate Meeting Room Booking & Management System

You are an expert React.js, TypeScript, UI/UX, and frontend architecture developer.

Build ONLY the **frontend application** for a Corporate Meeting Room Booking & Management System.

The backend will be developed separately.

Your job is to create a **complete, production-quality React frontend** with a clearly defined API integration layer so that the backend can later be connected without restructuring the frontend.

---

# 1. MANDATORY FRONTEND TECHNOLOGY

Use ONLY:

* React.js
* Vite
* TypeScript
* React Router
* Axios
* Tailwind CSS
* Recharts
* Lucide React icons
* Native React hooks/context

### DO NOT USE

* TanStack Router
* TanStack Query
* TanStack Table
* Next.js
* Remix
* Firebase
* Supabase client
* Mock backend services as the final implementation

Use:

### React + Vite + TypeScript

---

# 2. IMPORTANT ARCHITECTURE

The frontend must be completely separated from backend implementation.

Create a dedicated API layer:

```text
src/
├── api/
│   ├── client.ts
│   ├── auth.api.ts
│   ├── bookings.api.ts
│   ├── rooms.api.ts
│   ├── users.api.ts
│   ├── admin.api.ts
│   ├── reports.api.ts
│   ├── notifications.api.ts
│   └── settings.api.ts
│
├── websocket/
│   └── socket.ts
│
├── components/
├── pages/
├── layouts/
├── hooks/
├── contexts/
├── types/
├── utils/
├── constants/
└── routes/
```

The UI must never directly call Axios from random components.

All HTTP requests must go through the API service layer.

---

# 3. BACKEND CONTRACT

The backend will use:

```text
REST API
+
WebSocket
```

Frontend must be prepared for both.

Base URL:

```text
VITE_API_BASE_URL
```

WebSocket URL:

```text
VITE_WS_URL
```

Create:

```text
.env.example
```

with:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000/ws
```

Do NOT hard-code URLs.

---

# 4. API CLIENT

Create an Axios client.

Requirements:

* Base URL from environment
* JSON requests
* Authentication handling
* Request interceptor
* Response interceptor
* Centralized error handling
* Automatic handling of 401
* Typed responses

Example structure:

```text
apiClient
├── auth
├── bookings
├── rooms
├── users
├── admin
├── reports
├── notifications
└── settings
```

---

# 5. AUTHENTICATION API ROUTES

Frontend must be prepared for:

### POST

`/auth/request-verification`

Request:

```json
{
  "email": "employee@company.com"
}
```

Response should be handled in a flexible typed manner.

---

### POST

`/auth/verify-email`

Request:

```json
{
  "token": "verification-token"
}
```

---

### POST

`/auth/verify-otp`

Request:

```json
{
  "email": "employee@company.com",
  "otp": "123456"
}
```

---

### POST

`/auth/resend-otp`

Request:

```json
{
  "email": "employee@company.com"
}
```

---

### POST

`/auth/login`

Request:

```json
{
  "email": "employee@company.com"
}
```

---

### POST

`/auth/logout`

---

### GET

`/auth/me`

Used to restore the logged-in user's session.

---

# 6. AUTHENTICATION UI

Create:

### Login Page

Simple corporate login.

Fields:

* Company Email

Button:

### Continue

Possible states:

1. Email not registered
2. Email verification required
3. OTP required
4. Awaiting Admin approval
5. Account approved
6. Account disabled

If email is not found:

Show popup:

> "Your email is not registered. Please contact the administrator."

If email is verified but not approved:

> "Your email has been verified. Your account is awaiting administrator approval."

---

# 7. EMAIL VERIFICATION UI

Create verification screen.

Show:

### Verify Your Email

Allow:

* Verification link state
* OTP input
* Resend OTP
* Countdown timer
* Error state
* Success state

---

# 8. ROUTING

Use React Router.

Routes:

```text
/login
/verify-email
/verify-otp
/pending-approval

/dashboard

/bookings
/bookings/history

/admin
/admin/dashboard
/admin/users
/admin/rooms
/admin/bookings
/admin/reports
/admin/audit-logs
/admin/settings
```

Protect routes according to authentication and role.

---

# 9. APPLICATION LAYOUT

Create:

### Desktop

Left sidebar.

### Mobile

Responsive navigation drawer.

Sidebar items for users:

* Dashboard
* Book a Room
* My Bookings
* Booking History
* Help

Admin:

* Dashboard
* Users
* Rooms
* Bookings
* Reports
* Audit Logs
* Settings

Bottom/user area:

* Profile
* Theme Toggle
* Logout

---

# 10. USER DASHBOARD

Create a professional dashboard.

Display:

### Welcome

Employee name.

### Today's Bookings

### Upcoming Bookings

### Room Availability

Show:

Alpha

Beta

Quick action:

### Book a Room

---

# 11. ROOM AVAILABILITY API

Frontend must call:

### GET

`/rooms`

Response expected conceptually:

```json
{
  "rooms": [
    {
      "id": "room-id",
      "name": "Alpha",
      "description": "Meeting Room Alpha",
      "capacity": 8,
      "status": "ACTIVE"
    }
  ]
}
```

---

# 12. AVAILABILITY API

### GET

`/rooms/availability`

Query parameters:

```text
roomId
date
```

Example:

```text
/rooms/availability?roomId=1&date=2026-08-12
```

Return bookings/time blocks for that room/date.

Frontend must convert these bookings into the 15-minute timeline.

---

# 13. ⭐ MAIN BOOKING EXPERIENCE

This is the most important UI.

When user clicks:

### Book a Room

Open ONE large responsive dialog/card.

The entire booking journey must remain inside this same dialog.

Do NOT navigate to another page.

---

# 14. BOOKING STEPS

Inside the same dialog:

### STEP 1

Date + Room + Time

### STEP 2

Meeting Details

### STEP 3

Attendees

### STEP 4

Review + Confirm

Show:

```text
1 Time → 2 Details → 3 Attendees → 4 Confirm
```

The user can go backward and forward without losing information.

---

# 15. MICROSOFT TEAMS-STYLE TIME SELECTOR

The time selector must be inspired by Microsoft Teams/Outlook scheduling.

Do NOT copy their exact design or branding.

Create an original corporate UI.

The main interaction must be:

# DRAG TO SELECT TIME

---

# 16. 15-MINUTE TIME SLOTS

The timeline must use:

### 15-minute intervals.

Example:

```text
09:00
09:15
09:30
09:45
10:00
10:15
10:30
10:45
11:00
11:15
11:30
11:45
12:00
```

Continue through configured working hours.

Default:

```text
09:00 AM – 06:00 PM
```

---

# 17. DRAG-TO-SELECT

User should be able to:

1. Press/click a slot.
2. Drag across multiple slots.
3. Release.
4. Selected range becomes highlighted.

Example:

User drags:

```text
10:00
↓
10:15
↓
10:30
↓
10:45
↓
11:00
```

Result:

```text
10:00 AM → 11:15 AM
```

Duration:

```text
1 hour 15 minutes
```

---

# 18. TIME GRID UX

Each slot should clearly display its state.

### AVAILABLE

Normal selectable appearance.

### BOOKED

Grey.

### USER'S OWN BOOKING

Blue/Pink accent.

### PAST

Disabled/light grey.

### CURRENT TIME

Show a horizontal current-time indicator.

---

# 19. DRAG RESTRICTIONS

User must NOT be able to drag through:

* Booked slots
* Past slots
* Disabled room slots

If drag encounters a booked slot:

Stop/reject selection.

Show:

> "This time overlaps with an existing booking."

---

# 20. TOUCH SUPPORT

The drag selector must support:

* Mouse
* Touch
* Trackpad

Mobile users should be able to drag vertically across 15-minute slots.

---

# 21. TIME SELECTION FALLBACK

Provide a fallback for accessibility.

User can click:

### Start Time

and

### End Time

if drag selection is difficult.

But drag selection remains the PRIMARY interaction.

---

# 22. BOOKING FORM

Inside the same dialog collect:

### Date

### Meeting Room

### Time

### Meeting Title

### Meeting Purpose

### Attendees

### Notes

---

# 23. ATTENDEE COMPONENT

Allow multiple attendees.

Each attendee:

```text
Name
Designation
```

Buttons:

* Add attendee
* Remove attendee

---

# 24. NO CREDIT FEATURE

IMPORTANT:

There is NO credit system.

Do NOT show:

* Credits
* Credit balance
* Credit cost
* Monthly credits
* Credit deduction

Booking is based only on:

* Availability
* Date
* Time
* User authorization
* Booking rules

---

# 25. BOOKING SUMMARY

Final step should show:

```text
Confirm Booking

Room
Alpha

Date
12 August 2026

Time
10:00 AM – 11:15 AM

Duration
1 hour 15 minutes

Meeting
Project Discussion

Purpose
Project discussion

Attendees
3

Notes
...
```

Buttons:

### Back

### Confirm Booking

---

# 26. CREATE BOOKING API

### POST

`/bookings`

Request:

```json
{
  "roomId": "room-id",
  "date": "2026-08-12",
  "startTime": "10:00",
  "endTime": "11:15",
  "title": "Project Discussion",
  "purpose": "Project progress discussion",
  "notes": "Discuss milestones",
  "attendees": [
    {
      "name": "John Doe",
      "designation": "Developer"
    }
  ]
}
```

The frontend must NOT assume the booking succeeded just because the user clicked Confirm.

Wait for HTTP response.

---

# 27. BOOKING RESPONSE HANDLING

Handle:

### SUCCESS

Show success state inside the same dialog.

### 409 CONFLICT

Show:

> "This meeting room was just booked by another employee. Please select another time."

Refresh availability.

### 400

Show validation error.

### 401

Redirect to login.

### 403

Show authorization message.

### 500

Show friendly error.

---

# 28. SUCCESS STATE

Inside SAME dialog:

```text
✓

Booking Confirmed

Alpha

12 August 2026

10:00 AM – 11:15 AM

Booking ID:
MR-20260812-001
```

Buttons:

### View My Bookings

### Close

---

# 29. WEBSOCKET INTEGRATION

Create:

```text
src/websocket/socket.ts
```

Use native WebSocket.

Do NOT create multiple connections unnecessarily.

Use one authenticated WebSocket connection per application session.

---

# 30. WEBSOCKET EVENTS

Frontend must listen for:

```text
BOOKING_CREATED
BOOKING_UPDATED
BOOKING_CANCELLED
AVAILABILITY_UPDATED
ROOM_UPDATED
ADMIN_BOOKING_UPDATED
```

Payload concept:

```json
{
  "event": "BOOKING_CREATED",
  "roomId": "room-id",
  "date": "2026-08-12"
}
```

When receiving an event:

If the user is currently viewing that room/date:

### Refresh availability using HTTP.

Do NOT trust WebSocket data as the database source of truth.

---

# 31. WEBSOCKET RECONNECT

Implement:

* Automatic reconnect
* Connection status
* Cleanup
* Listener cleanup
* Re-authentication
* Availability refresh after reconnect

If WebSocket is disconnected:

The application MUST continue working.

HTTP remains functional.

---

# 32. MY BOOKINGS API

### GET

`/bookings/my`

Query parameters:

```text
page
limit
status
from
to
roomId
```

---

# 33. MY BOOKINGS PAGE

Display booking cards/table.

Columns:

* Booking ID
* Room
* Date
* Start
* End
* Meeting Title
* Status
* Created At
* Actions

---

# 34. CANCEL BOOKING API

### DELETE

`/bookings/:bookingId`

Before cancellation, frontend should check the booking state.

Backend remains authoritative.

If cancellation is too late:

Show:

> "Cancellation is no longer available. Please contact the administrator for approval."

---

# 35. BOOKING DETAILS API

### GET

`/bookings/:bookingId`

Show:

* Room
* Date
* Start
* End
* Meeting title
* Purpose
* Attendees
* Notes
* Status
* Created At
* Updated At

---

# 36. CALENDAR

Provide:

### Day

### Week

### Month

views.

---

# 37. DAY VIEW

Show Alpha/Beta room timelines.

Use 15-minute intervals.

Booked slots:

### Grey

Available:

### Selectable

Past:

### Disabled

---

# 38. WEEK VIEW

Display:

Monday → Sunday.

Show booking indicators.

Clicking a date should open the same booking dialog.

---

# 39. MONTH VIEW

Display:

* Dates
* Booking indicators
* Number of bookings
* Current date
* Selected date

Clicking date:

Open booking dialog with selected date.

---

# 40. ADMIN DASHBOARD

Create a complete admin dashboard.

Cards:

* Total Employees
* Active Employees
* Pending Approvals
* Total Bookings
* Today's Bookings
* Upcoming Bookings
* Cancelled Bookings
* Room Utilization

Charts:

* Daily bookings
* Weekly bookings
* Monthly bookings
* Alpha vs Beta usage
* Peak booking hours
* Cancellation statistics
* Room utilization

Use Recharts.

---

# 41. ADMIN DASHBOARD API

### GET

`/admin/dashboard`

Query:

```text
from
to
roomId
employeeId
```

---

# 42. ADMIN USERS API ROUTES

### GET

`/admin/users`

Query:

```text
page
limit
search
status
approvalStatus
```

### GET

`/admin/users/:id`

### POST

`/admin/users`

### PUT

`/admin/users/:id`

### DELETE

`/admin/users/:id`

### PATCH

`/admin/users/:id/approve`

### PATCH

`/admin/users/:id/reject`

### PATCH

`/admin/users/:id/enable`

### PATCH

`/admin/users/:id/disable`

---

# 43. ADMIN USER MANAGEMENT UI

Table:

* Employee ID
* Name
* Email
* Designation
* Verification
* Approval
* Account Status
* Created At

Actions:

* Approve
* Reject
* Edit
* Enable
* Disable
* Delete
* View bookings

Include search/filter/pagination.

---

# 44. EXCEL IMPORT

Frontend UI:

### Upload Employees

Accept:

`.xlsx`

API:

### POST

`/admin/users/import`

Use multipart/form-data.

Show upload progress.

After completion display:

* Total
* Imported
* Updated
* Invalid
* Duplicate
* Failed

Allow downloading error report.

---

# 45. ADMIN ROOMS

### GET

`/admin/rooms`

### POST

`/admin/rooms`

### PUT

`/admin/rooms/:id`

### DELETE

`/admin/rooms/:id`

### PATCH

`/admin/rooms/:id/status`

---

# 46. ADMIN ROOM MANAGEMENT UI

Display:

* Room name
* Description
* Capacity
* Status

Actions:

* Add
* Edit
* Activate
* Deactivate

---

# 47. ADMIN BOOKING ROUTES

### GET

`/admin/bookings`

Query:

```text
page
limit
search
roomId
employeeId
status
from
to
```

### GET

`/admin/bookings/:id`

### PUT

`/admin/bookings/:id`

### DELETE

`/admin/bookings/:id`

---

# 48. ADMIN BOOKING MANAGEMENT

Admin can modify:

* Employee
* Room
* Date
* Start
* End
* Meeting title
* Purpose
* Attendees
* Notes

Use the SAME booking dialog component where practical, but provide Admin-specific controls.

---

# 49. REPORT API ROUTES

### GET

`/admin/reports/bookings`

### GET

`/admin/reports/room-utilization`

### GET

`/admin/reports/cancellations`

Query:

```text
from
to
roomId
employeeId
```

---

# 50. REPORT UI

Allow Admin to:

* Select date range
* Select room
* Select employee
* Generate report
* Download Excel

Use browser download from the backend response.

Do not generate fake files on frontend.

---

# 51. AUDIT LOG API

### GET

`/admin/audit-logs`

Query:

```text
page
limit
action
actorId
from
to
```

Display:

* Actor
* Action
* Description
* Entity
* Timestamp

---

# 52. SETTINGS API

### GET

`/admin/settings`

### PUT

`/admin/settings`

Settings:

```text
minimumBookingDuration
maximumBookingDuration
cancellationCutoffMinutes
reminderMinutes
workingDayStart
workingDayEnd
timezone
```

---

# 53. NOTIFICATION API

### GET

`/notifications`

### PATCH

`/notifications/:id/read`

### PATCH

`/notifications/read-all`

Create notification UI.

---

# 54. ERROR STATES

Every page must have:

* Loading state
* Empty state
* Error state
* Retry action

Do not leave blank screens.

---

# 55. TOAST NOTIFICATIONS

Use a lightweight toast solution or create a reusable toast component.

Examples:

Success:

> Booking confirmed.

Error:

> Unable to complete booking.

Info:

> Room availability updated.

Warning:

> Your account is awaiting approval.

---

# 56. GUIDED TOUR

Create first-time user tour.

Steps:

1. Welcome
2. Dashboard
3. Room availability
4. Book a room
5. Drag time slots
6. Meeting details
7. Attendees
8. My bookings
9. Cancellation

Buttons:

* Next
* Back
* Skip
* Finish

Store tour completion through:

### GET

`/user/tour`

### POST

`/user/tour/complete`

### POST

`/user/tour/reset`

---

# 57. PROFILE

Create profile page/dropdown.

Show:

* Name
* Employee ID
* Email
* Designation
* Account status

No user self-registration.

---

# 58. THEME

Support:

### Light

### Dark

Use blue and pink accents.

Persist theme preference locally.

---

# 59. UI DESIGN

The design should be:

* Corporate
* Professional
* Modern
* Simple
* Subtle
* Easy for a layman

Use:

* Rounded cards
* Clear typography
* Consistent spacing
* Blue primary actions
* Pink accent
* Grey booked slots
* Clear status badges

Avoid:

* Excessive gradients
* Excessive animations
* Clutter
* Gaming-style UI

---

# 60. RESPONSIVE DESIGN

Desktop:

Sidebar + content.

Tablet:

Collapsible sidebar.

Mobile:

Bottom navigation or mobile drawer.

Booking dialog on mobile:

### Full-screen modal.

Time selector:

### Touch drag supported.

---

# 61. ACCESSIBILITY

Implement:

* Keyboard navigation
* Focus management
* Accessible labels
* Modal focus trap
* Escape handling
* Screen reader-friendly inputs
* Clear disabled states
* Sufficient contrast

---

# 62. FRONTEND TYPES

Create shared TypeScript interfaces/types for:

* User
* MeetingRoom
* Booking
* BookingAttendee
* Notification
* AuditLog
* DashboardStats
* Report
* SystemSettings
* API response
* WebSocket events

Do not use `any` unnecessarily.

---

# 63. API RESPONSE HANDLING

Create consistent API utilities.

Handle:

```text
200
201
400
401
403
404
409
422
500
```

Especially:

### 409

Treat as booking conflict.

Refresh availability.

---

# 64. API ROUTE CONSTANTS

Create:

```text
src/constants/apiRoutes.ts
```

Store all routes there.

Do NOT scatter URL strings throughout components.

---

# 65. LOADING STATES

Use:

* Skeleton loaders
* Button loading states
* Table loading states
* Calendar loading states
* Availability loading states

During booking confirmation:

Button becomes:

### Booking...

Prevent duplicate submission.

---

# 66. OPTIMIZED BOOKING FLOW

The booking dialog should:

1. Load rooms.
2. Load availability only for selected room/date.
3. Update availability when room/date changes.
4. Maintain local form state.
5. Validate locally.
6. Submit only once.
7. Wait for backend response.
8. React to WebSocket updates.
9. Refresh availability after conflicts.
10. Show confirmation.

Do NOT make unnecessary API requests.

---

# 67. CODE QUALITY

Write clean optimized code.

Follow:

* DRY
* SOLID
* Reusable components
* Strong TypeScript typing
* Separation of concerns
* Custom hooks where appropriate
* Centralized API services

Avoid premature optimization.

Use `useMemo`, `useCallback`, and `React.memo` only where useful.

---

# 68. IMPORTANT TIME GRID PERFORMANCE

The timeline may contain many 15-minute slots.

Create reusable components:

```text
TimeGrid
TimeSlot
RoomTimeline
BookingBlock
```

Avoid unnecessary re-rendering.

Memoize slot components where beneficial.

Dragging must remain smooth.

---

# 69. WEBSOCKET PERFORMANCE

Use one shared WebSocket connection.

Handle:

* Connect
* Disconnect
* Reconnect
* Authentication
* Event subscription
* Cleanup

Do not create a socket for every component.

---

# 70. FRONTEND ENVIRONMENT

Create:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000/ws
```

Also provide:

```text
.env.example
```

---

# 71. IMPORTANT BACKEND CONTRACT

The backend developer will implement the following REST API structure.

Do NOT change route names unless absolutely necessary.

## AUTH

```text
POST /api/auth/request-verification
POST /api/auth/verify-email
POST /api/auth/verify-otp
POST /api/auth/resend-otp
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## ROOMS

```text
GET /api/rooms
GET /api/rooms/:id
GET /api/rooms/availability
```

## USER BOOKINGS

```text
POST   /api/bookings
GET    /api/bookings/my
GET    /api/bookings/:bookingId
DELETE /api/bookings/:bookingId
```

## USER TOUR

```text
GET  /api/user/tour
POST /api/user/tour/complete
POST /api/user/tour/reset
```

## NOTIFICATIONS

```text
GET   /api/notifications
PATCH /api/notifications/:id/read
PATCH /api/notifications/read-all
```

## ADMIN DASHBOARD

```text
GET /api/admin/dashboard
```

## ADMIN USERS

```text
GET    /api/admin/users
GET    /api/admin/users/:id
POST   /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
PATCH  /api/admin/users/:id/approve
PATCH  /api/admin/users/:id/reject
PATCH  /api/admin/users/:id/enable
PATCH  /api/admin/users/:id/disable
POST   /api/admin/users/import
```

## ADMIN ROOMS

```text
GET    /api/admin/rooms
POST   /api/admin/rooms
PUT    /api/admin/rooms/:id
DELETE /api/admin/rooms/:id
PATCH  /api/admin/rooms/:id/status
```

## ADMIN BOOKINGS

```text
GET    /api/admin/bookings
GET    /api/admin/bookings/:id
PUT    /api/admin/bookings/:id
DELETE /api/admin/bookings/:id
```

## REPORTS

```text
GET /api/admin/reports/bookings
GET /api/admin/reports/room-utilization
GET /api/admin/reports/cancellations
```

## AUDIT LOGS

```text
GET /api/admin/audit-logs
```

## SETTINGS

```text
GET /api/admin/settings
PUT /api/admin/settings
```

---

# 72. DO NOT IMPLEMENT BACKEND

For this task:

### DO NOT build the backend.

Instead:

* Build the complete frontend.
* Create the API service layer.
* Create TypeScript types.
* Create API route constants.
* Create WebSocket service.
* Use realistic loading/error states.
* Keep API integration ready.

If temporary development data is absolutely required for UI rendering, isolate it clearly in:

```text
src/dev/
```

and make it easy to remove.

Do not make mock data part of the actual application architecture.

---

# 73. FINAL FRONTEND REQUIREMENTS

Before considering the frontend complete, verify:

### Authentication

✓ Login UI

✓ Email verification

✓ OTP

✓ Approval state

✓ Protected routes

### User

✓ Dashboard

✓ Room availability

✓ Booking

✓ 15-minute slots

✓ Drag-to-select

✓ Meeting details

✓ Attendees

✓ Booking confirmation

✓ Booking history

✓ Cancellation

### Real-time

✓ WebSocket connection

✓ Booking-created event

✓ Booking-updated event

✓ Booking-cancelled event

✓ Availability refresh

✓ Reconnection

### Admin

✓ Dashboard

✓ Users

✓ Excel import UI

✓ Rooms

✓ Bookings

✓ Reports

✓ Audit logs

✓ Settings

### UX

✓ One booking dialog

✓ Light/dark mode

✓ Responsive

✓ Guided tour

✓ Loading states

✓ Error states

✓ Empty states

✓ Toast notifications

✓ Accessibility

---

# 74. FINAL DESIGN PRINCIPLE

The application should feel like a polished internal corporate product.

The most important interaction is:

## Select a room → choose a date → DRAG ACROSS 15-MINUTE SLOTS → enter meeting details → add attendees → review → confirm.

The complete process must happen inside:

# ONE SINGLE BOOKING CARD/DIALOG.

The UI should be intuitive enough that a first-time corporate employee can book a room without training.

Build the frontend with clean, reusable, optimized React code and make the API/WebSocket integration extremely straightforward for the separate backend implementation.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1eb626fe-555f-430a-b6af-11dd46e31cf9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
