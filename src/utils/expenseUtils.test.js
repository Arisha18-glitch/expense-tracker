import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
    addExpense,
    deleteExpense,
    getTotalExpense,
    filterByCategory,
    getExpenseById,
} from "./expenseUtils";

// ─────────────────────────────────────────────────────────────
// Shared Test Data
// ─────────────────────────────────────────────────────────────

const sampleExpenses = [
    { id: 1, title: "Grocery run", amount: 3500, category: "Food", date: "2024-05-01" },
    { id: 2, title: "Uber to office", amount: 850, category: "Transport", date: "2024-05-02" },
    { id: 3, title: "Netflix sub", amount: 1200, category: "Entertainment", date: "2024-05-03" },
    { id: 4, title: "Clinic visit", amount: 2200, category: "Health", date: "2024-05-04" },
    { id: 5, title: "Electricity bill", amount: 4800, category: "Bills", date: "2024-05-05" },
    { id: 6, title: "Shein order", amount: 6700, category: "Shopping", date: "2024-05-06" },
];

// Fresh copy per test — prevents mutation bleed between tests
function getExpenses() {
    return sampleExpenses.map((e) => ({ ...e }));
}

// ─────────────────────────────────────────────────────────────
// addExpense
// ─────────────────────────────────────────────────────────────

describe("addExpense", () => {
    it("happy path: appends a new expense and assigns a numeric id", () => {
        const expenses = getExpenses();
        const newExpense = { title: "Coffee", amount: 350, category: "Food", date: "2024-05-07" };

        const result = addExpense(expenses, newExpense);

        expect(result).toHaveLength(expenses.length + 1);
        const added = result[result.length - 1];
        expect(added.title).toBe("Coffee");
        expect(added.amount).toBe(350);
        expect(typeof added.id).toBe("number");
    });

    it("edge case: adding to an empty array returns a single-item array", () => {
        const result = addExpense([], { title: "Tea", amount: 100, category: "Food", date: "2024-05-07" });

        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("Tea");
    });

    it("invalid input: does not mutate the original array", () => {
        const expenses = getExpenses();
        const original = [...expenses];
        const newExpense = { title: "Bus fare", amount: 50, category: "Transport", date: "2024-05-07" };

        addExpense(expenses, newExpense);

        expect(expenses).toEqual(original);
    });
});

// ─────────────────────────────────────────────────────────────
// deleteExpense
// ─────────────────────────────────────────────────────────────

describe("deleteExpense", () => {
    it("happy path: removes the expense with the matching id", () => {
        const expenses = getExpenses();

        const result = deleteExpense(expenses, 3);

        expect(result).toHaveLength(expenses.length - 1);
        expect(result.find((e) => e.id === 3)).toBeUndefined();
    });

    it("edge case: id not in list returns the array unchanged", () => {
        const expenses = getExpenses();

        const result = deleteExpense(expenses, 999);

        expect(result).toHaveLength(expenses.length);
        expect(result).toEqual(expenses);
    });

    it("invalid input: empty array returns empty array", () => {
        const result = deleteExpense([], 1);

        expect(result).toEqual([]);
    });
});

// ─────────────────────────────────────────────────────────────
// getTotalExpense
// ─────────────────────────────────────────────────────────────

describe("getTotalExpense", () => {
    beforeEach(() => {
        vi.spyOn(console, "warn").mockImplementation(() => { });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("happy path: sums all amounts correctly", () => {
        const expenses = getExpenses();
        // 3500 + 850 + 1200 + 2200 + 4800 + 6700 = 19250
        expect(getTotalExpense(expenses)).toBe(19250);
    });

    it("edge case: empty array returns 0", () => {
        expect(getTotalExpense([])).toBe(0);
    });

    it("edge case: amount of 0 is included in the sum without error", () => {
        const expenses = [
            { id: 1, title: "Free item", amount: 0, category: "Other", date: "2024-05-01" },
            { id: 2, title: "Snack", amount: 200, category: "Food", date: "2024-05-02" },
        ];

        expect(getTotalExpense(expenses)).toBe(200);
    });

    it("edge case: string amounts that are numeric are parsed correctly", () => {
        const expenses = [
            { id: 1, title: "Item A", amount: "1500", category: "Food", date: "2024-05-01" },
            { id: 2, title: "Item B", amount: "500", category: "Food", date: "2024-05-02" },
        ];

        expect(getTotalExpense(expenses)).toBe(2000);
    });

    it("edge case: negative amounts are skipped and do not reduce the total", () => {
        const expenses = [
            { id: 1, title: "Valid", amount: 1000, category: "Food", date: "2024-05-01" },
            { id: 2, title: "Bad data", amount: -500, category: "Food", date: "2024-05-02" },
        ];

        expect(getTotalExpense(expenses)).toBe(1000);
        expect(console.warn).toHaveBeenCalled();
    });

    it("invalid input: non-numeric amount strings are skipped", () => {
        const expenses = [
            { id: 1, title: "Valid", amount: 800, category: "Bills", date: "2024-05-01" },
            { id: 2, title: "Corrupted", amount: "abc", category: "Bills", date: "2024-05-02" },
            { id: 3, title: "Also bad", amount: null, category: "Bills", date: "2024-05-03" },
            { id: 4, title: "Undefined", amount: undefined, category: "Bills", date: "2024-05-04" },
        ];

        expect(getTotalExpense(expenses)).toBe(800);
        expect(console.warn).toHaveBeenCalledWith(
            "getTotalExpense: skipping entry at index 1 — invalid amount:", "abc"
        );
        expect(console.warn).toHaveBeenCalledWith(
            "getTotalExpense: skipping entry at index 2 — invalid amount:", null
        );
        expect(console.warn).toHaveBeenCalledWith(
            "getTotalExpense: skipping entry at index 3 — invalid amount:", undefined
        );
    });

    it("invalid input: non-array input returns 0 and warns", () => {
        expect(getTotalExpense(null)).toBe(0);
        expect(console.warn).toHaveBeenCalledWith(
            "getTotalExpense: expected an array, received", "object"
        );

        expect(getTotalExpense(undefined)).toBe(0);
        expect(console.warn).toHaveBeenCalledWith(
            "getTotalExpense: expected an array, received", "undefined"
        );

        expect(getTotalExpense("expenses")).toBe(0);
        expect(console.warn).toHaveBeenCalledWith(
            "getTotalExpense: expected an array, received", "string"
        );

        expect(getTotalExpense(42)).toBe(0);
        expect(console.warn).toHaveBeenCalledWith(
            "getTotalExpense: expected an array, received", "number"
        );
    });
});

// ─────────────────────────────────────────────────────────────
// filterByCategory
// ─────────────────────────────────────────────────────────────

describe("filterByCategory", () => {
    it("happy path: returns only expenses matching the category", () => {
        const expenses = getExpenses();

        const result = filterByCategory(expenses, "Health");

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe(4);
        expect(result[0].category).toBe("Health");
    });

    it("edge case: category 'All' returns the full list", () => {
        const expenses = getExpenses();

        const result = filterByCategory(expenses, "All");

        expect(result).toHaveLength(expenses.length);
    });

    it("edge case: empty string returns the full list", () => {
        const expenses = getExpenses();

        const result = filterByCategory(expenses, "");

        expect(result).toHaveLength(expenses.length);
    });

    it("edge case: category with no matches returns an empty array", () => {
        const expenses = getExpenses();

        const result = filterByCategory(expenses, "Travel");

        expect(result).toEqual([]);
    });

    it("invalid input: null category returns the full list", () => {
        const expenses = getExpenses();

        const result = filterByCategory(expenses, null);

        expect(result).toHaveLength(expenses.length);
    });

    it("invalid input: undefined category returns the full list", () => {
        const expenses = getExpenses();

        const result = filterByCategory(expenses, undefined);

        expect(result).toHaveLength(expenses.length);
    });
});

// ─────────────────────────────────────────────────────────────
// getExpenseById
// ─────────────────────────────────────────────────────────────

describe("getExpenseById", () => {
    it("happy path: returns the correct expense for a valid id", () => {
        const expenses = getExpenses();

        const result = getExpenseById(expenses, 5);

        expect(result).not.toBeNull();
        expect(result.id).toBe(5);
        expect(result.title).toBe("Electricity bill");
    });

    it("edge case: id not in list returns null", () => {
        const expenses = getExpenses();

        const result = getExpenseById(expenses, 999);

        expect(result).toBeNull();
    });

    it("edge case: empty array always returns null", () => {
        const result = getExpenseById([], 1);

        expect(result).toBeNull();
    });

    it("invalid input: null id returns null", () => {
        const expenses = getExpenses();

        const result = getExpenseById(expenses, null);

        expect(result).toBeNull();
    });

    it("invalid input: undefined id returns null", () => {
        const expenses = getExpenses();

        const result = getExpenseById(expenses, undefined);

        expect(result).toBeNull();
    });

    it("invalid input: string id does not match numeric id", () => {
        const expenses = getExpenses();
        // id 2 is a number; passing "2" as a string should not match
        const result = getExpenseById(expenses, "2");

        expect(result).toBeNull();
    });
});