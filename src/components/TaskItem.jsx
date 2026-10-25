import { useState } from "react";

export default function TaskItem({ task, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(task.text);

    const handleSave = () => {
        if (editText.trim() === "") return;
        onUpdate(task.id, editText.trim());
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditText(task.text);
        setIsEditing(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") handleCancel();
    };

    return (
        <li className="task-item">
            {isEditing ? (
                <div className="edit-mode">
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="edit-input"
                        autoFocus
                    />
                    <div className="edit-buttons">
                        <button onClick={handleSave} className="save-btn" title="Сохранить">
                            💾
                        </button>
                        <button onClick={handleCancel} className="cancel-btn" title="Отмена">
                            ❌
                        </button>
                    </div>
                </div>
            ) : (
                <div className="view-mode">
                    <span className="task-text">{task.text}</span>
                    <div className="task-buttons">
                        <button onClick={() => setIsEditing(true)} className="edit-btn" title="Редактировать">
                            ✏️
                        </button>
                        <button onClick={() => onDelete(task.id)} className="delete-btn" title="Удалить">
                            🗑️
                        </button>
                    </div>
                </div>
            )}
        </li>
    );
}
