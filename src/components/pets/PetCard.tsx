import { motion } from 'framer-motion';
import { Edit2, Trash2, Calendar } from 'lucide-react';
import { Pet, PET_TYPE_CONFIG } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

interface PetCardProps {
  pet: Pet;
  onEdit: (pet: Pet) => void;
  onDelete: (id: string) => void;
  totalExpenses?: number;
}

export function PetCard({ pet, onEdit, onDelete, totalExpenses = 0 }: PetCardProps) {
  const typeConfig = PET_TYPE_CONFIG[pet.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group overflow-hidden card-hover">
        <CardContent className="p-0">
          {/* Pet Avatar Section */}
          <div className="relative gradient-hero p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-4xl backdrop-blur-sm overflow-hidden border-2 border-white/30">
                <img
                  src={pet.photo || typeConfig.defaultImage}
                  alt={pet.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="text-white">
                <h3 className="text-xl font-bold">{pet.name}</h3>
                <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
                  {typeConfig.emoji} {typeConfig.label}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-white/20 text-white hover:bg-white/30"
                onClick={() => onEdit(pet)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 bg-white/20 text-white hover:bg-destructive"
                onClick={() => onDelete(pet.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Added {format(new Date(pet.dateAdded), 'MMM d, yyyy')}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <span className="text-sm text-muted-foreground">Total Expenses</span>
              <span className="text-lg font-bold text-primary">${totalExpenses.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
