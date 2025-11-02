# Call Analytics Dashboard

A modern React + TypeScript web application for visualizing call analytics data for voice agents. Features interactive charts with customizable values, user authentication, dark/light theme support, and persistent data storage using Supabase.

## Features

### 📊 Analytics Charts
- **Call Duration Analysis**: Interactive area chart showing call duration distribution with a bell curve visualization
- **Sad Path Analysis**: Multi-layered donut chart displaying negative interaction categories and subcategories
- **Dashboard View**: View all charts at once or navigate to individual chart views

### ✏️ Data Customization
- **Custom Value Editing**: Users can overwrite dummy values with their own data
- **Email-based Persistence**: Custom values are saved to Supabase linked to user emails
- **Overwrite Confirmation**: Shows previous saved values and asks for confirmation before overwriting
- **Smooth Scrolling**: Automatically scrolls to the editor section after email submission

### 🎨 User Experience
- **Authentication System**: Secure login with credentials (Login ID: `tharane`, Password: `Thara@0808`)
- **Dark/Light Theme Toggle**: Switch between dark and light modes with theme persistence
- **Sidebar Navigation**: Easy navigation between Dashboard, Call Duration Analysis, and Sad Path Analysis
- **Modern UI**: Clean, responsive design using Material-UI components
- **Loading States**: Visual feedback during data saving operations
- **Snackbar Notifications**: User-friendly success and error messages using MUI Snackbar

### 💾 Data Management
- **Supabase Integration**: Secure and scalable backend database
- **Local Storage**: Theme preferences and login state persistence
- **Form Validation**: Input validation with helpful error messages

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- React 18
- TypeScript
- Vite
- Material-UI (MUI)
- Recharts
- Supabase client

### 2. Set Up Supabase

1. Create a new project at [Supabase](https://supabase.com)
2. Go to SQL Editor and run the SQL script from `src/lib/supabase-schema.sql`
   - This creates the required tables and inserts initial data
3. Get your project URL and anon key from **Settings > API**
4. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> 📝 **Note**: See `SUPABASE_SETUP.md` for detailed setup instructions

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 4. Login Credentials

- **Login ID**: `tharane`
- **Password**: `Thara@0808`

## Database Schema

The application uses three main tables:

1. **sad_path_categories**: Stores main categories
   - Customer Hostility
   - Unsupported Language
   - Caller Identification Issues

2. **sad_path_subcategories**: Stores subcategories linked to their parent categories
   - Includes subcategories like "Verbal Agression", "Assistant did not speak French", etc.

3. **user_custom_values**: Stores custom chart data linked to user emails
   - Email address
   - Chart type (call_duration or sad_path)
   - Chart data (JSON)
   - Timestamps for created/updated

## Project Structure

```
src/
├── components/
│   ├── CallDurationChart.tsx    # Call Duration Analysis chart component
│   ├── SadPathChart.tsx         # Sad Path Analysis chart component
│   ├── EmailModal.tsx           # Email collection modal (MUI Dialog)
│   ├── ConfirmOverwriteModal.tsx # Overwrite confirmation modal
│   ├── Login.tsx                # Login page component
│   ├── Sidebar.tsx              # Navigation sidebar component
│   └── SnackbarProvider.tsx     # Snackbar notification context provider
├── lib/
│   ├── supabase.ts              # Supabase client configuration and types
│   └── supabase-schema.sql      # Database schema SQL script
├── theme/
│   └── theme.tsx                 # Theme provider with dark/light mode support
├── types/
│   └── charts.ts                # Chart data type definitions
├── App.tsx                      # Main app component with routing
├── App.css                      # Global styles
└── main.tsx                     # Application entry point
```

## Technologies Used

### Core
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server

### UI Libraries
- **Material-UI (MUI)**: Component library for modern UI
- **@mui/icons-material**: Material Design icons
- **@emotion/react & @emotion/styled**: CSS-in-JS styling

### Data Visualization
- **Recharts**: Composable charting library built on React components

### Backend
- **Supabase**: Open source Firebase alternative for backend services

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Key Features Implementation

### Theme Toggle
- Click the sun/moon icon in the header to toggle between dark and light modes
- Theme preference is saved to localStorage and persists across sessions

### Custom Chart Values
1. Click "Edit Values" on any chart
2. Enter your email address
3. If you have previous values, you'll be prompted to confirm overwrite
4. Edit the chart data in the form that appears
5. Click "Save Changes" - you'll see a loading state and success notification

### Navigation
- Use the sidebar to switch between:
  - **Dashboard**: View all charts
  - **Call Duration Analysis**: View only the duration chart
  - **Sad Path Analysis**: View only the sad path chart

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For detailed Supabase setup instructions, refer to `SUPABASE_SETUP.md`
