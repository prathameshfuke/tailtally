import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Receipt, Search, Filter } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { usePets, useExpenses } from '@/hooks/usePetData';
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
        // Search filter
        if (searchQuery) {
          const pet = pets.find((p) => p.id === expense.petId);
          const searchLower = searchQuery.toLowerCase();
          const matchesNotes = expense.notes?.toLowerCase().includes(searchLower);
          const matchesPet = pet?.name.toLowerCase().includes(searchLower);
          const matchesCategory = CATEGORY_CONFIG[expense.category].label.toLowerCase().includes(searchLower);
          if (!matchesNotes && !matchesPet && !matchesCategory) return false;
        }
        
        // Time filter
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
        
        // Pet filter
        if (petFilter !== 'all' && expense.petId !== petFilter) return false;
        
        // Category filter
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
      description: `$${data.amount.toFixed(2)} expense has been recorded.`,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 pb-24 px-6">
        <EmptyState
          icon={<Receipt className="h-8 w-8" />}
          title="No pets to track"
          description="Add a pet first before logging expenses."
          action={
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/pets')}
              className="bg-gradient-to-tr from-purple-600 to-pink-500 text-white px-8 py-3 rounded-full shadow-playful-lg font-bold"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 pb-24">
      <PageHeader title="Expense History 📝" />

      <div className="px-4 pt-6 space-y-6">
        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-playful"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-purple-600" />
            <span className="font-bold text-gray-900 dark:text-white">Filters</span>
          </div>
          
          <div className="space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-purple-100 dark:border-purple-900 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:border-purple-500"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {/* Time Filter */}
              <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
                <SelectTrigger className="rounded-xl border-2 border-purple-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="last-12-months">Last 12 Months</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Pet Filter */}
              <Select value={petFilter} onValueChange={setPetFilter}>
                <SelectTrigger className="rounded-xl border-2 border-purple-100">
                  <SelectValue />
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
              
              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="rounded-xl border-2 border-purple-100">
                  <SelectValue />
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
            
            {/* Results summary */}
            <div className="flex items-center justify-between pt-2 border-t border-purple-100 dark:border-purple-900">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} found
              </span>
              <span className="text-sm font-bold text-purple-600">
                Total: ${totalFiltered.toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Expense List */}
        {filteredExpenses.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredExpenses.map((expense) => (
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
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-6">
              {searchQuery || timeFilter !== 'all' || petFilter !== 'all' || categoryFilter !== 'all' 
                ? "Try adjusting your filters to see more results." 
                : "Start by logging your first expense."}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFormDialog(true)}
              className="bg-gradient-to-tr from-purple-600 to-pink-500 text-white px-8 py-3 rounded-full shadow-playful font-bold"
            >
              <Plus className="inline mr-2 h-4 w-4" />
              Log Expense
            </motion.button>
          </div>
        )}

        {/* Add Expense Button */}
        <div className="mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFormDialog(true)}
            className="w-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full shadow-playful flex items-center justify-center gap-3 font-bold"
          >
            <Plus className="w-5 h-5" />
            Add New Expense
          </motion.button>
        </div>
      </div>

      {/* Form Dialog */}
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

      {/* Delete Confirmation */}
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
