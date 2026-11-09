// Import our CSS file
import './App.css'
import { useState, useEffect } from 'react'

// This is our main React component
function App() {

  // Store the task title entered by the student
  const [title, setTitle] = useState('')

  // Store the task description entered by the student
  const [description, setDescription] = useState('')

  // Store the list of tasks retrieved from MySQL
  const [tasks, setTasks] = useState([])

  // Store which tasks the student wants to see
  const [filter, setFilter] = useState('all')

  // Store a success message
  const [successMessage, setSuccessMessage] = useState('')

  // Store the ID of the task being edited
  const [editingTaskId, setEditingTaskId] = useState(null)

  // Store the title and description while editing
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  // Filter tasks based on the selected button
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') {
      return task.completed === 1
  }

    if (filter === 'pending') {
      return task.completed === 0
  }

  return true
})

  // Get all saved tasks from our Flask backend
  async function fetchTasks() {
    const response = await fetch('http://127.0.0.1:5000/api/tasks')

    // Convert the response from JSON to JavaScript data
    const data = await response.json()

    // Show the tasks received from Flask in the browser console
    //console.log('Tasks from Flask:', data)

    // Store the retrieved tasks in React state
    setTasks(data)
}

      // Load saved tasks when the page first opens
    useEffect(() => {
      fetchTasks()
    }, [])

  // Send the new task to our Flask backend
  async function handleAddTask() {
        // Check if the task title is empty
    if (title.trim() === '') {
      alert('Please enter a task title')
      return
    }
    const response = await fetch('http://127.0.0.1:5000/api/tasks', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        title: title.trim(),
        description: description.trim()
      })
    })

    const data = await response.json()
    // Display a success message on the page
    setSuccessMessage('Task added successfully!')

    // Clear the input fields and refresh the task list
    if (response.ok) {
      setTitle('')
      setDescription('')

      // Get the updated tasks from Flask
      fetchTasks()
    }
}

    // Delete a task from our MySQL database
    async function handleDeleteTask(taskId) {

      // Ask the user to confirm before deleting
      const confirmDelete = window.confirm('Are you sure you want to delete this task?')

      // Stop the function if the user clicks Cancel
      if (!confirmDelete) {
        return
      }
      const response = await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      // Show the message returned by Flask
      //alert(data.message)

      /// Refresh the task list if deletion was successful
      if (response.ok) {

        // Clear the previous success message
        setSuccessMessage('Task deleted successfully!')

        fetchTasks()
      }
    }

    // Update the completion status of a task
async function handleToggleTask(taskId) {
  const response = await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`, {
    method: 'PATCH'
  })

  const data = await response.json()

  // Show the message returned by Flask
  alert(data.message)

  // Refresh tasks after updating their completion status
  if (response.ok) {

    // Clear the previous success message
    setSuccessMessage('Task status updated successfully!')

    fetchTasks()
  }
}

// Function for saving changes to an existing task
async function handleUpdateTask(taskId) {

  // Prevent saving an empty task title
  if (editTitle.trim() === '') {
    alert('Please enter a task title')
    return
  }

  // Send the updated task to Flask
  const response = await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`, {
    method: 'PUT',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      title: editTitle.trim(),
      description: editDescription.trim()
    })
  })

  // Get the response from Flask
  const data = await response.json()

  // Check if the update was successful
  if (response.ok) {
    setSuccessMessage(data.message)
    setEditingTaskId(null)
    fetchTasks()
  } else {
    alert(data.message)
  }
}
    
  return (
    <div>
      <h1>Student Task Manager</h1>
      <p>Welcome! Manage your daily tasks here.</p>

       {/* Input field for entering a task title */}
        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          maxLength={100}
          onChange={(e) => {
            setTitle(e.target.value)

            // Clear the previous success message
            setSuccessMessage('')
          }}
        />

        {/* Input field for entering a task description */}
        <input
          type="text"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Button for adding a new task */}
        <button type="button" onClick={handleAddTask}>
          Add Task
        </button>

        {/* Display the success message after adding a task */}
      {successMessage && (
        <p className="success-message">{successMessage}</p>
      )}

      {/* Display all saved tasks */}
      <h2>My Tasks</h2>

           {/* Display the correct word based on the number of tasks */}
      <p>
        Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
      </p>

         {/* Buttons for filtering tasks */}
      <div>
        <button
          type="button"
          className={filter === 'all' ? 'active-filter' : ''}
          onClick={() => {
            setFilter('all')
            setSuccessMessage('')
          }}
        >
          All Tasks
        </button>

        <button
          type="button"
          className={filter === 'completed' ? 'active-filter' : ''}
          onClick={() => {
            setFilter('completed')
            setSuccessMessage('')
          }}
        >
          Completed
        </button>

        <button
          type="button"
          className={filter === 'pending' ? 'active-filter' : ''}
          onClick={() => {
            setFilter('pending')
            setSuccessMessage('')
          }}
        >
          Pending
        </button>
      </div>

       {/* Show a message when no tasks match the selected filter */}
      {filteredTasks.length === 0 && (
        <p>No tasks found.</p>
      )}

      {filteredTasks.map((task) => (
        <div key={task.id} className="task-card">
          <h3>{task.title}</h3>
          <p>{task.description}</p>

          {/* Display the task status with a different color */}
          <p className={task.completed ? 'completed' : 'pending'}>
            Status: {task.completed ? 'Completed' : 'Pending'}
          </p>

          {/* Button for updating the task completion status */}
          <button
            type="button"
            onClick={() => handleToggleTask(task.id)}
          >
            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>

          {/* Button for editing a task */}
          <button
            type="button"
            onClick={() => {
              // Store the ID of the task being edited
              setEditingTaskId(task.id)

              // Load the existing task information
              setEditTitle(task.title)
              setEditDescription(task.description || '')
            }}
          >
            Edit
          </button>

          {/* Show the editing form for the selected task */}
          {editingTaskId === task.id && (
            <div>
              <h3>Edit Task</h3>

              <input
                type="text"
                value={editTitle}
                maxLength={100}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Edit task title"
              />

              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Edit task description"
              />
        

            {/* Save the edited task */}
              <button
                type="button"
                onClick={() => handleUpdateTask(task.id)}
              >
                Save Changes
              </button>

              {/* Button to cancel editing */}
              <button
                type="button"
                onClick={() => setEditingTaskId(null)}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Button for deleting a task */}
          <button
          type="button"
          className="delete-btn"
          onClick={() => handleDeleteTask(task.id)}
        >
          Delete
          </button>
        </div>
))}
</div>
)
}







// Allow other files to use this component
export default App