# Kowope (Ajo) — User & Admin Flow + Suggested Backend Shape

This file describes the intended flow for:
- A normal user who joins groups and submits contributions
- A group admin who manages contribution reviews and payouts

It also includes suggestions for how the backend API should be structured to support the UI cleanly.

## Roles

**User**
- Can create a group (becomes an admin of that group)
- Can join a group using an invite code
- Can view groups they belong to
- Can submit a contribution (with transaction reference + optional receipt)

**Group Admin**
- A user who has `is_admin=true` in `group_members` for a group
- Can review contributions submitted by members in their group(s)
- Can mark contributions as confirmed/rejected
- Can record payouts (who received the pot for a cycle)

## Core Objects (Conceptual)

**User**
- id, email, full_name, phone

**Group**
- id, name, amount, frequency (Weekly/Monthly), total_members, invite_code
- current_cycle (1..total_members)
- start_date
- bank details: bank_name, bank_account_number, bank_account_name (optional)

**Group Member**
- group_id, user_id, payout_position (1..total_members), is_admin

**Contribution**
- group_id, member_id, cycle_number, amount
- transaction_reference
- receipt_url (optional; can be a URL or a stored data URL for now)
- status: pending | confirmed | rejected
- submitted_at, reviewed_by, reviewed_at

**Payout**
- group_id, recipient_id, cycle_number, amount
- paid_at, recorded_by

## User Flow (Happy Path)

### 1) Sign up / Sign in
1. User signs up
   - UI: `/auth` (signup tab)
   - Backend: `POST /auth/signup`
   - Response: `{ token, user }`
2. UI stores token and user, then routes to dashboard
3. Subsequent app loads call:
   - Backend: `GET /auth/me` (token required)

### 2) Dashboard
1. UI loads user groups
   - Backend: `GET /groups`
2. Dashboard shows:
   - Total contributed (my contributions sum across groups)
   - Pending payments (myPaidThisCycle false for some groups)
   - Next payout info (computed by backend)

### 3) Create a group (user becomes admin)
1. User opens `/create-group` and submits form
2. Backend creates group + inserts creator into group_members as admin
   - Backend: `POST /groups`
   - Response: `{ groupId, inviteCode }`
3. UI shows invite code/link

### 4) Join a group
1. User opens `/join-group`, enters invite code
2. Backend checks capacity, assigns next payout_position, inserts membership
   - Backend: `POST /groups/join`
   - Response: `{ groupId }`
3. UI routes to `/group/:id`

### 5) View group details
1. UI loads group summary
   - Backend: `GET /groups` (find one) OR `GET /groups/:id` (recommended)
2. UI loads members list + their paid status for current cycle
   - Backend: `GET /groups/:groupId/members`
3. If the current user has not paid this cycle, UI shows “Pay” button

### 6) Submit contribution (pay flow)
1. User transfers money to the group bank account outside the app
2. User enters transaction reference and uploads receipt screenshot
3. Backend records contribution as pending
   - Backend: `POST /groups/:groupId/contributions`
   - Body: `{ transactionReference, receiptUrl? }`
4. UI shows success state: “Pending review”

## Admin Flow (Happy Path)

### 1) Admin reviews contributions
1. Admin opens `/payments`
2. UI loads contributions for admin’s groups filtered by status:
   - Backend: `GET /admin/contributions?status=pending|confirmed|rejected`
3. Admin opens receipt and verifies transfer

### 2) Admin confirms/rejects contribution
1. Admin clicks Confirm or Reject
2. Backend updates contribution status and reviewer metadata
   - Backend: `PATCH /admin/contributions/:id`
   - Body: `{ status: "confirmed" | "rejected" }`
3. UI removes item from the list and shows toast

### 3) Admin records payout (recommended)
When a cycle completes (or at admin’s decision), record a payout:
1. Admin selects recipient for the cycle (normally payout_position for current_cycle)
2. Backend records payout row
3. Backend advances `groups.current_cycle` to next cycle

Recommended endpoints:
- `POST /groups/:groupId/payouts` (admin only)
- or `POST /groups/:groupId/advance-cycle` (admin only)

## Suggestions (How it Should Be)

### A) Add a dedicated “Group Details” endpoint
Right now UI often does `GET /groups` then filters client-side.
Add:
- `GET /groups/:id`
Return:
- group fields + computed fields (paidThisCycle, totalContributed, myContribution, myPaidThisCycle, next payout info)

### B) Add a “Group Summary” endpoint for dashboard cards
If dashboard needs aggregated stats across groups, consider:
- `GET /me/summary`
Return:
- totals, pending count, upcoming payouts
This avoids loading all groups and computing everything on the client.

### C) Don’t store receipt images as base64 long-term
Current flow can pass `receiptUrl` as a data URL for speed of development.
For production:
- Upload file to object storage (S3 / Cloudinary / etc.)
- Store only a short HTTPS URL in `contributions.receipt_url`

Suggested endpoints:
- `POST /uploads/receipt` -> returns `{ url }`
Then:
- `POST /groups/:id/contributions` uses that `{ url }`

### D) Join approvals (optional feature)
Current join flow is immediate. If you want approvals:
- `POST /groups/join-requests`
- Admin: `GET /admin/join-requests`
- Admin: `PATCH /admin/join-requests/:id` approve/reject

### E) Cycle rules and constraints
To prevent double submissions and keep the cycle consistent:
- Enforce **one contribution per member per cycle**:
  - Unique constraint: `(group_id, member_id, cycle_number)`
- Allow resubmission only if rejected (or add “revision” concept)

### F) Admin permission model
Always check `group_members.is_admin = true` for:
- reviewing contributions
- recording payouts
- advancing cycles

### G) Backend computed fields (keep UI simple)
The UI benefits a lot if backend returns these fields:
- `paidThisCycle` (count)
- `myPaidThisCycle` (boolean)
- `totalContributed` (sum confirmed)
- `myContribution` (sum confirmed for me)
- `nextPayoutMember` + `nextPayoutDate`

This avoids duplicating business logic across frontend and backend.

## Current Implementation Notes (Repo)

Frontend calls are implemented via helpers in:
- `src/lib/ajo-data.ts` (API client + mapping)

Backend endpoints currently exist in:
- `kowope_be/src/routes/auth.ts`
- `kowope_be/src/routes/groups.ts`
- `kowope_be/src/routes/admin.ts`

