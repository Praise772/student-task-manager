import './App.css'
import { useState, useEffect } from 'react'

function App() {

  const [title, setTitle] = useState('')

  const [description, setDescription] = useState('')

  const [tasks, setTasks] = useState([])

  const [filter, setFilter] = useState('all')

  const [successMessage, setSuccessMessage] = useState('')

  const [editingTaskId, setEditingTaskId] = useState(null)

  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') {
      return task.completed === 1
  }

    if (filter === 'pending') {
      return task.completed === 0
  }

  return true
})

  async function fetchTasks() {
    const response = await fetch('http://127.0.0.1:5000/api/tasks')

    const data = await response.json()

    setTasks(data)
}

    useEffect(() => {
      fetchTasks()
    }, [])

  async function handleAddTask() {
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
    setSuccessMessage('Task added successfully!')

    if (response.ok) {
      setTitle('')
      setDescription('')

      fetchTasks()
    }
}

    async function handleDeleteTask(taskId) {

      const confirmDelete = window.confirm('Are you sure you want to delete this task?')

      if (!confirmDelete) {
        return
      }
      const response = await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {

        setSuccessMessage('Task deleted successfully!')

        fetchTasks()
      }
    }

async function handleToggleTask(taskId) {
  const response = await fetch(`http://127.0.0.1:5000/api/tasks/${taskId}`, {
    method: 'PATCH'
  })

  const data = await response.json()

  alert(data.message)

  if (response.ok) {
    setSuccessMessage('Task status updated successfully!')

    fetchTasks()
  }
}

async function handleUpdateTask(taskId) {

  if (editTitle.trim() === '') {
    alert('Please enter a task title')
    return
  }

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

  const data = await response.json()

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

        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          maxLength={100}
          onChange={(e) => {
            setTitle(e.target.value)

            setSuccessMessage('')
          }}
        />

        <input
          type="text"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="button" onClick={handleAddTask}>
          Add Task
        </button>

      {successMessage && (
        <p className="success-message">{successMessage}</p>
      )}

      <h2>My Tasks</h2>

      <p>
        Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
      </p>

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

      {filteredTasks.length === 0 && (
        <p>No tasks found.</p>
      )}

      {filteredTasks.map((task) => (
        <div key={task.id} className="task-card">
          <h3>{task.title}</h3>
          <p>{task.description}</p>

          <p className={task.completed ? 'completed' : 'pending'}>
            Status: {task.completed ? 'Completed' : 'Pending'}
          </p>

          <button
            type="button"
            onClick={() => handleToggleTask(task.id)}
          >
            {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingTaskId(task.id)

              setEditTitle(task.title)
              setEditDescription(task.description || '')
            }}
          >
            Edit
          </button>

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
        

              <button
                type="button"
                onClick={() => handleUpdateTask(task.id)}
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => setEditingTaskId(null)}
              >
                Cancel
              </button>
            </div>
          )}

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







export default App