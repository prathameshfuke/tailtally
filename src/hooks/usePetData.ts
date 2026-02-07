import { useLocalStorage } from './useLocalStorage';
import { Pet, Expense, Budget, RecurringExpense, ExpenseCategory } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export function usePets() {
  const [pets, setPets] = useLocalStorage<Pet[]>('pet-expenses-pets-v4', []);

  const addPet = (pet: Omit<Pet, 'id' | 'dateAdded'>) => {
    const newPet: Pet = {
      ...pet,
      id: uuidv4(),
      dateAdded: new Date().toISOString(),
    };
    setPets((prev) => [...prev, newPet]);
    return newPet;
  };

  const updatePet = (id: string, updates: Partial<Pet>) => {
    setPets((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePet = (id: string) => {
    setPets((prev) => prev.filter((p) => p.id !== id));
  };

  return { pets, addPet, updatePet, deletePet };
}

export function useExpenses() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('pet-expenses-expenses-v4', []);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: uuidv4(),
    };
    setExpenses((prev) => [...prev, newExpense]);
    return newExpense;
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const getExpensesByPet = (petId: string) => {
    return expenses.filter((e) => e.petId === petId);
  };

  const getExpensesByCategory = (category: ExpenseCategory) => {
    return expenses.filter((e) => e.category === category);
  };

  const getExpensesByDateRange = (startDate: Date, endDate: Date) => {
    return expenses.filter((e) => {
      const expenseDate = new Date(e.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  };

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpensesByPet,
    getExpensesByCategory,
    getExpensesByDateRange
  };
}

export function useBudgets() {
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('pet-expenses-budgets-v4', []);

  const setBudget = (petId: string, category: ExpenseCategory, monthlyLimit: number) => {
    setBudgets((prev) => {
      // Remove any existing budgets for this category/pet to prevent duplicates
      const filtered = prev.filter((b) => !(b.petId === petId && b.category === category));

      // If we're updating an existing one, we could try to preserve ID, but generating new one is fine too.
      // Or finding the existing ID first:
      const existing = prev.find((b) => b.petId === petId && b.category === category);
      const id = existing ? existing.id : uuidv4();

      return [
        ...filtered,
        { id, petId, category, monthlyLimit },
      ];
    });
  };

  const getBudget = (petId: string, category: ExpenseCategory) => {
    return budgets.find((b) => b.petId === petId && b.category === category);
  };

  const getBudgetsByPet = (petId: string) => {
    return budgets.filter((b) => b.petId === petId);
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  return { budgets, setBudget, getBudget, getBudgetsByPet, deleteBudget };
}

export function useRecurringExpenses() {
  const [recurring, setRecurring] = useLocalStorage<RecurringExpense[]>('pet-expenses-recurring-v4', []);

  const addRecurring = (expense: Omit<RecurringExpense, 'id' | 'paidThisMonth'>) => {
    const newRecurring: RecurringExpense = {
      ...expense,
      id: uuidv4(),
      paidThisMonth: false,
    };
    setRecurring((prev) => [...prev, newRecurring]);
    return newRecurring;
  };

  const updateRecurring = (id: string, updates: Partial<RecurringExpense>) => {
    setRecurring((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteRecurring = (id: string) => {
    setRecurring((prev) => prev.filter((r) => r.id !== id));
  };

  const markAsPaid = (id: string) => {
    setRecurring((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, paidThisMonth: true, lastPaidDate: new Date().toISOString() }
          : r
      )
    );
  };

  const resetMonthlyPayments = () => {
    setRecurring((prev) => prev.map((r) => ({ ...r, paidThisMonth: false })));
  };

  return { recurring, addRecurring, updateRecurring, deleteRecurring, markAsPaid, resetMonthlyPayments };
}

export function useDataExport() {
  const [pets] = useLocalStorage<Pet[]>('pet-expenses-pets-v4', []);
  const [expenses] = useLocalStorage<Expense[]>('pet-expenses-expenses-v4', []);
  const [budgets] = useLocalStorage<Budget[]>('pet-expenses-budgets-v4', []);
  const [recurring] = useLocalStorage<RecurringExpense[]>('pet-expenses-recurring-v4', []);

  const exportToJSON = () => {
    const data = { pets, expenses, budgets, recurring, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pet-expenses-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Pet', 'Category', 'Amount', 'Notes'];
    const petMap = new Map(pets.map(p => [p.id, p.name]));

    const rows = expenses.map(e => [
      e.date,
      petMap.get(e.petId) || 'Unknown',
      e.category,
      e.amount.toFixed(2),
      e.notes || ''
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pet-expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return { exportToJSON, exportToCSV };
}
