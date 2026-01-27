import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, BarChart3, PawPrint, Heart } from 'lucide-react';
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

  const cardColors = ['purple', 'blue', 'pink', 'orange', 'green', 'yellow'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-pink-900/20 text-gray-900 dark:text-white pb-24">
      {/* Top Navigation Bar */}
      <PageHeader title="My Pack 🐾" />

      <main className="relative z-10 p-4 space-y-6">
        {/* Summary Stats Section */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-w-[140px] flex-col gap-1 rounded-xl p-4 border-2 border-orange-500/20 bg-white/50 dark:bg-white/5"
          >
            <p className="text-gray-600 text-xs font-bold uppercase tracking-wider">Active Pets</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-fredoka font-bold text-orange-600">{pets.length.toString().padStart(2, '0')}</span>
              {pets.length > 0 && <span className="text-green-600 text-xs font-bold">+{pets.length} happy</span>}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex min-w-[140px] flex-col gap-1 rounded-xl p-4 border-2 border-orange-500/20 bg-white/50 dark:bg-white/5"
          >
            <p className="text-gray-600 text-xs font-bold uppercase tracking-wider">Total Spent</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-fredoka font-bold text-orange-600">
                ${Object.values(petExpenseTotals).reduce((sum, val) => sum + val, 0).toFixed(0)}
              </span>
              <TrendingUp className="w-4 h-4 text-orange-600" />
            </div>
          </motion.div>
        </div>

        {/* Character Cards Grid */}
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
                  className="bg-gradient-to-tr from-orange-500 to-pink-500 text-white px-8 py-3 rounded-full shadow-playful-lg font-bold"
                >
                  Add Your First Pet
                </motion.button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 pb-12">
            {pets.map((pet, index) => {
              const color = cardColors[index % cardColors.length];
              const total = petExpenseTotals[pet.id] || 0;
              const borderColorClass = {
                purple: 'border-purple-500',
                blue: 'border-blue-400',
                pink: 'border-pink-400',
                orange: 'border-orange-500',
                green: 'border-green-500',
                yellow: 'border-yellow-400',
              }[color];

              const bgColorClass = {
                purple: 'bg-purple-100',
                blue: 'bg-blue-100',
                pink: 'bg-pink-100',
                orange: 'bg-orange-100',
                green: 'bg-green-100',
                yellow: 'bg-yellow-100',
              }[color];

              const textColorClass = {
                purple: 'text-purple-600',
                blue: 'text-blue-600',
                pink: 'text-pink-600',
                orange: 'text-orange-600',
                green: 'text-green-600',
                yellow: 'text-yellow-600',
              }[color];

              return (
                <motion.div
                  key={pet.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="character-card rounded-[2rem] p-5 shadow-playful-lg flex flex-col items-center text-center"
                >
                  <div className="relative mb-4">
                    <div className={`w-32 h-32 rounded-full border-4 ${borderColorClass} p-1 bg-white`}>
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-100 to-pink-100 flex items-center justify-center overflow-hidden">
                        <span className="text-6xl">{PET_TYPE_CONFIG[pet.type].emoji}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-fredoka text-2xl font-bold text-gray-800 dark:text-white mb-1">{pet.name}</h3>
                  <p className={`text-sm font-medium text-gray-500 mb-4 ${bgColorClass} px-3 py-1 rounded-full uppercase tracking-tighter italic`}>
                    {PET_TYPE_CONFIG[pet.type].label}
                  </p>

                  <div className="w-full space-y-2 mb-4">
                    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-full px-4 py-2 border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className={`${textColorClass}`}>💰</span>
                        <span className="text-xs font-bold text-gray-500 uppercase">Total Spent</span>
                      </div>
                      <span className="font-fredoka font-bold gradient-text">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 w-full">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openEditDialog(pet)}
                      className={`flex-1 ${bgColorClass} ${textColorClass} font-fredoka font-bold py-2 px-4 rounded-full shadow-lg active:scale-95 transition-transform`}
                    >
                      Edit Pet
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeletingPetId(pet.id)}
                      className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full text-gray-400 border border-gray-200 dark:border-gray-700"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </motion.button>
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
              className="border-4 border-dashed border-orange-500/30 rounded-[2rem] p-5 flex flex-col items-center justify-center text-center min-h-[300px] bg-white/50 backdrop-blur-sm group hover:border-orange-500 transition-colors cursor-pointer"
            >
              <div className="mb-4">
                <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PawPrint className="w-12 h-12 text-orange-600" />
                </div>
              </div>
              <h3 className="font-fredoka text-xl font-bold text-gray-600 mb-2">Space for one more?</h3>
              <p className="text-sm text-gray-500 mb-6">Tap the plus to add a new character to your pack!</p>
              <div className="w-14 h-14 bg-gradient-to-tr from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-playful hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 font-bold" />
              </div>
            </motion.div>
          </div>
        )}

        {/* Footer Decoration */}
        <div className="py-10 text-center opacity-40">
          <div className="flex justify-center gap-4 text-orange-600">
            <PawPrint className="w-5 h-5" />
            <Heart className="w-5 h-5" />
            <PawPrint className="w-5 h-5" />
          </div>
          <p className="font-fredoka text-sm mt-2">Level 12 Pet Master</p>
        </div>
      </main>

      {/* Dialogs */}
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
