import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Receipt, Search, Filter } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { usePets, useExpenses } from '@/hooks/usePetData';
import { Expense, ExpenseCategory, CATEGORY_CONFIG, PET_TYPE_CONFIG } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { ExpenseCard } from '@/components/expenses/ExpenseCard';
import { ExpenseFormDialog } from '@/components/expenses/ExpenseFormDialog';
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
      <div className="py-12">
        <EmptyState
          icon={<Receipt className="h-8 w-8" />}
          title="No pets to track"
          description="Add a pet first before logging expenses."
          action={
            <Button onClick={() => navigate('/pets')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Pet
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">Track and manage all pet expenses</p>
        </div>
        <Button onClick={() => setShowFormDialog(true)} className="shadow-glow">
          <Plus className="mr-2 h-4 w-4" />
          Log Expense
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Filters</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Time Filter */}
          <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
            <SelectTrigger className="w-[160px]">
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
            <SelectTrigger className="w-[160px]">
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
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {(Object.keys(CATEGORY_CONFIG) as ExpenseCategory[]).map((cat) => (
                <SelectItem key={cat} value={cat}>
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: CATEGORY_CONFIG[cat].color }}
                    />
                    {CATEGORY_CONFIG[cat].label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Results summary */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} found
          </span>
          <span className="font-medium text-primary">
            Total: ${totalFiltered.toFixed(2)}
          </span>
        </div>
      </div>

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
        <EmptyState
          icon={<Receipt className="h-8 w-8" />}
          title="No expenses found"
          description={searchQuery || timeFilter !== 'all' || petFilter !== 'all' || categoryFilter !== 'all' 
            ? "Try adjusting your filters to see more results." 
            : "Start by logging your first expense."}
          action={
            <Button onClick={() => setShowFormDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Log Expense
            </Button>
          }
        />
      )}

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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
