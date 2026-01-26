import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Plus, 
  Syringe, 
  Pill, 
  Stethoscope, 
  Calendar,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Pet, PET_TYPE_CONFIG } from '@/lib/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { format, differenceInDays, addDays, isPast } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

export interface HealthReminder {
  id: string;
  petId: string;
  type: 'vaccination' | 'medication' | 'checkup' | 'grooming';
  title: string;
  dueDate: string;
  completed: boolean;
  notes?: string;
}

const REMINDER_TYPES = {
  vaccination: { label: 'Vaccination', icon: Syringe, emoji: '💉' },
  medication: { label: 'Medication', icon: Pill, emoji: '💊' },
  checkup: { label: 'Vet Checkup', icon: Stethoscope, emoji: '🏥' },
  grooming: { label: 'Grooming', icon: Calendar, emoji: '✂️' },
};

interface HealthRemindersProps {
  pets: Pet[];
}

export function HealthReminders({ pets }: HealthRemindersProps) {
  const [reminders, setReminders] = useLocalStorage<HealthReminder[]>('pet-health-reminders', []);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { toast } = useToast();

  const upcomingReminders = reminders
    .filter(r => !r.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const addReminder = (reminder: Omit<HealthReminder, 'id' | 'completed'>) => {
    setReminders(prev => [...prev, { ...reminder, id: uuidv4(), completed: false }]);
    setShowAddDialog(false);
    toast({
      title: 'Reminder added! 🔔',
      description: `${reminder.title} scheduled for ${format(new Date(reminder.dueDate), 'MMM d, yyyy')}`,
    });
  };

  const completeReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, completed: true } : r));
    toast({
      title: 'Done! 🎉',
      description: 'Great job taking care of your pet!',
    });
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-info/10 to-card pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5 text-info" />
          Health Reminders
        </CardTitle>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="gap-1">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-info" />
                Add Health Reminder
              </DialogTitle>
            </DialogHeader>
            <AddReminderForm pets={pets} onSubmit={addReminder} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-4">
        {upcomingReminders.length === 0 ? (
          <div className="text-center py-6">
            <motion.div
              className="text-4xl mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🩺
            </motion.div>
            <p className="text-muted-foreground text-sm">
              No upcoming health reminders
            </p>
            <p className="text-xs text-primary mt-1">
              Add vaccinations, vet visits & more!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {upcomingReminders.slice(0, 5).map((reminder, index) => {
                const pet = pets.find(p => p.id === reminder.petId);
                const daysUntil = differenceInDays(new Date(reminder.dueDate), new Date());
                const isOverdue = isPast(new Date(reminder.dueDate));
                const typeConfig = REMINDER_TYPES[reminder.type];
                
                return (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl border
                      ${isOverdue 
                        ? 'bg-destructive/5 border-destructive/20' 
                        : daysUntil <= 3 
                          ? 'bg-warning/5 border-warning/20'
                          : 'bg-card border-border'
                      }
                    `}
                  >
                    <div className="text-2xl">{typeConfig.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{reminder.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        {pet && <span>{PET_TYPE_CONFIG[pet.type].emoji}</span>}
                        <span>{pet?.name}</span>
                        <span>•</span>
                        <span className={isOverdue ? 'text-destructive' : daysUntil <= 3 ? 'text-warning' : ''}>
                          {isOverdue ? 'Overdue!' : daysUntil === 0 ? 'Today!' : `${daysUntil} days`}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-success hover:text-success hover:bg-success/10"
                        onClick={() => completeReminder(reminder.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => deleteReminder(reminder.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AddReminderForm({ 
  pets, 
  onSubmit 
}: { 
  pets: Pet[]; 
  onSubmit: (reminder: Omit<HealthReminder, 'id' | 'completed'>) => void;
}) {
  const [petId, setPetId] = useState(pets[0]?.id || '');
  const [type, setType] = useState<HealthReminder['type']>('vaccination');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId || !title || !dueDate) return;
    onSubmit({ petId, type, title, dueDate });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Pet</Label>
        <Select value={petId} onValueChange={setPetId}>
          <SelectTrigger>
            <SelectValue placeholder="Select pet" />
          </SelectTrigger>
          <SelectContent>
            {pets.map(pet => (
              <SelectItem key={pet.id} value={pet.id}>
                {PET_TYPE_CONFIG[pet.type].emoji} {pet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <Select value={type} onValueChange={(v) => setType(v as HealthReminder['type'])}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(REMINDER_TYPES).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.emoji} {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          placeholder="e.g., Annual rabies vaccination"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Due Date</Label>
        <Input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <Button type="submit" className="w-full">
        <Bell className="mr-2 h-4 w-4" />
        Add Reminder
      </Button>
    </form>
  );
}
