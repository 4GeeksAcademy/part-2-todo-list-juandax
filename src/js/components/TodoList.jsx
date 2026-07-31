import React, { useState, useEffect } from "react";

function TodoList() {
    const [inputValue, setInputValue] = useState("");
    const [todos, setTodos] = useState([]);

    const username = "juandaxx";

    const apiURL = `https://playground.4geeks.com/todo/users/${username}`;
    const todoApiURL = `https://playground.4geeks.com/todo/todos`;

    const getTasks = () => {
        fetch(apiURL)
            .then((resp) => {
                if (resp.status === 404) {
                    createUser();
                    return [];
                }
                if (!resp.ok) throw new Error("Error obteniendo tareas");
                return resp.json();
            })
            .then((data) => {
                if (data && data.todos) {
                    setTodos(data.todos);
                }
            })
            .catch((error) => console.log(error));
    };

    const createUser = () => {
        fetch(apiURL, {
            method: "POST"
        })
            .then((resp) => {
                if (resp.ok) getTasks();
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        getTasks();
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {

            const newTask = {
                label: inputValue.trim(),
                is_done: false
            };

            fetch(`${todoApiURL}/${username}`, {
                method: "POST",
                body: JSON.stringify(newTask),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((resp) => {
                    if (resp.ok) {
                        setInputValue("");
                        getTasks();
                    }
                })
                .catch((error) => console.log(error));
        }
    };

    const deleteTodo = (id) => {
        fetch(`${todoApiURL}/${id}`, {
            method: "DELETE"
        })
            .then((resp) => {
                if (resp.ok) getTasks();
            })
            .catch((error) => console.log(error));
    };

    const clearAllTasks = () => {
        fetch(apiURL, {
            method: "DELETE"
        })
            .then((resp) => {
                if (resp.ok) {
                    setTodos([]);
                    createUser();
                }
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="todo-page">

            <h1 className="todo-title">
                todos
            </h1>

            <div className="todo-container">

                <input
                    type="text"
                    className="todo-input"
                    placeholder="What needs to be done?"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <ul className="list-group list-group-flush">

                    {todos.length === 0 ? (
                        <li className="list-group-item todo-item">
                            No tasks, add a task
                        </li>
                    ) : (
                        todos.map((todo) => (

                            <li
                                key={todo.id}
                                className="list-group-item todo-item"
                            >

                                <span>{todo.label}</span>

                                <button
                                    className="delete-icon"
                                    onClick={() => deleteTodo(todo.id)}
                                >
                                    ✕
                                </button>

                            </li>

                        ))
                    )}

                </ul>

                <div className="todo-footer">

                    <span>
                        {todos.length} {todos.length === 1 ? "item left" : "items left"}
                    </span>

                    {todos.length > 0 && (
                        <button
                            className="clear-button"
                            onClick={clearAllTasks}
                        >
                            Clear all
                        </button>
                    )}

                </div>

            </div>

            <div className="shadow-line one"></div>
            <div className="shadow-line two"></div>

        </div>
    );
}

export default TodoList;