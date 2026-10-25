// Слой работы с данными.
// Если задан VITE_API_URL — задачи хранятся на сервере (Express API из прошлого задания),
// иначе — в localStorage браузера, чтобы приложение работало на Vercel без отдельного бэкенда.

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;
const STORAGE_KEY = "todo-tasks";

export const storageMode = API_URL ? "server" : "local";

const headers = {
    "Content-Type": "application/json",
    ...(API_KEY ? { "x-api-key": API_KEY } : {}),
};

async function request(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, { headers, ...options });
    if (!res.ok) throw new Error(`Ошибка ${res.status}`);
    return res.status === 204 ? null : res.json();
}

function readLocal() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function writeLocal(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export async function getTasks() {
    if (storageMode === "server") return request("/api/tasks");
    return readLocal();
}

export async function addTask(text) {
    if (storageMode === "server") {
        return request("/api/tasks", { method: "POST", body: JSON.stringify({ text }) });
    }
    const tasks = readLocal();
    const task = { id: Date.now(), text };
    writeLocal([...tasks, task]);
    return task;
}

export async function updateTask(id, text) {
    if (storageMode === "server") {
        return request(`/api/tasks/${id}`, { method: "PUT", body: JSON.stringify({ text }) });
    }
    const tasks = readLocal().map((t) => (t.id === id ? { ...t, text } : t));
    writeLocal(tasks);
    return tasks.find((t) => t.id === id);
}

export async function deleteTask(id) {
    if (storageMode === "server") {
        return request(`/api/tasks/${id}`, { method: "DELETE" });
    }
    writeLocal(readLocal().filter((t) => t.id !== id));
    return null;
}
