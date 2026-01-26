import { useLocalStorage } from './useLocalStorage';
import { Pet, Expense, Budget, RecurringExpense, ExpenseCategory } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export const INITIAL_PETS: Pet[] = [
  {
    id: 'pet-1',
    name: 'Buddy',
    type: 'dog',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpgejgI3DQGUNat4hRUxnY-WtsaM76wafz3Aqr8Nj4FNbJqFYsm3Mi5_u6VaF3UHRRAjwxXPXaeyDlXgS_SoqdM2RK6Ptr0GysFH0NK9uW-TmQMPH9nYVpsKg188NxzIcQdlHAYaYXcXORI4IOA0BkYa3UQI6Vek7CH-eOjPIPjk_TWmkwe_jC3dXWwvT6gIEHG19Uvt8EnfkDPpCFrQo53RsfNJ7ImvJVrgd1pbupPb_7OtedGHqhbXrBMlkCSIY66BeWOKfYoYs',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'pet-2',
    name: 'Luna',
    type: 'cat',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzsIFZiRIzg1XSCYlmpdySHhz6ZPZCc0JuqTV1fyErV45CDwv5idLpgfDf_bSMzNmJXbjFoi9jL9CJAredbh-lD6wovu86M1LBIk8bnpOP5vTZEUon_yoVLXdl4kHy8Rfo4-bPXJTaMlFRXic65-7-UlrpDaAYZAFiOKD0CheuGMA_8BQTrEYikC2txwez4FMCvHpS-yl4Q0TS0EqZsVoWhLLMX7leWt619ofLVurohENxGOdjbmt4-RaLZKfjlR2W0MwuJXCkGzI',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'pet-3',
    name: 'Max',
    type: 'rabbit',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtGiJdeBklzicK7RmLuM-jk72iPcnBTyKg0Ose6o3c5tjbuc8OjIpRDzeZgGPAHUWQWBUa8Xl_CCWmBxABO42tBPydLa0MOVHCLeXrBOcL1WZv9USHS6vqiVg5S-ClkY8QU6HLl1fAyF8NaPXP84BK_3-VJKJR5esabZRkCr-Uw5Ywnls1f_ZN_WdOC4hOSJOlhdKbRcUBq_uxh20AF9zbH9Njog8B4bCC3nIwr5DGWrcshbYKrh6aXK7Ahw8jDYcX97oS88JK4aM',
    dateAdded: new Date().toISOString(),
  },
  {
    id: 'pet-4',
    name: 'Rio',
    type: 'bird',
    photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACJGaMXIkcziNXy6hbtxzgPiZAHkEMRjRHLMsVmGae-zRJYAc29ShMdZyE1gQ0y8cNspYR-rosD1sGeW184Dj1H4KBzRGO5UWLJaPsfZDKZW10k5NltqJlMJZJbmCTVGzQTL9f6LF-My7CoXfvyBtN7mfgBz2v75bM4Sj8W6hAPEopEVsJ02KKmQ6ejTwK4CMKMYMgde0GB1NdajE3q8m0Uqo5jbv9LAmqHtyleaCft3xaRWs25TBN00oKxPc_e4iICsrqhyPBYEQ',
    dateAdded: new Date().toISOString(),
  },
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 'exp-1', petId: 'pet-1', date: new Date().toISOString(), category: 'food', amount: 45.50, notes: 'Premium Kibble' },
  { id: 'exp-2', petId: 'pet-1', date: new Date(Date.now() - 86400000).toISOString(), category: 'toys', amount: 15.00, notes: 'Squeaky Toy' },
  { id: 'exp-3', petId: 'pet-2', date: new Date(Date.now() - 172800000).toISOString(), category: 'healthcare', amount: 80.00, notes: 'Vaccination' },
  { id: 'exp-4', petId: 'pet-3', date: new Date(Date.now() - 259200000).toISOString(), category: 'food', amount: 20.00, notes: 'Carrots & Hay' },
  { id: 'exp-5', petId: 'pet-4', date: new Date(Date.now() - 345600000).toISOString(), category: 'other', amount: 12.00, notes: 'Bird seed' },
  { id: 'exp-6', petId: 'pet-1', date: new Date(Date.now() - 500000000).toISOString(), category: 'grooming', amount: 60.00, notes: 'Full Grooming' },
];

export function usePets() {
  const [pets, setPets] = useLocalStorage<Pet[]>('pet-expenses-pets-v2', INITIAL_PETS);

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
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('pet-expenses-expenses-v2', INITIAL_EXPENSES);

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
  const [budgets, setBudgets] = useLocalStorage<Budget[]>('pet-expenses-budgets', []);

  const setBudget = (petId: string, category: ExpenseCategory, monthlyLimit: number) => {
    const existing = budgets.find((b) => b.petId === petId && b.category === category);
    if (existing) {
      setBudgets((prev) =>
        prev.map((b) =>
          b.id === existing.id ? { ...b, monthlyLimit } : b
        )
      );
    } else {
      setBudgets((prev) => [
        ...prev,
        { id: uuidv4(), petId, category, monthlyLimit },
      ]);
    }
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
  const [recurring, setRecurring] = useLocalStorage<RecurringExpense[]>('pet-expenses-recurring', []);

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
  const [pets] = useLocalStorage<Pet[]>('pet-expenses-pets', []);
  const [expenses] = useLocalStorage<Expense[]>('pet-expenses-expenses', []);
  const [budgets] = useLocalStorage<Budget[]>('pet-expenses-budgets', []);
  const [recurring] = useLocalStorage<RecurringExpense[]>('pet-expenses-recurring', []);

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
