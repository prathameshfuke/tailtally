import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pet, ExpenseCategory, CATEGORY_CONFIG, PET_TYPE_CONFIG } from '@/lib/types';
import { useCurrency } from '@/hooks/useCurrency';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const budgetSchema = z.object({
    petId: z.string().min(1, 'Please select a pet'),
    category: z.enum(['food', 'healthcare', 'grooming', 'toys', 'training', 'other'] as const),
    amount: z.number().min(1, 'Budget must be at least 1'),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: BudgetFormData) => void;
    pets: Pet[];
    selectedPetId?: string;
    defaultCategory?: ExpenseCategory;
}

export function BudgetFormDialog({
    open,
    onOpenChange,
    onSubmit,
    pets,
    selectedPetId,
    defaultCategory
}: BudgetFormDialogProps) {
    const { symbol } = useCurrency();
    const form = useForm<BudgetFormData>({
        resolver: zodResolver(budgetSchema),
        defaultValues: {
            petId: selectedPetId || pets[0]?.id || '',
            category: defaultCategory || 'food',
            amount: 0,
        },
    });

    // Update form values when props change or dialog opens
    useEffect(() => {
        if (open) {
            form.reset({
                petId: selectedPetId || pets[0]?.id || '',
                category: defaultCategory || 'food',
                amount: 0,
            });
        }
    }, [open, selectedPetId, defaultCategory, pets, form]);

    const handleSubmit = (data: BudgetFormData) => {
        onSubmit(data);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">Set Monthly Budget</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                                                    <span className="flex items-center gap-2">
                                                        <span>{PET_TYPE_CONFIG[pet.type].emoji}</span>
                                                        <span>{pet.name}</span>
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
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(Object.keys(CATEGORY_CONFIG) as ExpenseCategory[]).map((cat) => (
                                            <Button
                                                key={cat}
                                                type="button"
                                                variant={field.value === cat ? 'default' : 'outline'}
                                                size="sm"
                                                className={cn(
                                                    'flex items-center justify-start gap-2 h-auto py-2',
                                                    field.value === cat && 'ring-2 ring-offset-1'
                                                )}
                                                style={{
                                                    backgroundColor: field.value === cat ? CATEGORY_CONFIG[cat].color : undefined,
                                                    borderColor: CATEGORY_CONFIG[cat].color,
                                                }}
                                                onClick={() => field.onChange(cat)}
                                            >
                                                <div
                                                    className="w-3 h-3 rounded-full shrink-0"
                                                    style={{ backgroundColor: field.value === cat ? 'white' : CATEGORY_CONFIG[cat].color }}
                                                />
                                                <span className={cn(field.value === cat && "text-white")}>
                                                    {CATEGORY_CONFIG[cat].label}
                                                </span>
                                            </Button>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Monthly Limit ({symbol})</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{symbol}</span>
                                            <Input
                                                type="number"
                                                min="1"
                                                step="1"
                                                placeholder="100"
                                                className="pl-7 text-lg font-bold"
                                                {...field}
                                                value={field.value || ''}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="flex-1">
                                Save Budget
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
