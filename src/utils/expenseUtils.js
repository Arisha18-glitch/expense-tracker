export function addExpense(expenses, newExpense) {
    return [...expenses, { ...newExpense, id: Date.now() }];
}

export function deleteExpense(expenses, id) {
    return expenses.filter((expense) => expense.id !== id);
}

export function getTotalExpense(expenses) {
    // Input must be an array
    if (!Array.isArray(expenses)) {
        console.warn("getTotalExpense: expected an array, received", typeof expenses);
        return 0;
    }

    // Empty array — valid case, total is simply zero
    if (expenses.length === 0) return 0;

    return expenses.reduce((sum, expense, index) => {
        const raw = expense?.amount;
        const parsed = parseFloat(raw);

        // Skip entries where amount is missing, null, or non-numeric
        if (raw == null || isNaN(parsed) || !isFinite(parsed)) {
            console.warn(`getTotalExpense: skipping entry at index ${index} — invalid amount:`, raw);
            return sum;
        }

        // Skip negative amounts (guard against bad data)
        if (parsed < 0) {
            console.warn(`getTotalExpense: skipping entry at index ${index} — negative amount:`, parsed);
            return sum;
        }

        return sum + parsed;
    }, 0);
}

export function filterByCategory(expenses, category) {
    if (!category || category === "All") return expenses;
    return expenses.filter((expense) => expense.category === category);
}

export function getExpenseById(expenses, id) {
    return expenses.find((expense) => expense.id === id) || null;
}