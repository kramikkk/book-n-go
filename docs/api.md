# BookNGo — Frontend Integration Guide

This guide covers everything the frontend needs to connect to the API. All endpoints are Next.js API routes — no external base URL needed, just call them relative to the app root (e.g. `fetch('/api/auth/login')`).

---

## Table of Contents
1. [Auth](#1-auth)
2. [Profile](#2-profile)
3. [Avatar](#3-avatar)
4. [Admin — Dashboard](#4-admin--dashboard)
5. [Admin — Bookings](#5-admin--bookings)
6. [Admin — Services](#6-admin--services)
7. [Admin — Settings](#7-admin--settings)
8. [Admin — Logo](#8-admin--logo)
9. [Response Shape Reference](#9-response-shape-reference)
10. [Error Handling](#10-error-handling)

---

## 1. Auth

### Register
**`POST /api/auth/register`**

Creates a new customer account. Role is always set to `customer` — it cannot be set from the frontend.

```ts
const res = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email:       'user@example.com',  // required
    password:    'password123',       // required, min 8 chars
    first_name:  'Juan',              // required
    last_name:   'Dela Cruz',         // required
    phone:       '+63912345678',      // required
    middle_name: 'Santos',            // optional
  }),
})
const data = await res.json()
// 201: { message: string }
// 400: { error: 'Email, password, first name, last name and phone number are required' }
// 400: { error: 'Invalid email address' }
// 400: { error: 'Password must be at least 8 characters' }
// 409: { error: 'An account with this email already exists' }
```

> After registration, Supabase sends a verification email. Show the user a message to check their inbox before they can log in.

---

### Login
**`POST /api/auth/login`**

```ts
const res = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email:    'user@example.com',
    password: 'password123',
  }),
})
const data = await res.json()
// 200: { message: string, user: LoginUser }
// 400: { error: 'Email and password are required' }
// 401: { error: 'Invalid email or password' }
```

> **Note:** The login response returns a `LoginUser` object, not the full `Profile`. It only contains `id`, `first_name`, `last_name`, `email`, `role`, and `avatar_url`. Call `GET /api/profile` after login if you need `middle_name`, `phone`, or `created_at`.

The `user.role` field in the response tells you where to redirect:
- `'admin'` → redirect to `/admin/dashboard`
- `'customer'` → redirect to `/{slug}/book-now` or customer dashboard

---

### Logout
**`POST /api/auth/logout`**

Always returns `200` even if the user is already logged out — safe to call unconditionally.

```ts
const res = await fetch('/api/auth/logout', { method: 'POST' })
// 200: { message: 'Logged out successfully' }
```

---

### Change Password
**`POST /api/auth/change-password`**

User must be logged in. Requires the current password as a security check.

```ts
const res = await fetch('/api/auth/change-password', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    currentPassword: 'oldPassword123',
    newPassword:     'newPassword456',
  }),
})
const data = await res.json()
// 200: { message: 'Password updated successfully' }
// 400: { error: 'Current password is required' }
// 400: { error: 'New password is required' }
// 400: { error: 'New password must be at least 8 characters' }
// 400: { error: 'New password must be different from your current password' }
// 401: { error: 'Current password is incorrect' }
```

---

## 2. Profile

Works for **both admin and customer** accounts. Uses the session to identify the user — no user ID needed in the request.

### Get Profile
**`GET /api/profile`**

Call this on page load to pre-fill profile forms.

```ts
const res = await fetch('/api/profile')
const { profile } = await res.json()
// 200: { profile: Profile }
// 401: { error: 'You must be logged in' }
```

**Profile shape:**
```ts
{
  id:          string
  first_name:  string | null
  middle_name: string | null
  last_name:   string | null
  email:       string | null
  phone:       string | null
  avatar_url:  string        // defaults to 'default-avatar.png'
  role:        'admin' | 'customer'
  created_at:  string
}
```

---

### Update Profile
**`PATCH /api/profile`**

```ts
const res = await fetch('/api/profile', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    first_name:  'Juan',           // required
    last_name:   'Dela Cruz',      // required
    phone:       '+63912345678',   // required
    middle_name: 'Santos',         // optional — send null to clear
    email:       'new@email.com',  // optional — triggers confirmation email
  }),
})
const data = await res.json()
// 200: { message: 'Profile updated successfully', profile: Profile }
// 400: { error: 'First name and last name are required' }
// 400: { error: 'Phone number is required' }
// 400: { error: 'Invalid email address' }
```

> **Email change note:** If the user changes their email, Supabase sends a confirmation email to the new address. The change only takes effect after the user clicks the link. Show a message like "Check your new email to confirm the change."

---

## 3. Avatar

### Upload Avatar
**`POST /api/profile/avatar`**

Accepts `multipart/form-data`. JPG, PNG, or GIF only. Max 2MB.

```ts
const formData = new FormData()
formData.append('avatar', file) // File object from <input type="file">

const res = await fetch('/api/profile/avatar', {
  method: 'POST',
  body: formData,
  // Do NOT set Content-Type header — browser sets it automatically with the boundary
})
const data = await res.json()
// 200: { message: 'Avatar updated successfully', avatar_url: string }
// 400: { error: 'No image file provided' }
// 400: { error: 'Only JPG, PNG and GIF files are allowed' }
// 400: { error: 'File size must be less than 2MB' }
```

After a successful upload, update the displayed avatar using `avatar_url` from the response.

---

### Remove Avatar
**`DELETE /api/profile/avatar`**

Resets the avatar back to the default image.

```ts
const res = await fetch('/api/profile/avatar', { method: 'DELETE' })
const data = await res.json()
// 200: { message: 'Avatar removed successfully' }
```

---

## 4. Admin — Dashboard

### Get Dashboard Data
**`GET /api/admin/dashboard`**

Returns everything needed to render the dashboard in one request. Pass the user's IANA timezone so charts and the current week are calculated correctly.

```ts
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone // e.g. 'Asia/Manila'
const res = await fetch(`/api/admin/dashboard?tz=${encodeURIComponent(tz)}`)
const data = await res.json()
// 200: { stats, barChart, pieChart, upcoming }
// 401: { error: 'Unauthorized' }
// 403: { error: 'Forbidden' }
```

**Response shape:**
```ts
{
  stats: {
    total:     number  // total booking count
    pending:   number
    completed: number
    canceled:  number
  },

  barChart: {
    daily:   BarChartEntry[]  // Mon–Sun of current week
    monthly: BarChartEntry[]  // Jan–Dec of current year
    yearly:  BarChartEntry[]  // last 5 years
  },

  pieChart: {
    reservation: PieChartEntry[]
    appointment: PieChartEntry[]
  },

  upcoming: Booking[]  // next 10 pending bookings from today
}

// BarChartEntry
{ label: string, reservation: number, appointment: number }

// PieChartEntry
{ status: 'pending' | 'completed' | 'canceled', count: number, fill: string }
```

**Wiring to components:**
- `stats` → `DashboardCards` (replace hardcoded numbers)
- `barChart` → `ChartBar` (pass `daily`, `monthly`, or `yearly` based on selected tab)
- `pieChart` → `ChartPie` (pass `reservation` or `appointment`)
- `upcoming` → `UpcomingTable` (replace mock data)

---

## 5. Admin — Bookings

### Get All Bookings
**`GET /api/admin/bookings`**

```ts
// All params are optional
const params = new URLSearchParams({
  status: 'Pending',        // Pending | Completed | Canceled
  type:   'Appointment',    // Appointment | Reservation
  date:   '2026-03-19',     // exact date — cannot combine with from/to
  from:   '2026-03-01',     // range start
  to:     '2026-03-31',     // range end
})

const res = await fetch(`/api/admin/bookings?${params}`)
const { bookings } = await res.json()
// 200: { bookings: Booking[] }
// 400: { error: 'Use either `date` or `from`/`to`, not both' }
```

**Booking shape:**
```ts
{
  id:         string
  name:       string        // customer name at time of booking
  contact:    string        // customer phone at time of booking
  date:       string        // 'YYYY-MM-DD'
  time_start: string        // 'HH:MM:SS'
  time_end:   string        // 'HH:MM:SS'
  type:       'Appointment' | 'Reservation'
  status:     'Pending' | 'Completed' | 'Canceled'
  created_at: string
  customer: {
    id:         string
    first_name: string | null
    last_name:  string | null
    email:      string | null
  } | null
}
```

**Wiring to `BookingsTable`:** Replace the hardcoded `bookings` array with this API call. Map `time_start`/`time_end` to the `timeStart`/`timeEnd` fields the table expects.

---

### Update Booking Status
**`PATCH /api/admin/bookings/[id]`**

Used by the "Mark as Completed" and "Cancel Booking" actions in the bookings table dropdown.

```ts
const res = await fetch(`/api/admin/bookings/${bookingId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'Completed', // 'Pending' | 'Completed' | 'Canceled'
  }),
})
const data = await res.json()
// 200: { message: 'Booking updated successfully', booking: { id, status } }
// 400: { error: 'status is required' }
// 400: { error: 'Invalid status. Must be one of: Pending, Completed, Canceled' }
// 404: { error: 'Booking not found or you do not have permission to update it' }
```

After a successful update, refresh the bookings list or update the row in local state.

---

## 6. Admin — Services

### Get Services
**`GET /api/admin/services`**

Call this on settings page load to populate the `ServicesManager`.

```ts
const res = await fetch('/api/admin/services')
const { services } = await res.json()
// 200: { services: { appointment: Service[], reservation: Service[] } }
```

**Service shape:**
```ts
{
  id:          string
  type:        'appointment' | 'reservation'
  label:       string
  description: string | null
  sort_order:  number
  created_at:  string
}
```

---

### Add Service
**`POST /api/admin/services`**

Called when the admin clicks "Add Service" in `ServicesManager`.

```ts
const res = await fetch('/api/admin/services', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type:        'appointment',  // required: 'appointment' | 'reservation'
    label:       'Haircut',      // required
    description: 'Basic cut',   // optional
  }),
})
const data = await res.json()
// 201: { message: 'Service created successfully', service: Service }
// 400: { error: 'Type and label are required' }
// 400: { error: 'Label cannot be empty' }
```

---

### Update Service
**`PATCH /api/admin/services/[id]`**

Called when the admin edits a service label or description inline.

```ts
const res = await fetch(`/api/admin/services/${serviceId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    label:       'New Label',       // optional
    description: 'New description', // optional — send null to clear
  }),
})
const data = await res.json()
// 200: { message: 'Service updated successfully', service: Service }
// 400: { error: 'Provide at least one field to update: label or description' }
// 404: { error: 'Service not found or you do not have permission to update it' }
```

---

### Delete Service
**`DELETE /api/admin/services/[id]`**

Called when the admin clicks the trash icon on a service.

```ts
const res = await fetch(`/api/admin/services/${serviceId}`, {
  method: 'DELETE',
})
const data = await res.json()
// 200: { message: 'Service deleted successfully' }
// 404: { error: 'Service not found or you do not have permission to delete it' }
```

---

### Reorder Services
**`PATCH /api/admin/services/[id]`** (with `orderedIds`)

Called after drag-and-drop reordering. Send the full ordered array of IDs for that service type. Pass any service ID from that type as the `[id]` param — it is only used for auth scoping.

```ts
const res = await fetch(`/api/admin/services/${anyServiceId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderedIds: ['uuid-1', 'uuid-2', 'uuid-3'], // IDs in new order
  }),
})
const data = await res.json()
// 200: { message: 'Services reordered successfully' }
// 400: { error: 'orderedIds must be a non-empty array' }
```

> Note: `orderedIds` and `label`/`description` are mutually exclusive — send one or the other, not both.

---

## 7. Admin — Settings

### Get Settings
**`GET /api/admin/settings`**

Call on settings page load to pre-fill all forms. Returns `null` for new admins who haven't saved settings yet — handle this gracefully with empty defaults.

```ts
const res = await fetch('/api/admin/settings')
const { settings } = await res.json()
// 200: { settings: Settings | null }
```

**Settings shape:**
```ts
{
  id:                  string
  admin_id:            string
  business_name:       string | null
  logo_url:            string | null
  slug:                string | null
  welcome_message:     string | null
  seo_title:           string | null
  seo_description:     string | null
  primary_color:       'blue' | 'indigo' | 'purple' | 'rose' | 'orange' | 'green' | 'teal'
  new_booking_alerts:  boolean
  cancellation_alerts: boolean
}
```

---

### Update Settings
**`PATCH /api/admin/settings`**

All fields are optional — only send what changed. Works for both first-time saves and updates (upsert).

```ts
const res = await fetch('/api/admin/settings', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    // Send only the fields you want to update
    slug:                'my-salon',
    welcome_message:     'Welcome to My Salon!',
    seo_title:           'My Salon | Book Online',
    seo_description:     'Book your appointment fast and easy.',
    primary_color:       'teal',
    new_booking_alerts:  true,
    cancellation_alerts: false,
  }),
})
const data = await res.json()
// 200: { message: 'Settings updated successfully', settings: Settings }
// 400: { error: 'No fields provided to update' }
// 400: { error: 'Slug must be 3–50 characters, lowercase letters, numbers, and hyphens only' }
// 400: { error: 'Welcome message must be 300 characters or less' }
// 400: { error: 'SEO title must be 60 characters or less' }
// 400: { error: 'SEO description must be 160 characters or less' }
// 409: { error: 'That slug is already taken' }
```

**Wiring to components:**
- `WebsiteConfiguration` → send `slug`, `welcome_message`, `seo_title`, `seo_description`
- `ChangeTheme` → send `primary_color`
- Notification toggles (when built) → send `new_booking_alerts`, `cancellation_alerts`

---

## 8. Admin — Logo

### Upload Logo
**`POST /api/admin/settings/logo`**

Accepts `multipart/form-data`. JPG, PNG, or GIF only. Max 2MB. Optionally updates `business_name` at the same time.

```ts
const formData = new FormData()
formData.append('logo', file)                    // required
formData.append('business_name', 'My Salon')     // optional

const res = await fetch('/api/admin/settings/logo', {
  method: 'POST',
  body: formData,
  // Do NOT set Content-Type header manually
})
const data = await res.json()
// 200: { message: 'Logo updated successfully', logo_url: string }
// 400: { error: 'No logo file provided' }
// 400: { error: 'Only JPG, PNG and GIF files are allowed' }
// 400: { error: 'File size must be less than 2MB' }
```

---

### Remove Logo
**`DELETE /api/admin/settings/logo`**

Clears `logo_url` from settings.

```ts
const res = await fetch('/api/admin/settings/logo', { method: 'DELETE' })
const data = await res.json()
// 200: { message: 'Logo removed successfully' }
```

---

## 9. Response Shape Reference

### Profile
```ts
type Profile = {
  id:          string
  first_name:  string | null
  middle_name: string | null
  last_name:   string | null
  email:       string | null
  phone:       string | null
  avatar_url:  string
  role:        'admin' | 'customer'
  created_at:  string
}
```

### Booking
```ts
type Booking = {
  id:         string
  name:       string
  contact:    string
  date:       string        // 'YYYY-MM-DD'
  time_start: string        // 'HH:MM:SS'
  time_end:   string        // 'HH:MM:SS'
  type:       'Appointment' | 'Reservation'
  status:     'Pending' | 'Completed' | 'Canceled'
  created_at: string
  customer: {
    id:         string
    first_name: string | null
    last_name:  string | null
    email:      string | null
  } | null
}
```

### Service
```ts
type Service = {
  id:          string
  type:        'appointment' | 'reservation'
  label:       string
  description: string | null
  sort_order:  number
  created_at:  string
}
```

---

## 10. Error Handling

All errors return `{ error: string }` with an appropriate HTTP status code:

| Status | Meaning |
|--------|---------|
| 400 | Bad request — missing or invalid fields |
| 401 | Not logged in |
| 403 | Logged in but not allowed (wrong role) |
| 404 | Resource not found or not owned by you |
| 409 | Conflict — e.g. slug already taken, email already registered |
| 500 | Server error |

**Recommended pattern for all API calls:**

```ts
async function callApi(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, options)
    const data = await res.json()

    if (!res.ok) {
      // Show data.error to the user
      console.error(data.error)
      return null
    }

    return data
  } catch (err) {
    // Network error
    console.error('Network error', err)
    return null
  }
}
```

**Session / auth errors:**
- On `401` — redirect the user to the login page
- On `403` — redirect to their correct dashboard (wrong role)

These are already handled by `middleware.ts` for page navigation, but you should still handle them in client-side fetch calls for edge cases.
