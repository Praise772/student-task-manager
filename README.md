
# Student Task Manager

## Project Description

Student Task Manager is a full-stack web application that helps students organize and manage their daily tasks.

Users can create, view, edit, delete, and track the completion status of their tasks.

## Technologies Used

### Frontend
- React.js
- JavaScript
- HTML
- CSS
- Vite

### Backend
- Python
- Flask
- Flask-CORS

### Database
- MySQL

## Features

- Add new tasks with a title and description.
- View all saved tasks.
- Edit existing tasks.
- Delete tasks.
- Mark tasks as completed or pending.
- Filter tasks by All, Completed, or Pending.
- Display the number of tasks.
- Validate task titles.
- Display success messages.
- Responsive design for desktop and mobile devices.

## Project Structure

student_task_manager/
- backend/
  - app.py
- frontend/
  - src/
    - App.jsx
    - App.css
    - index.css
  - package.json
- README.md

## How to Run the Project

### 1. Start the Backend

Open the backend folder in your terminal.

Activate your Python virtual environment and install the required Python packages if they are not already installed.

Make sure your MySQL server is running and the database connection in app.py is configured correctly.

Run:

```bash
python app.py
```

The Flask backend runs at:

http://127.0.0.1:5000

### 2. Start the Frontend

Open another terminal and navigate to the frontend folder.

Install the frontend dependencies if needed:

```bash
npm install
```

Start the React application:

```bash
npm run dev
```

Open the application at:

http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create a task |
| PUT | /api/tasks/:id | Edit a task |
| PATCH | /api/tasks/:id | Update task completion |
| DELETE | /api/tasks/:id | Delete a task |

## Validation

Task titles cannot be empty or longer than 100 characters.

## Future Improvements

- User authentication
- Task deadlines
- Task priorities
- Search functionality
- Deployment to a hosting platform

## Project Status

Core features completed and tested locally.
