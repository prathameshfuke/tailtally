import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RefreshCw, Check, Clock, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { usePets, useRecurringExpenses } from '@/hooks/usePetData';
import { RecurringExpense, ExpenseCategory, CATEGORY_CONFIG, PET_TYPE_CONFIG } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { cn } from '@/lib/utils';

const recurringSchema = z.object({
  petId: z.string().min(1, 'Please select a pet'),
  category: z.enum(['food', 'healthcare', 'grooming', 'toys', 'training', 'other'] as const),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
});

type RecurringFormData = z.infer<typeof recurringSchema>;

export default function RecurringPage() {
  const navigate = useNavigate();
  const { pets } = usePets();
  const { recurring, addRecurring, updateRecurring, deleteRecurring, markAsPaid } = useRecurringExpenses();
  const { toast } = useToast();
  
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringExpense | null>(null);
  const [deletingRecurringId, setDeletingRecurringId] = useState<string | null>(null);

  const form = useForm<RecurringFormData>({
    resolver: zodResolver(recurringSchema),
    defaultValues: {
      petId: pets[0]?.id || '',
      category: 'healthcare',
      amount: 0,
      description: '',
    },
  });

  const handleSubmit = (data: RecurringFormData) => {
    if (editingRecurring) {
      updateRecurring(editingRecurring.id, {
        petId: data.petId,
        category: data.category,
        amount: data.amount,
        description: data.description,
      });
      toast({
        title: 'Recurring expense updated!',
        description: 'The recurring expense has been updated.',
      });
    } else {
      addRecurring({
        petId: data.petId,
        category: data.category,
        amount: data.amount,
        description: data.description,
        startDate: new Date().toISOString(),
      });
      toast({
        title: 'Recurring expense added!',
        description: `$${data.amount.toFixed(2)} monthly expense has been set up.`,
      });
    }
    form.reset();
    setShowFormDialog(false);
    setEditingRecurring(null);
  };

  const handleEdit = (item: RecurringExpense) => {
    setEditingRecurring(item);
    form.reset({
      petId: item.petId,
      category: item.category,
      amount: item.amount,
      description: item.description,
    });
    setShowFormDialog(true);
  };

  const handleDelete = () => {
    if (deletingRecurringId) {
      deleteRecurring(deletingRecurringId);
      toast({
        title: 'Recurring expense deleted',
        description: 'The recurring expense has been removed.',
        variant: 'destructive',
      });
      setDeletingRecurringId(null);
    }
  };

  const handleTogglePaid = (item: RecurringExpense) => {
    if (item.paidThisMonth) {
      updateRecurring(item.id, { paidThisMonth: false });
    } else {
      markAsPaid(item.id);
      toast({
        title: 'Marked as paid!',
        description: `${item.description} has been marked as paid for this month.`,
      });
    }
  };

  const totalMonthly = recurring.reduce((sum, r) => sum + r.amount, 0);
  const paidThisMonth = recurring.filter((r) => r.paidThisMonth).length;

  if (pets.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon={<RefreshCw className="h-8 w-8" />}
          title="No pets to track"
          description="Add a pet first before setting up recurring expenses."
          action={
            <Button onClick={() => navigate('/pets')}>
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
          <h1 className="text-3xl font-bold tracking-tight">Recurring Expenses</h1>
          <p className="text-muted-foreground">Manage monthly subscriptions and regular costs</p>
        </div>
        <Button onClick={() => setShowFormDialog(true)} className="shadow-glow">
          <Plus className="mr-2 h-4 w-4" />
          Add Recurring
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="gradient-primary text-white">
          <CardContent className="p-4">
            <p className="text-sm opacity-80">Total Monthly</p>
            <p className="text-3xl font-bold">${totalMonthly.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card className="gradient-secondary text-white">
          <CardContent className="p-4">
            <p className="text-sm opacity-80">Annual Projection</p>
            <p className="text-3xl font-bold">${(totalMonthly * 12).toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card className="gradient-accent text-white">
          <CardContent className="p-4">
            <p className="text-sm opacity-80">Paid This Month</p>
            <p className="text-3xl font-bold">{paidThisMonth} / {recurring.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recurring List */}
      {recurring.length > 0 ? (
        <div className="space-y-3">
          <AnimatePresence>
            {recurring.map((item) => {
              const pet = pets.find((p) => p.id === item.petId);
              const config = CATEGORY_CONFIG[item.category];
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card
                    className={cn(
                      'border-l-4 transition-all',
                      item.paidThisMonth ? 'bg-muted/30' : ''
                    )}
                    style={{ borderLeftColor: config.color }}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        {/* Pet Avatar */}
                        {pet && (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-2xl">
                            {PET_TYPE_CONFIG[pet.type].emoji}
                          </div>
                        )}
                        
                        {/* Details */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{item.description}</h3>
                            {item.paidThisMonth && (
                              <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                                <Check className="h-3 w-3" />
                                Paid
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: config.color }}
                            />
                            <span>{config.label}</span>
                            {pet && (
                              <>
                                <span>•</span>
                                <span>{pet.name}</span>
                              </>
                            )}
                          </div>
                          {item.lastPaidDate && (
                            <p className="text-xs text-muted-foreground">
                              Last paid: {format(new Date(item.lastPaidDate), 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Amount */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">
                            ${item.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">per month</p>
                        </div>
                        
                        {/* Paid Toggle */}
                        <div className="flex flex-col items-center gap-1">
                          <Switch
                            checked={item.paidThisMonth}
                            onCheckedChange={() => handleTogglePaid(item)}
                          />
                          <span className="text-xs text-muted-foreground">
                            {item.paidThisMonth ? (
                              <Check className="h-3 w-3 text-success" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                          </span>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => setDeletingRecurringId(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <EmptyState
          icon={<RefreshCw className="h-8 w-8" />}
          title="No recurring expenses"
          description="Set up recurring expenses like pet insurance, monthly medication, or food subscriptions."
          action={
            <Button onClick={() => setShowFormDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Recurring Expense
            </Button>
          }
        />
      )}

      {/* Form Dialog */}
      <Dialog
        open={showFormDialog}
        onOpenChange={(open) => {
          setShowFormDialog(open);
          if (!open) {
            setEditingRecurring(null);
            form.reset();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRecurring ? 'Edit Recurring Expense' : 'Add Recurring Expense'}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="petId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a pet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pets.map((pet) => (
                          <SelectItem key={pet.id} value={pet.id}>
                            {PET_TYPE_CONFIG[pet.type].emoji} {pet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Pet Insurance, Monthly Medication" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Amount ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowFormDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {editingRecurring ? 'Save Changes' : 'Add Recurring'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingRecurringId} onOpenChange={() => setDeletingRecurringId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Recurring Expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this recurring expense. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
