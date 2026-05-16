import { useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseFilter from "./components/ExpenseFilter";
import {
  addExpense,
  deleteExpense,
  getTotalExpense,
  filterByCategory,
} from "./utils/expenseUtils";
import "./App.css";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState("All");

  function handleAdd(newExpense) {
    setExpenses((prev) => addExpense(prev, newExpense));
  }

  function handleDelete(id) {
    setExpenses((prev) => deleteExpense(prev, id));
  }

  const filtered = filterByCategory(expenses, category);
  const total = getTotalExpense(filtered);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div>
            <h1 className="app-title">Expense Tracker</h1>
            <p className="app-subtitle">Keep tabs on where your money goes</p>
          </div>
          <div className="total-badge">
            <span className="total-label">Total</span>
            <span className="total-amount">PKR {total.toLocaleString()}</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <ExpenseForm onAdd={handleAdd} />

        <div className="list-section">
          <ExpenseFilter selected={category} onChange={setCategory} />
          <ExpenseList expenses={filtered} onDelete={handleDelete} />
        </div>
      </main>
    </div>
  );
}