## FlexiSpace Project Documentation

### Overview

FlexiSpace is a modern workspace management application built with [Next.js](https://nextjs.org), providing users with comprehensive tools to manage and customize their workspaces. The platform integrates user authentication, real-time desk management, and insightful dashboards to enhance productivity and ergonomic practices.

### Getting Started

#### Prerequisites

- **Node.js** (v14 or later)
- **npm**, **Yarn**, **pnpm**, or **Bun** for package management
- **Vercel Account** (for deployment)
- **Supabase Account** (for database management)
- **Clerk Account** (for user authentication)

#### Installation

1. **Clone the Repository**

    ```bash
    git clone https://github.com/your-repo/master-system.git
    cd master-system
    ```

2. **Install Dependencies**

    Using npm:

    ```bash
    npm install
    ```

    Or using Yarn:

    ```bash
    yarn
    ```

    Or using pnpm:

    ```bash
    pnpm install
    ```

    Or using Bun:

    ```bash
    bun install
    ```

3. **Set Up Environment Variables**

    Create a `.env.local` file in the root directory and add the necessary environment variables:

    ```env
    NEXT_PUBLIC_DESK_API_KEY=your_desk_api_key
    NEXT_PUBLIC_API_URL=https://your-api-url.com
    NEXT_PUBLIC_API_KEY=your_api_key
    NEXT_PUBLIC_DESK_ID=your_desk_id
    ```

4. **Run the Development Server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application in action.

### Project Structure

```plaintext
master-system/
├── app/
│   ├── desk-management/
│   │   └── page.tsx
│   ├── MainDashboard/
│   │   └── page.tsx
│   ├── CustomizeTable/
│   │   └── page.tsx
│   └── page.tsx
├── components/
│   ├── chartDemoFrederik/
│   │   └── index.tsx
│   ├── CustomizeTable.tsx
│   ├── WeeklyActivity.tsx
│   ├── ui/
│   │   ├── card.tsx
│   │   ├── chart.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── slider.tsx
│   │   ├── tooltip.tsx
│   │   └── ...other UI components
│   └── standing-desk.tsx
├── lib/
│   └── desk-api.ts
├── hooks/
│   └── use-mobile.ts
├── config/
│   └── supabaseClient.ts
├── public/
│   └── ...static assets
├── styles/
│   ├── globals.css
│   └── ...other styles
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── ...other configuration files
```

### Features

#### User Authentication

- **Clerk Integration**: Handles user sign-in, sign-out, and user management seamlessly.
- **Protected Routes**: Ensures that only authenticated users can access specific pages like the Dashboard and Desk Management.

#### Desk Management

- **List Desks**: Fetches and displays a list of available desks from the backend API.
- **Select Desk**: Allows users to select a desk to view detailed information.
- **Update Desk Position**: Users can adjust the desk height using control panels or manual input.

```typescript:lib/desk-api.ts
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_DESK_API_KEY || '';

export interface DeskData {
  config: DeskConfig;
  state: DeskState;
  usage: DeskUsage;
  lastErrors: DeskError[];
}

class DeskAPI {
  private apiUrl: string;

  constructor() {
    this.apiUrl = `/api/v2/${API_KEY}/desks`;
  }

  async getAllDesks(): Promise<string[]> {
    const response = await axios.get(this.apiUrl);
    return response.data;
  }

  async getDeskData(deskId: string): Promise<DeskData> {
    const response = await axios.get(`${this.apiUrl}/${deskId}`);
    return response.data;
  }

  async updateDeskPosition(deskId: string, position_mm: number): Promise<{ position_mm: number }> {
    const response = await axios.put(`${this.apiUrl}/${deskId}/state`, { position_mm });
    return response.data;
  }
}

export const deskAPI = new DeskAPI();
```

#### Dashboard

- **Weekly Activity**: Visualizes weekly standing and sitting activity using bar charts.
- **Monthly Standing Tracker**: Displays monthly standing data with interactive charts.
- **Daily Status**: Shows daily metrics like sitting time, standing time, and breaks.
- **Insights**: Provides analytics such as average standing time and longest standing streak.

```typescript:app/MainDashboard/page.tsx
import dynamic from 'next/dynamic';
import { Suspense, useMemo } from 'react';

const WeeklyActivity = dynamic(() => import('@/components/WeeklyActivity'), {
  ssr: false,
  loading: () => <div className="loading">Loading...</div>,
});

export default function MainDashboard() {
  const weeklyActivityData = useMemo(() => [...], []);
  const daysInMonth = useMemo(() => [...], []);

  return (
    <div className="dashboard-container">
      <Suspense fallback={<WeeklyActivity.loading />}>
        <WeeklyActivity data={weeklyActivityData} />
      </Suspense>
      {/* Other dashboard components */}
    </div>
  );
}
```

#### Table Customization

- **Adjustable Table Height**: Users can customize the height of their desks using sliders or preset buttons.
- **Available Desks**: Displays a grid of available desks for selection and customization.

```typescript:components/CustomizeTable.tsx
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";

export default function CustomizeTable() {
  const [tableHeight, setTableHeight] = useState(100);
  const [desks, setDesks] = useState<string[]>([]);

  const updateDeskHeight = async (heightCm: number) => {
    try {
      // Update desk height logic
      toast.success('Desk height updated');
    } catch (error) {
      toast.error('Failed to update desk height');
    }
  };

  return (
    <div className="customize-table-container">
      {/* UI Components for customization */}
    </div>
  );
}
```

### User Interface

#### Layout

- **Header**: Sticky header with navigation links to the Dashboard, Desks, and authentication buttons.
- **Sidebar**: Responsive sidebar that adapts between desktop and mobile views, providing navigation and quick access to desk controls.
- **Main Content**: Dynamic area that displays different pages like the Dashboard and Desk Management based on user interaction.

#### Components

- **Card**: Reusable card component for displaying content sections with headers, titles, and descriptive text.
- **Button**: Customizable buttons with different variants and sizes.
- **Slider**: Interactive slider for adjusting desk height.
- **Tooltip**: Informative tooltips to guide users through different functionalities.
- **Sidebar**: Collapsible sidebar with support for mobile viewports.

```typescript:components/ui/card.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
  )
);
Card.displayName = "Card";

// Similar implementations for CardHeader, CardTitle, etc.
```

#### Styling

- **Tailwind CSS**: Utilized for rapid UI development with utility-first classes.
- **Custom Utilities**: `cn` function for conditional class names.
- **Responsive Design**: Ensures the application is accessible and functional across various device sizes.

```typescript:package.json
{
  "dependencies": {
    "next": "15.0.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwindcss": "^3.4.14",
    // ...other dependencies
  },
  "devDependencies": {
    "@types/react": "^18",
    "typescript": "^5",
    // ...other dev dependencies
  }
}
```

### Technical Details

#### API Integration

- **DeskAPI Class**: Handles all API interactions related to desk management, including fetching desk lists, retrieving desk data, and updating desk positions.
  
```typescript:lib/desk-api.ts
class DeskAPI {
  private apiUrl: string;

  constructor() {
    this.apiUrl = `/api/v2/${API_KEY}/desks`;
  }

  async getAllDesks(): Promise<string[]> { /* ... */ }
  async getDeskData(deskId: string): Promise<DeskData> { /* ... */ }
  async updateDeskPosition(deskId: string, position_mm: number): Promise<{ position_mm: number }> { /* ... */ }
}
```

#### State Management

- **React Hooks**: Utilized for managing component states such as loading indicators, error messages, and selected desk data.
- **Context API**: Implements a Sidebar context to manage sidebar states across the application.

```typescript:components/ui/sidebar.tsx
const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
```

#### Data Fetching

- **useEffect**: Fetches data on component mount and when dependencies change.
- **axios & fetch**: Used for making HTTP requests to backend APIs.

```typescript:app/page.tsx
useEffect(() => {
  const initializeUserData = async () => {
    // Fetch and initialize user data with Supabase
  };

  if (user) {
    initializeUserData();
  }
}, [user]);
```

### Deployment

#### Vercel

FlexiSpace can be effortlessly deployed on [Vercel](https://vercel.com), the platform from the creators of Next.js. Follow these steps to deploy:

1. **Connect Repository**

    Log in to Vercel and import your Git repository.

2. **Configure Environment Variables**

    Add the necessary environment variables in the Vercel dashboard under the project settings.

3. **Deploy**

    Vercel will automatically build and deploy your application. Access it via the provided URL.

### Conclusion

FlexiSpace offers a robust solution for workspace management, combining real-time desk adjustments with insightful analytics to promote a healthy and productive work environment. Leveraging modern technologies like Next.js, Tailwind CSS, and Supabase ensures a scalable and maintainable codebase, while integrations with Clerk and Vercel provide seamless user experiences and deployments.

For further contributions or feedback, please visit [the Next.js GitHub repository](https://github.com/vercel/next.js).
