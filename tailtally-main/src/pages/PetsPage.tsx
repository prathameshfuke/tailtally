import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, PawPrint } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { usePets, useExpenses } from '@/hooks/usePetData';
import { Pet, PET_TYPE_CONFIG } from '@/lib/types';
import { EmptyState } from '@/components/ui/empty-state';
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

const cardColors = ['primary', 'secondary', 'success', 'warning'];

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
      title: 'Pet added! 🎉',
      description: `${data.name} has been added to your pack.`,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-yellow-900/20 lg:pb-12 lg:bg-none lg:bg-background-light lg:dark:bg-background-dark">
      <div>
        <PageHeader title="My Pack 🐾" />
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-8 py-6 mb-2">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">My Pack</h1>
          <p className="text-muted-foreground text-sm">Manage your furry friends</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFormDialog(true)}
          className="bg-primary text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/25 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Pet
        </motion.button>
      </div>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 lg:pt-0 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-5 border lg:border-border border-primary/20 bg-white dark:bg-card shadow-playful lg:shadow-sm"
          >
            <p className="text-primary/60 dark:text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">Active Pets</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">{pets.length.toString().padStart(2, '0')}</span>
              {pets.length > 0 && <span className="text-success text-xs font-bold">+{pets.length} happy</span>}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl p-5 border lg:border-border border-primary/20 bg-white dark:bg-card shadow-playful lg:shadow-sm"
          >
            <p className="text-primary/60 dark:text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">Total Spent</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold gradient-text-warm">
                ${Object.values(petExpenseTotals).reduce((sum, val) => sum + val, 0).toFixed(0)}
              </span>
              <TrendingUp className="w-4 h-4 text-success" />
            </div>
          </motion.div>

          {/* Desktop-Only Additional Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block rounded-3xl p-5 border border-border bg-white dark:bg-card shadow-sm"
          >
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">Average / Pet</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-700 dark:text-gray-200">
                ${pets.length ? (Object.values(petExpenseTotals).reduce((sum, val) => sum + val, 0) / pets.length).toFixed(0) : '0'}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block rounded-3xl p-5 border border-border bg-white dark:bg-card shadow-sm"
          >
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">Total Budget</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-gray-700 dark:text-gray-200">$1,200</span>
              <span className="text-xs font-medium text-muted-foreground">/ month</span>
            </div>
          </motion.div>

        </div>

        {/* Pet Cards */}
        {pets.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <EmptyState
              icon={<PawPrint className="h-12 w-12" />}
              title="No pets yet!"
              description="Add your first pet to start tracking expenses."
              action={
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFormDialog(true)}
                  className="gradient-warm text-white px-8 py-3 rounded-full shadow-playful-lg font-bold"
                >
                  Add Your First Pet
                </motion.button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pets.map((pet, index) => {
              const total = petExpenseTotals[pet.id] || 0;
              const colorIndex = index % cardColors.length;

              return (
                <motion.div
                  key={pet.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300 -z-10" />
                  <div className="bg-white dark:bg-card rounded-3xl p-6 shadow-playful border border-transparent lg:border-border flex flex-col items-center text-center h-full">
                    <div className="relative mb-4">
                      <div className={`w-28 h-28 rounded-full border-4 border-${cardColors[colorIndex]} p-1 bg-white dark:bg-gray-900`}>
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                          {pet.photo ? (
                            <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-6xl select-none transform hover:scale-125 transition-transform cursor-default">{PET_TYPE_CONFIG[pet.type].emoji}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <h3 className="font-display text-2xl font-bold mb-1">{pet.name}</h3>
                    <p className={`text-sm font-medium text-gray-500 dark:text-gray-400 mb-6 bg-primary/10 px-3 py-1 rounded-full uppercase tracking-tight`}>
                      {PET_TYPE_CONFIG[pet.type].label}
                    </p>

                    <div className="w-full mt-auto space-y-4">
                      <div className="flex items-center justify-between bg-gray-50 dark:bg-muted/50 rounded-2xl px-4 py-3 border border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-primary">💰</span>
                          <span className="text-xs font-bold text-muted-foreground uppercase">Spent</span>
                        </div>
                        <span className="font-display font-bold gradient-text-warm">${total.toFixed(2)}</span>
                      </div>

                      <div className="flex gap-2 w-full">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => openEditDialog(pet)}
                          className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary font-bold py-2.5 px-4 rounded-xl text-sm transition-colors"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDeletingPetId(pet.id)}
                          className="bg-gray-100 hover:bg-destructive/10 dark:bg-muted hover:dark:bg-destructive/20 p-2.5 rounded-xl text-gray-400 hover:text-destructive transition-colors border border-transparent"
                        >
                          <PawPrint className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Add New Pet Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: pets.length * 0.1 }}
              onClick={() => setShowFormDialog(true)}
              className="border-3 border-dashed border-primary/20 hover:border-primary/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center min-h-[350px] bg-white/30 dark:bg-card/30 lg:bg-transparent cursor-pointer group transition-all"
            >
              <div className="mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="font-display text-xl font-bold text-gray-600 dark:text-gray-300 mb-2">Add New Pet</h3>
              <p className="text-sm text-gray-500 dark:text-muted-foreground">Track expenses for another furry friend</p>
            </motion.div>
          </div>
        )}
      </main>



      <PetFormDialog
        open={showFormDialog}
        onOpenChange={(open) => {
          setShowFormDialog(open);
          if (!open) setEditingPet(null);
        }}
        onSubmit={editingPet ? handleEditPet : handleAddPet}
        editingPet={editingPet}
      />

      <AlertDialog open={!!deletingPetId} onOpenChange={() => setDeletingPetId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this pet and all associated expenses. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePet} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

}
