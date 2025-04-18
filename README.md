# Rufus Todo List Application

A responsive todo list application with user authentication and task management features.

## Features

### Login Page
- Email validation with proper email format checking
- Password validation (minimum 8 characters)
- Submit button disabled until validations pass
- Redirects to dashboard upon successful login

### Dashboard
- Responsive navigation menu
- Profile section with user initials and email display
- Quick overview of today's tasks
- Statistics and quick actions

### Todo List (Home Page)
- Add new tasks with time and duration
- Edit existing tasks (text, time, duration)
- Delete tasks
- Time picker for task scheduling
- Tasks organized by time slots
- Clean and intuitive interface

### Cards Page
- Responsive card layout:
  - Desktop: 3 cards per row
  - Tablet: 2 cards in first row, 1 card below
  - Mobile: Single column layout

### Additional Features
- Dark/Light theme toggle
- Session management
- Responsive design for all screen sizes
- Profile dropdown with logout functionality

## Technical Details

### Validation Rules
- Email: Must match standard email format (example@domain.com)
- Password: Minimum 8 characters required

### Time Management
- Tasks can be scheduled with specific start times
- Duration can be selected for each task
- Time picker with 12-hour format display

### Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Adaptive layout for different screen sizes
- Collapsible menu for mobile devices

### State Management
- Session storage for user authentication
- Local storage for todo items
- Real-time UI updates

## Note
This is a frontend-only application. Data persists only during the session and will be cleared on page reload.

## Project Structure

```
/
├── index.html          # Login page
├── dashboard.html      # Main dashboard
├── home.html          # Todo list
├── cards.html         # Responsive cards
├── styles.css         # Stylesheet
└── script.js          # JavaScript logic
```

## Technical Requirements

- **Browser Support**: Chrome, Firefox, Safari (latest versions)
- **Viewport Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

## Setup & Installation

1. Clone or download the repository
2. Open `index.html` in a modern web browser
3. No additional setup required (frontend-only application)

## Development Guidelines

### HTML
- Semantic markup
- Accessibility considerations
- Clean structure

### CSS
- Mobile-first approach
- Flexbox/Grid layouts
- BEM naming convention
- Media queries for responsiveness

### JavaScript
- Vanilla JS only
- Form validation
- Event handling
- DOM manipulation

## Notes

- All data is temporary and clears on page reload
- No backend integration
- No external libraries or frameworks used
- No local storage implementation #   S i b a s i T o d o L i s t 
 
 
