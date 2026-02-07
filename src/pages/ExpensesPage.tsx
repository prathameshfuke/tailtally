import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Receipt, Search, Filter } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { usePets, useExpenses } from '@/hooks/usePetData';
import { useCurrency } from '@/hooks/useCurrency';
import { Expense, ExpenseCategory, CATEGORY_CONFIG, PET_TYPE_CONFIG } from '@/lib/types';
import { EmptyState } from '@/components/ui/empty-state';
import { ExpenseCard } from '@/components/expenses/ExpenseCard';
import { ExpenseFormDialog } from '@/components/expenses/ExpenseFormDialog';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import illustratorBg from '@/assets/illustrator-bg.jpg';

type TimeFilter = 'all' | 'this-month' | 'last-3-months' | 'last-12-months';

const categoryEmojis: Record<ExpenseCategory, string> = {
  food: '🍖',
  healthcare: '🏥',
  grooming: '✂️',
  toys: '🎾',
  training: '🎓',
  other: '💰'
};

export default function ExpensesPage() {
  const navigate = useNavigate();
  const { pets } = usePets();
  const { expenses, addExpense, updateExpense, deleteExpense } = useExpenses();
  const { toast } = useToast();
  const { formatAmount } = useCurrency();

  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [petFilter, setPetFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        if (searchQuery) {
          const pet = pets.find((p) => p.id === expense.petId);
          const searchLower = searchQuery.toLowerCase();
          const matchesNotes = expense.notes?.toLowerCase().includes(searchLower);
          const matchesPet = pet?.name.toLowerCase().includes(searchLower);
          const matchesCategory = CATEGORY_CONFIG[expense.category].label.toLowerCase().includes(searchLower);
          if (!matchesNotes && !matchesPet && !matchesCategory) return false;
        }

        if (timeFilter !== 'all') {
          const now = new Date();
          let start: Date;
          const end = endOfMonth(now);

          switch (timeFilter) {
            case 'this-month':
              start = startOfMonth(now);
              break;
            case 'last-3-months':
              start = startOfMonth(subMonths(now, 2));
              break;
            case 'last-12-months':
              start = startOfMonth(subMonths(now, 11));
              break;
            default:
              start = new Date(0);
          }

          const expenseDate = new Date(expense.date);
          if (!isWithinInterval(expenseDate, { start, end })) return false;
        }

        if (petFilter !== 'all' && expense.petId !== petFilter) return false;
        if (categoryFilter !== 'all' && expense.category !== categoryFilter) return false;

        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, pets, searchQuery, timeFilter, petFilter, categoryFilter]);

  const totalFiltered = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const handleAddExpense = (data: {
    petId: string;
    date: Date;
    category: ExpenseCategory;
    amount: number;
    notes?: string;
  }) => {
    addExpense({
      petId: data.petId,
      date: data.date.toISOString(),
      category: data.category,
      amount: data.amount,
      notes: data.notes,
    });
    toast({
      title: 'Expense logged!',
      description: `${formatAmount(data.amount)} expense has been recorded.`,
    });
  };

  const handleEditExpense = (data: {
    petId: string;
    date: Date;
    category: ExpenseCategory;
    amount: number;
    notes?: string;
  }) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, {
        petId: data.petId,
        date: data.date.toISOString(),
        category: data.category,
        amount: data.amount,
        notes: data.notes,
      });
      toast({
        title: 'Expense updated!',
        description: 'The expense has been updated successfully.',
      });
      setEditingExpense(null);
    }
  };

  const handleDeleteExpense = () => {
    if (deletingExpenseId) {
      deleteExpense(deletingExpenseId);
      toast({
        title: 'Expense deleted',
        description: 'The expense has been removed.',
        variant: 'destructive',
      });
      setDeletingExpenseId(null);
    }
  };

  if (pets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-yellow-900/20 px-6">
        <EmptyState
          icon={<Receipt className="h-8 w-8" />}
          title="No pets to track"
          description="Add a pet first before logging expenses."
          action={
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/pets')}
              className="gradient-warm text-white px-8 py-3 rounded-full shadow-playful-lg font-bold"
            >
              <Plus className="inline mr-2 h-4 w-4" />
              Add Your First Pet
            </motion.button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-yellow-900/20 lg:pb-12 lg:bg-none lg:bg-background-light lg:dark:bg-background-dark">
      <div>
        <PageHeader title="Expense History 📝" />
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-8 py-6 mb-2">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Expenses</h1>
          <p className="text-muted-foreground text-sm">Track and manage your pet spending</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFormDialog(true)}
          className="bg-primary text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/25 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Log New Expense
        </motion.button>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 lg:pt-0 pb-12">
        {/* Top Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-card rounded-3xl p-6 shadow-sm border border-border mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search by note, pet, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-border/50 rounded-2xl bg-gray-50/50 dark:bg-muted/50 focus:outline-none focus:border-primary focus:bg-white dark:focus:bg-card transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 flex-1 lg:justify-end">
              <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
                <SelectTrigger className="w-full sm:w-[140px] h-12 rounded-xl border-2 border-border/50 bg-white dark:bg-muted/50 font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-12-months">Last Year</SelectItem>
                </SelectContent>
              </Select>

              <Select value={petFilter} onValueChange={setPetFilter}>
                <SelectTrigger className="w-full sm:w-[140px] h-12 rounded-xl border-2 border-border/50 bg-white dark:bg-muted/50 font-medium">
                  <SelectValue placeholder="All Pets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pets</SelectItem>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {PET_TYPE_CONFIG[pet.type].emoji} {pet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[160px] h-12 rounded-xl border-2 border-border/50 bg-white dark:bg-muted/50 font-medium">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {(Object.keys(CATEGORY_CONFIG) as ExpenseCategory[]).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {categoryEmojis[cat]} {CATEGORY_CONFIG[cat].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Total Pill */}
            <div className="hidden lg:flex flex-col items-end border-l pl-6 border-gray-200 dark:border-gray-800">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total</span>
              <span className="text-xl font-black text-primary font-display">{formatAmount(totalFiltered)}</span>
            </div>
          </div>

          {/* Mobile Total (Visible only on mobile) */}
          <div className="mt-4 pt-4 border-t lg:hidden flex justify-between items-center">
            <span className="font-medium text-muted-foreground">Found {filteredExpenses.length} records</span>
            <span className="text-lg font-bold text-primary">{formatAmount(totalFiltered)}</span>
          </div>
        </motion.div>

        {/* Filters Summary & Count (Desktop) */}
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {filteredExpenses.length > 0 ? 'Recent Transactions' : 'No Transactions'}
          </h2>
          <span className="text-sm font-medium text-muted-foreground bg-white dark:bg-card px-3 py-1 rounded-full shadow-sm border">
            {filteredExpenses.length} records found
          </span>
        </div>

        {/* Expense Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  pet={pets.find((p) => p.id === expense.petId)}
                  onEdit={(e) => {
                    setEditingExpense(e);
                    setShowFormDialog(true);
                  }}
                  onDelete={(id) => setDeletingExpenseId(id)}
                />
              ))
            ) : (
              <div className="col-span-full py-12">
                <div className="bg-white dark:bg-card rounded-3xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-700 mx-auto max-w-lg">
                  <div className="size-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Filter className="size-10 text-primary/40" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No matching expenses</h3>
                  <p className="text-muted-foreground mb-8">
                    {searchQuery || timeFilter !== 'all' || petFilter !== 'all' || categoryFilter !== 'all'
                      ? "We couldn't find any transactions matching your current filters. Try resetting them."
                      : "You haven't logged any expenses yet."}
                  </p>
                  {(searchQuery || timeFilter !== 'all' || petFilter !== 'all' || categoryFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setTimeFilter('all');
                        setPetFilter('all');
                        setCategoryFilter('all');
                      }}
                      className="text-primary font-bold hover:underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FAB - Fixed with proper positioning (Mobile Only) */}


      <ExpenseFormDialog
        open={showFormDialog}
        onOpenChange={(open) => {
          setShowFormDialog(open);
          if (!open) setEditingExpense(null);
        }}
        onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
        pets={pets}
        editingExpense={editingExpense}
      />

      <AlertDialog open={!!deletingExpenseId} onOpenChange={() => setDeletingExpenseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this expense record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExpense}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
