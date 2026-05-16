const CATEGORY_COLORS = {
    Food: "#f97316",
    Transport: "#3b82f6",
    Shopping: "#ec4899",
    Health: "#22c55e",
    Bills: "#a855f7",
    Entertainment: "#eab308",
    Other: "#6b7280",
};

export default function ExpenseList({ expenses, onDelete }) {
    if (expenses.length === 0) {
        return (
            <div className="card empty-state">
                <span className="empty-icon">📭</span>
                <p>No expenses yet. Add one above.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h2 className="section-title">Expenses</h2>
            <ul className="expense-list">
                {expenses.map((expense) => (
                    <li key={expense.id} className="expense-item">
                        <span
                            className="category-dot"
                            style={{ background: CATEGORY_COLORS[expense.category] || "#6b7280" }}
                        />
                        <div className="expense-info">
                            <span className="expense-title">{expense.title}</span>
                            <span className="expense-meta">
                                {expense.category} &middot; {expense.date}
                            </span>
                        </div>
                        <span className="expense-amount">PKR {Number(expense.amount).toLocaleString()}</span>
                        <button
                            className="btn-delete"
                            onClick={() => onDelete(expense.id)}
                            aria-label="Delete expense"
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}