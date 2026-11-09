# Import Flask to create our backend application
from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS to allow React to communicate with Flask
import sqlite3  # Allows Python to work with an SQLite database
import mysql.connector  # Allows Python to connect to MySQL
import os
from dotenv import load_dotenv #Allows for import of my password from another file


load_dotenv()

# Create our Flask application
app = Flask(__name__)

# Allow my React frontend to access the backend
CORS(app, origins=["http://localhost:5173"])

# This function connects our Flask backend to MySQL
# I used os.getenv because I stored the important informations on another file
def get_db_connection():

    connection = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

    return connection

# Create a route to check if my backend is working
@app.route("/api/health", methods=["GET"])
def health_check():

    # Return a JSON response
    return jsonify({
        "message": "Student Task Manager API is running!"
    })

# This route gets all tasks from our MySQL database
@app.route("/api/tasks", methods=["GET"])
def get_tasks():

    # Connect to MySQL
    connection = get_db_connection()

    # Create a cursor to run SQL commands
    cursor = connection.cursor(dictionary=True)

    # Get all tasks from our tasks table
    cursor.execute("SELECT * FROM tasks")

    # Collect all the tasks
    tasks = cursor.fetchall()

    # Close the cursor and database connection
    cursor.close()
    connection.close()

    # Send the tasks back as JSON
    return jsonify(tasks)

# This route adds a new task to our MySQL database
@app.route("/api/tasks", methods=["POST"])
def add_task():

        # Get the information sent by the user
    data = request.get_json()

    # Get the task title and description
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()

   # Check if the title is empty
    if title == "":
        return jsonify({"message": "Task title is required"}), 400

    # Check if the title is longer than 100 characters
    if len(title) > 100:
        return jsonify({"message": "Task title cannot exceed 100 characters"}), 400

    # Connect to our MySQL database
    connection = get_db_connection()

    # Create a cursor to execute SQL commands
    cursor = connection.cursor()

    # Insert a new task into our tasks table
    cursor.execute(
        "INSERT INTO tasks (title, description) VALUES (%s, %s)",
        (title, description)
    )

    # Save the new task permanently
    connection.commit()

    # Get the ID of the newly created task
    task_id = cursor.lastrowid

    # Close the cursor and connection
    cursor.close()
    connection.close()

    # Return a success message
    return jsonify({
        "message": "Task created successfully",
        "id": task_id
    }), 201

# This route updates a task's completion status in MySQL
@app.route("/api/tasks/<int:task_id>", methods=["PATCH"])
def update_task(task_id):

    # Connect to our MySQL database
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Find the task using its ID
    cursor.execute("SELECT * FROM tasks WHERE id = %s", (task_id,))
    task = cursor.fetchone()

    # Check if the task exists
    if task:

        # Change completed from 0 to 1 or from 1 to 0
        new_status = not task["completed"]

        # Update the task in MySQL
        cursor.execute(
            "UPDATE tasks SET completed = %s WHERE id = %s",
            (new_status, task_id)
        )

        # Save the changes permanently
        connection.commit()

        # Close the database connection
        cursor.close()
        connection.close()

        # Return a success message
        return jsonify({"message": "Task updated successfully"})

    # Close the connection if the task doesn't exist
    cursor.close()
    connection.close()

    return jsonify({"message": "Task not found"}), 404


# Route for editing a task's title and description
@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def edit_task(task_id):

    # Get the updated information from React
    data = request.get_json()

    # Get the title and description
    title = data.get('title', '').strip()
    description = data.get('description', '').strip()

    # Prevent empty task titles
    if title == '':
        return jsonify({'message': 'Task title is required'}), 400

    # Prevent task titles longer than 100 characters
    if len(title) > 100:
        return jsonify({'message': 'Task title cannot exceed 100 characters'}), 400
        
    # Connect to the MySQL database
    connection = get_db_connection()
    cursor = connection.cursor()

    # Update the selected task in MySQL
    sql = "UPDATE tasks SET title = %s, description = %s WHERE id = %s"

    # Supply the updated values
    values = (title, description, task_id)

    # Execute the SQL query
    cursor.execute(sql, values)

    # Save the changes permanently
    connection.commit()

    # Close the database connection
    cursor.close()
    connection.close()

    # Return a success message to React
    return jsonify({'message': 'Task updated successfully!'}), 200

# This route deletes a task from our MySQL database
@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):

    # Connect to our MySQL database
    connection = get_db_connection()
    cursor = connection.cursor()

    # Delete the task with the matching ID
    cursor.execute(
        "DELETE FROM tasks WHERE id = %s",
        (task_id,)
    )

    # Check if a task was deleted
    deleted_rows = cursor.rowcount

    # Save the changes
    connection.commit()

    # Close the database connection
    cursor.close()
    connection.close()

    # Return a success message if a task was deleted
    if deleted_rows > 0:
        return jsonify({"message": "Task deleted successfully"})

    # Return an error if the task does not exist
    return jsonify({"message": "Task not found"}), 404















# Test if Python can connect to MySQL
#connection = get_db_connection()

#print("Connected to MySQL successfully!")

#connection.close()



# Start our Flask application
if __name__ == "__main__":
    app.run(debug=True, port=5000)