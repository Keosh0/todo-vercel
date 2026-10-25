import { useState, useEffect, lazy, Suspense } from "react";
import TaskInput from "./TaskInput";
import { getTasks, addTask, updateTask, deleteTask, storageMode } from "../api";

// Ленивая загрузка: код списка задач загружается отдельным файлом,
// поэтому поле ввода появляется на экране раньше
const TaskList = lazy(() => import("./TaskList"));
import "./App.css";

function App() {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState("");
    // Сведения о деплое от серверной функции /api/status (на локальном dev-сервере её нет)
    const [deploy, setDeploy] = useState({ environment: "local", branch: null, apiKeyConfigured: null });

    useEffect(() => {
        fetch("/api/status")
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`Ошибка ${res.status}`))))
            .then(setDeploy)
            .catch(() => {});
    }, []);

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
            <Suspense fallback={<p className="empty">Загрузка списка…</p>}>
                <TaskList
                    tasks={tasks}
                    onDeleteTask={handleDeleteTask}
                    onUpdateTask={handleUpdateTask}
                />
            </Suspense>
            <p className="counter">Задач: {tasks.length}</p>
            <footer className="deploy-info">
                <span className={`badge badge-${deploy.environment}`}>{deploy.environment}</span>
                {deploy.branch && <span>ветка: {deploy.branch}</span>}
                <span>хранилище: {storageMode === "server" ? "сервер API" : "браузер (localStorage)"}</span>
                {deploy.apiKeyConfigured !== null && (
                    <span>API_KEY на сервере: {deploy.apiKeyConfigured ? "задан ✓" : "не задан"}</span>
                )}
            </footer>
        </div>
    );
}

export default App;
