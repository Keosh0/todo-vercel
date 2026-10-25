export default function TaskInput({ inputValue, setInputValue, onAddTask }) {
    const handleKeyPress = (e) => {
        if (e.key === "Enter") onAddTask();
    };

    return (
        <div className="input-container">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Введите задачу..."
            />
            <button onClick={onAddTask}>Добавить</button>
        </div>
    );
}
