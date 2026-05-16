import { useState } from "react";

const CATEGORIES = ["Food", "Transport", "Shopping", "Health", "Bills", "Entertainment", "Other"];

const empty = { title: "", amount: "", category: "Food", date: "" };

export default function ExpenseForm({ onAdd }) {
    const [form, setForm] = useState(empty);
    const [error, setError] = useState("");

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!form.title.trim() || !form.amount || !form.date) {
            setError("Please fill in all fields.");
            return;
        }
        if (Number(form.amount) <= 0) {
            setError("Amount must be greater than zero.");
            return;
        }
        setError("");
        onAdd({ ...form, amount: parseFloat(form.amount) });
        setForm(empty);
    }

    return (
        <div className="card">
            <h2 className="section-title">Add Expense</h2>
            {error && <p className="form-error">{error}</p>}
            <div className="form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="e.g. Grocery run"
                            value={form.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="amount">Amount (PKR)</label>
                        <input
                            id="amount"
                            name="amount"
                            type="number"
                            min="0"
                            placeholder="0.00"
                            value={form.amount}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select id="category" name="category" value={form.category} onChange={handleChange}>
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            value={form.date}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <button className="btn-add" onClick={handleSubmit}>+ Add Expense</button>
            </div>
        </div>
    );
}