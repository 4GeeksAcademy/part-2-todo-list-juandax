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
                if (data && data.todos) setTodos(data.todos);
            })
            .catch((error) => console.log(error));
    };

    const createUser = () => {
        fetch(apiURL, { method: "POST" })
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
                headers: { "Content-Type": "application/json" }
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
        fetch(`${todoApiURL}/${id}`, { method: "DELETE" })
            .then((resp) => {
                if (resp.ok) getTasks();
            })
            .catch((error) => console.log(error));
    };

    const clearAllTasks = () => {
        fetch(apiURL, { method: "DELETE" })
            .then((resp) => {
                if (resp.ok) {
                    setTodos([]);
                    createUser();
                }
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-light py-5">
            <h1 className="text-danger display-1 opacity-25 fw-light mb-4" style={{ fontSize: "6rem" }}>
                todos
            </h1>
            
            <div className="bg-white shadow-lg border border-light" style={{ width: "500px", borderRadius: "2px" }}>
                <input
                    type="text"
                    className="form-control border-0 border-bottom rounded-0 py-3 px-4 fs-4 fw-light"
                    placeholder="¿Qué necesitas hacer?"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ boxShadow: "none", fontStyle: "italic", borderColor: "#e6e6e6", color: "#4d4d4d" }}
                />

                <ul className="list-group list-group-flush m-0">
                    {todos.length === 0 ? (
                        <li className="list-group-item text-muted py-3 px-4 fw-light fs-5 bg-white border-bottom text-center">
                            No hay tareas, añadir tareas
                        </li>
                    ) : (
                        todos.map((todo) => (
                            <li 
                                key={todo.id} 
                                className="list-group-item d-flex justify-content-between align-items-center py-3 px-4 fs-5 fw-light todo-item bg-white border-bottom"
                                style={{ color: "#4d4d4d" }}
                            >
                                <span>{todo.label}</span>
                                <i 
                                    className="fas fa-times text-danger delete-icon opacity-0"
                                    onClick={() => deleteTodo(todo.id)}
                                    style={{ cursor: "pointer", transition: "opacity 0.15s ease-in-out" }}
                                ></i>
                            </li>
                        ))
                    )}
                </ul>

                <div className="bg-white text-muted py-2 px-3 fs-6 fw-light border-0 d-flex justify-content-between align-items-center" style={{ fontSize: "0.85rem" }}>
                    <span>
                        {todos.length} {todos.length === 1 ? "item left" : "items left"}
                    </span>
                    {todos.length > 0 && (
                        <button 
                            className="btn btn-sm btn-outline-danger border-0 fw-light fs-6 opacity-75"
                            onClick={clearAllTasks}
                        >
                            Limpiar todo
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white border border-light shadow-sm" style={{ height: "4px", width: "496px", marginTop: "-1px", zIndex: 2 }}></div>
            <div className="bg-white border border-light shadow-sm" style={{ height: "4px", width: "492px", marginTop: "-1px", zIndex: 1 }}></div>
        </div>
    );
}

export default TodoList;