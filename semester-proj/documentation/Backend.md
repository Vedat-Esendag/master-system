For Altan and Vedat (if he wants)

# Implementing Session Tracking with UI, Supabase, and Clerk

To integrate session tracking into your application using the provided `page.tsx`, Supabase for SQL database management, and Clerk for authentication, follow the steps below. This guide assumes you have a solid understanding of React, Next.js, and backend development.

## Overview

1. **Authentication with Clerk**
2. **Setting Up Supabase**
3. **Database Schema for Sessions**
4. **API Endpoints for Session Management**
5. **Integrating with the UI (`page.tsx`)**
6. **Handling Session Lifecycle**
7. **Displaying Session Data on the Dashboard**

---

## 1. Authentication with Clerk

Ensure Clerk is properly integrated into your Next.js application to handle user authentication.

### Installation

```bash
npm install @clerk/clerk-react
```

### Configuration

```tsx:src/app/_app.tsx
"use client"

import { ClerkProvider } from "@clerk/clerk-react"

export default function App({ children }) {
  return (
    <ClerkProvider
      frontendApi={process.env.NEXT_PUBLIC_CLERK_FRONTEND_API}
      navigate={(to) => window.history.pushState(null, '', to)}
    >
      {children}
    </ClerkProvider>
  )
}
```

### Protecting Routes

```tsx:src/app/Dashboard/page.tsx
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react"

export default function MainDashboard() {
  return (
    <SignedIn>
      {/* Existing Dashboard Code */}
    </SignedIn>
    <SignedOut>
      <SignIn />
    </SignedOut>
  )
}
```

---

## 2. Setting Up Supabase

### Installation

```bash
npm install @supabase/supabase-js
```

### Configuration

```tsx:src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseKey)
```

---

## 3. Database Schema for Sessions

Ensure your Supabase database includes the necessary tables for users, desks, and sessions.

### Users Table

If Clerk manages users, you might use Clerk's user IDs. Otherwise, create a `users` table.

```sql:/supabase/migrations/create_users_table.sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Desks Table

Assuming it exists based on your README.

### Sessions Table

```sql:/supabase/migrations/create_sessions_table.sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    desk_id UUID REFERENCES desks(id) ON DELETE SET NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    ended_at TIMESTAMP WITH TIME ZONE,
    session_duration INTERVAL GENERATED ALWAYS AS (ended_at - started_at) STORED,
    device_info JSONB,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### Indexes

```sql:/supabase/migrations/create_sessions_indexes.sql
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_desk_id ON sessions(desk_id);
CREATE INDEX idx_sessions_started_at ON sessions(started_at);
CREATE INDEX idx_sessions_ended_at ON sessions(ended_at);
```

---

## 4. API Endpoints for Session Management

Create API routes to handle starting and ending sessions.

### Start Session Endpoint

```ts:src/pages/api/sessions/start.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'
import { getAuth } from '@clerk/nextjs/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })

  const { userId, deskId, deviceInfo, ipAddress } = req.body
  const { userId: clerkUserId } = getAuth(req)

  if (!clerkUserId) return res.status(401).json({ error: 'Unauthorized' })

  const { data, error } = await supabase
    .from('sessions')
    .insert([{ user_id: clerkUserId, desk_id: deskId, device_info: deviceInfo, ip_address: ipAddress }])
    .select()

  if (error) return res.status(400).json({ error: error.message })

  res.status(200).json({ session_id: data[0].id, started_at: data[0].started_at })
}
```

### End Session Endpoint

```ts:src/pages/api/sessions/end.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabaseClient'
import { getAuth } from '@clerk/nextjs/server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })

  const { sessionId } = req.body
  const { userId: clerkUserId } = getAuth(req)

  if (!clerkUserId) return res.status(401).json({ error: 'Unauthorized' })

  const { data, error } = await supabase
    .from('sessions')
    .update({ ended_at: new Date() })
    .eq('id', sessionId)
    .eq('user_id', clerkUserId)
    .select()

  if (error) return res.status(400).json({ error: error.message })
  if (data.length === 0) return res.status(404).json({ error: 'Session not found' })

  res.status(200).json({ session_id: data[0].id, ended_at: data[0].ended_at, session_duration: data[0].session_duration })
}
```

---

## 5. Integrating with the UI (`page.tsx`)

Modify your dashboard to handle session tracking.

### State Management

```tsx:src/app/Dashboard/page.tsx
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { supabase } from '@/lib/supabaseClient'

export default function MainDashboard() {
  const { user } = useUser()
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const startSession = async () => {
        const response = await fetch('/api/sessions/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            deskId: 'YOUR_DESK_ID', // Replace with actual desk ID
            deviceInfo: { /* Collect device info */ },
            ipAddress: 'USER_IP_ADDRESS' // Obtain from context or request
          })
        })
        const data = await response.json()
        if (response.ok) setSessionId(data.session_id)
      }

      startSession()

      return () => {
        if (sessionId) {
          fetch('/api/sessions/end', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
          })
        }
      }
    }
  }, [user, sessionId])

  return (
    // Existing Dashboard JSX
  )
}
```

### Notes

- **Desk ID**: Replace `'YOUR_DESK_ID'` with the actual desk identifier, possibly from props or context.
- **Device Info & IP Address**: Use appropriate libraries or APIs to fetch device information and the user's IP address.

---

## 6. Handling Session Lifecycle

Ensure sessions are accurately started and ended based on user interactions.

### Starting a Session

- Triggered when the user accesses the dashboard.
- Sends a POST request to `/api/sessions/start`.
- Stores the returned `session_id` in the state.

### Ending a Session

- Triggered when the user leaves the dashboard or the component unmounts.
- Sends a POST request to `/api/sessions/end` with the `session_id`.

---

## 7. Displaying Session Data on the Dashboard

Fetch and display session-related data from Supabase.

### Fetching Sessions

```tsx:src/app/Dashboard/page.tsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function MainDashboard() {
  const [sessions, setSessions] = useState<any[]>([])

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(10)

      if (!error) setSessions(data)
    }

    fetchSessions()
  }, [])

  return (
    <div>
      {/* Existing Dashboard JSX */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {sessions.map(session => (
              <li key={session.id}>
                User: {session.user_id} | Desk: {session.desk_id} | Duration: {session.session_duration}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Display Considerations

- **Pagination**: Implement pagination for scalability.
- **Filtering**: Allow filtering by user, desk, date, etc.
- **Real-time Updates**: Use Supabase's real-time features to update the UI when sessions are created or updated.

---

## Additional Tips

- **Error Handling**: Implement comprehensive error handling for API requests.
- **Security**: Ensure API endpoints are secured and validate all inputs.
- **Environment Variables**: Store sensitive information like Supabase keys and Clerk API keys securely using environment variables.
- **Logging**: Implement logging for session activities to aid in debugging and monitoring.
- **Testing**: Write unit and integration tests for your session management logic.

---

By following these steps, your developer can effectively implement session tracking within your application, leveraging Supabase for database management and Clerk for authentication. This integration ensures accurate tracking of user interactions with desks, providing valuable insights on the dashboard.
