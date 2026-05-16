const CATEGORIES = ["All", "Food", "Transport", "Shopping", "Health", "Bills", "Entertainment", "Other"];

export default function ExpenseFilter({ selected, onChange }) {
    return (
        <div className="filter-bar">
            <label htmlFor="filter-category" className="filter-label">Filter by Category</label>
            <select
                id="filter-category"
                className="filter-select"
                value={selected}
                onChange={(e) => onChange(e.target.value)}
            >
                {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>
        </div>
    );
}