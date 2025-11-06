
# Hitec ERP System

A comprehensive Enterprise Resource Planning (ERP) system built for manufacturing operations, featuring production management, staff coordination, inventory tracking, finance management, and comprehensive reporting.

## Overview

This ERP system provides integrated management of:
- **Production**: Job scheduling, machine monitoring, quality control
- **Staff Management**: Directory, scheduling, attendance, payroll
- **Inventory**: Stock tracking, raw materials, product management
- **Finance**: Revenue tracking, expenses, invoicing, profit analysis
- **CRM & Clients**: Customer relationship management
- **Reports**: Analytics, AI insights, KPI tracking
- **Settings**: System configuration, user management, integrations

## Global UI/UX Style Rules

### Typography
- **Primary Font**: Inter (mandatory across all components)
- **Headings**: Sentence case (no ALL CAPS)
- **Body Text**: 14px base size
- **Labels**: 12px capitalize (not uppercase)

### Data Cards Design Standards
- **Consistent sizing**: All cards use `.metric-card` class for uniform height (96px/24 units)
- **Typography**: 
  - Title: 12px medium weight, gray-600, capitalize (not uppercase)
  - Value: 18px (text-lg) semibold, gray-900
  - Subtitle: 12px gray-500
- **Layout**: Clean white backgrounds with subtle border
- **No pastel backgrounds**: Use only white/gray-50 base colors
- **Spacing**: 16px padding inside cards, 16px gap between cards

### Color Palette
- **Primary**: Blue (#3b82f6)
- **Secondary**: Gray variants
- **Success**: Green (#16a34a)
- **Warning**: Orange (#ea580c)
- **Error**: Red (#ef4444)
- **No black buttons**: Use system colors only

### Component Standards

#### Buttons
- **Primary**: Blue background, white text
- **Secondary**: Outlined or ghost variants
- **Icons**: 16px (h-4 w-4) with 8px margin
- **No black/brown buttons**: Always use standard color palette

#### Tables
- **Responsive design**: No horizontal scrolling required
- **Column sizing**: Use min-width classes for proper scaling
- **Headers**: Medium weight, gray-700
- **Row hover**: Light gray background
- **Actions**: Ghost buttons with icons

#### Page Headers
- **Remove page titles**: Do not display main page titles like "Finance Management"
- **Remove subtitles**: No descriptive text under page titles
- **Breadcrumbs only**: Use PageBreadcrumb component for navigation context

#### Navigation Tabs
- **Active state**: Primary blue background
- **Inactive**: Ghost/transparent background
- **Icons**: 16px with 8px gap from label
- **Text**: Sentence case labels (no ALL CAPS)

### Layout Standards
- **Grid system**: Maximum 4-5 cards per row on desktop
- **Responsive breakpoints**: 1 col mobile, 2 col tablet, 3-5 col desktop
- **No horizontal scrolling**: All content must fit viewport width
- **Consistent spacing**: Use 4px, 8px, 16px, 24px increments

### Common Mistakes to Avoid

❌ **Typography Errors**:
- Using ALL CAPS for labels or buttons
- Oversized bold text in data cards
- Missing Inter font family
- Inconsistent font sizes across components

❌ **Color Issues**:
- Black or brown buttons instead of system colors
- Pastel or bright backgrounds on cards
- Inconsistent color usage across pages

❌ **Layout Problems**:
- Varying card heights and padding
- Cards with different internal spacing
- Horizontal scrolling tables
- Misaligned form elements

❌ **Data Display**:
- Text overflowing card containers
- Inconsistent number formatting
- Missing visual hierarchy

✅ **Best Practices**:
- Use Inter font throughout
- Apply `.metric-card` class for all data cards
- Follow established color palette
- Use proper spacing (4px, 8px, 16px, 24px)
- Implement proper visual hierarchy
- Test on different screen sizes

## Key Features

### Production Management
- Real-time production scheduling and job tracking
- Machine uptime monitoring and maintenance scheduling
- Quality control with waste tracking and inspection logs
- Multi-stage production workflow management

### Staff Management
- Comprehensive staff directory with role-based access
- Shift scheduling with calendar and table views
- Attendance tracking with integration capabilities
- **Biweekly payroll calculation and export**
- Payroll notes and HR documentation

### Finance Management
- Revenue and expense tracking with visual analytics
- Invoice generation and payment tracking
- Profit and cash flow analysis
- Xero integration for accounting synchronization

### Inventory Control
- Real-time stock level monitoring
- Raw materials and finished goods tracking
- Automated stock allocation based on production needs
- Low stock alerts and reorder management

### Settings & Configuration
- **Company Information**: Branding, locations, business hours
- **User Management**: Role-based access control and permissions
- **API & Integrations**: External system connections (Xero, GTG, etc.)
- **Factory Setup**: Machine and vehicle fleet management
- **AI & Automation**: Intelligent insights and threshold configurations

## Staff & Payroll System

### Payroll Processing
The system supports **biweekly payroll cycles** with the following features:

#### Calculation Logic
- **Pay Period**: 14-day cycles (configurable)
- **Regular Hours**: Up to 80 hours per 2-week period
- **Overtime**: Hours above 80h at 1.5× rate
- **Default Rate**: R55.00/hour (editable per employee)

#### Data Sources
Payroll calculations integrate data from:
- **Attendance Tracking**: Actual hours worked from time logs
- **Shift Schedules**: Expected hours and shift patterns  
- **Payroll Notes**: Leave adjustments, medical notes, warnings
- **Staff Directory**: Employee roles, departments, rates

#### Export Options
- **CSV Export**: For spreadsheet analysis
- **PDF Reports**: Printable payroll summaries
- **Xero Integration**: Direct export to accounting system
- **Custom Formats**: Configurable for different accounting needs

#### Variable Pay Types (Future Support)
The system architecture supports:
- Hourly rates (current implementation)
- Salaried positions (monthly/annual)
- Piece-rate payments (per unit produced)
- Commission-based compensation

### Staff Management Features
- Role-based directory with contact information
- Visual shift scheduling (table and calendar views)
- Attendance tracking with late/absent notifications
- Payroll notes for HR documentation
- Biweekly payroll generation and export

## Settings System Architecture

### Configuration Hierarchy
- **Global Settings**: Company info, business hours, default currency
- **User-Specific Settings**: Individual roles, permissions, factory access
- **Factory-Specific Settings**: Machine configurations, local parameters
- **Integration Settings**: API keys, external system connections

### User Roles & Permissions
- **Admin**: Full system access, user management, settings configuration
- **Supervisor**: Production oversight, staff scheduling, reporting access
- **Operator**: Limited production input, attendance tracking
- **Viewer**: Read-only access to assigned modules

### AI & Automation Configuration
- **Daily AI Summaries**: Automated production and KPI reports
- **Weekly Insights**: Trend analysis and performance recommendations
- **Threshold Alerts**: Configurable production and downtime warnings
- **Anomaly Detection**: Pattern recognition for quality and efficiency (Phase 2)

## Technology Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vite build system

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run development server: `npm run dev`
5. Build for production: `npm run build`

## Integration Points

### External Systems
- **Xero**: Accounting and payroll export
- **GTG Digital**: Biometric attendance (future)
- **ERP APIs**: Production data synchronization
- **WhatsApp**: Production alerts and notifications (Phase 2)
- **Google Drive**: Design files and documentation sync

### Data Flow
- Production data feeds into inventory and finance
- Staff attendance integrates with payroll
- CRM data connects to invoicing and finance
- All modules feed into comprehensive reporting
- Settings control system behavior and integrations

## Support & Documentation

For detailed implementation guides and API documentation, refer to the individual component documentation within the codebase.
# hi-tech
