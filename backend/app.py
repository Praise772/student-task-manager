from flask import Flask, jsonify, request
from flask_cors import CORS  
import sqlite3  
import mysql.connector  
import os
from dotenv import load_dotenv 


load_dotenv()

app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"])

def get_db_connection():

    connection = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

    return connection

@app.route("/api/health", methods=["GET"])
def health_check():

    return jsonify({
        "message": "Student Task Manager API is running!"
    })

@app.route("/api/tasks", methods=["GET"])
def get_tasks():

    connection = get_db_connection()

    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM tasks")

    tasks = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(tasks)

@app.route("/api/tasks", methods=["POST"])
def add_task():

    data = request.get_json()

    title = data.get("title", "").strip()
    description = data.get("description", "").strip()

    if title == "":
        return jsonify({"message": "Task title is required"}), 400

    if len(title) > 100:
        return jsonify({"message": "Task title cannot exceed 100 characters"}), 400

    connection = get_db_connection()

    cursor = connection.cursor()

    cursor.execute(
        "INSERT INTO tasks (title, description) VALUES (%s, %s)",
        (title, description)
    )

    connection.commit()

    task_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return jsonify({
        "message": "Task created successfully",
        "id": task_id
    }), 201

@app.route("/api/tasks/<int:task_id>", methods=["PATCH"])
def update_task(task_id):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM tasks WHERE id = %s", (task_id,))
    task = cursor.fetchone()

    if task:

        new_status = not task["completed"]

        cursor.execute(
            "UPDATE tasks SET completed = %s WHERE id = %s",
            (new_status, task_id)
        )

        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({"message": "Task updated successfully"})

    cursor.close()
    connection.close()

    return jsonify({"message": "Task not found"}), 404


@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def edit_task(task_id):

    data = request.get_json()

    title = data.get('title', '').strip()
    description = data.get('description', '').strip()

    if title == '':
        return jsonify({'message': 'Task title is required'}), 400

    if len(title) > 100:
        return jsonify({'message': 'Task title cannot exceed 100 characters'}), 400
        
    connection = get_db_connection()
    cursor = connection.cursor()

    sql = "UPDATE tasks SET title = %s, description = %s WHERE id = %s"

    values = (title, description, task_id)

    cursor.execute(sql, values)

    connection.commit()

    cursor.close()
    connection.close()

    return jsonify({'message': 'Task updated successfully!'}), 200


@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):

    
    connection = get_db_connection()
    cursor = connection.cursor()

   
    cursor.execute(
        "DELETE FROM tasks WHERE id = %s",
        (task_id,)
    )

    deleted_rows = cursor.rowcount

    connection.commit()

    cursor.close()
    connection.close()

    if deleted_rows > 0:
        return jsonify({"message": "Task deleted successfully"})

    return jsonify({"message": "Task not found"}), 404





















if __name__ == "__main__":
    app.run(debug=True, port=5000)