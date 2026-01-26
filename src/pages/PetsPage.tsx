import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, PawPrint, Calendar } from 'lucide-react';
import { usePets, useExpenses } from '@/hooks/usePetData';
import { Pet, PET_TYPE_CONFIG } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { PetCard } from '@/components/pets/PetCard';
import { PetFormDialog } from '@/components/pets/PetFormDialog';
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
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function PetsPage() {
  const { pets, addPet, updatePet, deletePet } = usePets();
  const { expenses } = useExpenses();
  const { toast } = useToast();
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);

  const petExpenseTotals = useMemo(() => {
    return pets.reduce((acc, pet) => {
      acc[pet.id] = expenses
        .filter((e) => e.petId === pet.id)
        .reduce((sum, e) => sum + e.amount, 0);
      return acc;
    }, {} as Record<string, number>);
  }, [pets, expenses]);

  const handleAddPet = (data: { name: string; type: Pet['type']; photo?: string }) => {
    addPet(data);
    toast({
      title: 'Pet added!',
      description: `${data.name} has been added to your pets.`,
    });
  };

  const handleEditPet = (data: { name: string; type: Pet['type']; photo?: string }) => {
    if (editingPet) {
      updatePet(editingPet.id, data);
      toast({
        title: 'Pet updated!',
        description: `${data.name}'s profile has been updated.`,
      });
      setEditingPet(null);
    }
  };

  const handleDeletePet = () => {
    if (deletingPetId) {
      const pet = pets.find((p) => p.id === deletingPetId);
      deletePet(deletingPetId);
      toast({
        title: 'Pet removed',
        description: `${pet?.name} has been removed.`,
        variant: 'destructive',
      });
      setDeletingPetId(null);
    }
  };

  const openEditDialog = (pet: Pet) => {
    setEditingPet(pet);
    setShowFormDialog(true);
  };

  const speciesCount = useMemo(() => {
    const counts: Record<string, number> = {};
    pets.forEach(pet => {
      counts[pet.type] = (counts[pet.type] || 0) + 1;
    });
    return Object.keys(counts).length;
  }, [pets]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30 dark:from-background-dark dark:via-background-dark dark:to-purple-900/10 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-display">My Pets</h1>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFormDialog(true)}
            className="w-12 h-12 rounded-2xl gradient-purple text-white shadow-lg shadow-purple-500/30 flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Stats Pills */}
        {pets.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex-shrink-0 px-6 py-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
              <p className="text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wide font-semibold">Total Pets</p>
              <p className="text-2xl font-bold text-display text-primary">{pets.length}</p>
            </div>
            <div className="flex-shrink-0 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
              <p className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide font-semibold">Species</p>
              <p className="text-2xl font-bold text-display text-blue-600">{speciesCount}</p>
            </div>
          </div>
        )}
      </header>

      <div className="p-4">
        {/* Pet Grid */}
        {pets.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {pets.map((pet, index) => {
                const config = PET_TYPE_CONFIG[pet.type];
                const totalExpenses = petExpenseTotals[pet.id] || 0;

                return (
                  <motion.div
                    key={pet.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: 0.05 * index }}
                    layout
                  >
                    <motion.div
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg"
                    >
                      {/* Pet Image */}
                      <div className="relative h-48 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20">
                        <img
                          src={pet.photo || config.defaultImage}
                          alt={pet.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <span 
                            className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide text-white shadow-lg"
                            style={{
                              backgroundColor: pet.type === 'dog' ? '#3b82f6' : 
                                              pet.type === 'cat' ? '#fb923c' : 
                                              pet.type === 'rabbit' ? '#10b981' : 
                                              '#8b5cf6'
                            }}
                          >
                            {config.label}
                          </span>
                        </div>
                      </div>

                      {/* Pet Info */}
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-display">{pet.name}</h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <Calendar className="w-3 h-3" />
                              <span>Added {format(new Date(pet.dateAdded), 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Expense Stats */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 mb-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold mb-1">
                            Total Expenses
                          </p>
                          <p className="text-2xl font-bold text-display">
                            ${totalExpenses.toFixed(2)}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openEditDialog(pet)}
                            className="flex-1 px-4 py-2 bg-primary/10 text-primary rounded-2xl text-sm font-bold hover:bg-primary/20 transition-colors"
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDeletingPetId(pet.id)}
                            className="flex-1 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          >
                            Remove
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Add New Pet Card */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFormDialog(true)}
              className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all min-h-[300px] flex flex-col items-center justify-center gap-3 text-gray-500 dark:text-gray-400 hover:text-primary"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-bold text-display text-lg">Add New Pet</p>
                <p className="text-sm">Tap to create profile</p>
              </div>
            </motion.button>
          </div>
        ) : (
          <div className="min-h-[60vh] flex items-center justify-center">
            <EmptyState
              icon={<PawPrint className="h-12 w-12" />}
              title="No pets yet"
              description="Add your first pet to start tracking their expenses."
              action={
                <Button onClick={() => setShowFormDialog(true)} className="shadow-glow">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Pet
                </Button>
              }
            />
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <PetFormDialog
        open={showFormDialog}
        onOpenChange={(open) => {
          setShowFormDialog(open);
          if (!open) setEditingPet(null);
        }}
        onSubmit={editingPet ? handleEditPet : handleAddPet}
        editingPet={editingPet}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingPetId} onOpenChange={() => setDeletingPetId(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-display">Delete Pet?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this pet and all associated expense records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-2xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePet}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-2xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
