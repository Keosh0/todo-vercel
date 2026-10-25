import { useState, useEffect } from "react";
import TaskInput from "./TaskInput";
import TaskList from "./TaskList";
import { getTasks, addTask, updateTask, deleteTask, storageMode } from "../api";
import "./App.css";

// Системные переменные Vercel (для Vite платформа передаёт их с префиксом VITE_)
const DEPLOY_ENV = import.meta.env.VITE_VERCEL_ENV || "local";
const BRANCH = import.meta.env.VITE_VERCEL_GIT_COMMIT_REF;
const HAS_API_KEY = Boolean(import.meta.env.VITE_API_KEY);

function App() {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");

    // Загрузка списка задач при монтировании компонента
    useEffect(() => {
        getTasks()
            .then(setTasks)
            .catch((err) => {
                console.error("Ошибка:", err);
                setError("Не удалось загрузить задачи");
            });
    }, []);

    const handleAddTask = async () => {
        if (inputValue.trim() === "") return;
        try {
            const newTask = await addTask(inputValue.trim());
            setTasks((prev) => [...prev, newTask]);
            setInputValue("");
            setError("");
        } catch (e) {
            console.error("Ошибка при добавлении", e);
            setError("Не удалось добавить задачу");
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await deleteTask(id);
            setTasks((prev) => prev.filter((t) => t.id !== id));
            setError("");
        } catch (e) {
            console.error("Ошибка при удалении", e);
            setError("Не удалось удалить задачу");
        }
    };

    const handleUpdateTask = async (id, newText) => {
        try {
            const updated = await updateTask(id, newText);
            setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
            setError("");
        } catch (e) {
            console.error("Ошибка при обновлении", e);
            setError("Не удалось обновить задачу");
        }
    };

    return (
        <div className="App">
            <h1>Мой список дел</h1>
            <TaskInput
                inputValue={inputValue}
                setInputValue={setInputValue}
                onAddTask={handleAddTask}
            />
            {error && <p className="error">{error}</p>}
            <TaskList
                tasks={tasks}
                onDeleteTask={handleDeleteTask}
                onUpdateTask={handleUpdateTask}
            />
            <p className="counter">Задач: {tasks.length}</p>
            <footer className="deploy-info">
                <span className={`badge badge-${DEPLOY_ENV}`}>{DEPLOY_ENV}</span>
                {BRANCH && <span>ветка: {BRANCH}</span>}
                <span>хранилище: {storageMode === "server" ? "сервер API" : "браузер (localStorage)"}</span>
                <span>API-ключ: {HAS_API_KEY ? "задан в переменных окружения" : "не задан"}</span>
            </footer>
        </div>
    );
}

export default App;
