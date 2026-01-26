import { motion } from 'framer-motion';
import { Cake, Heart, Calendar, Award, Gift, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pet, PET_TYPE_CONFIG } from '@/lib/types';
import { differenceInDays, differenceInMonths, differenceInYears, format } from 'date-fns';

interface PetMilestonesProps {
  pet: Pet;
}

export function PetMilestones({ pet }: PetMilestonesProps) {
  const adoptionDate = new Date(pet.dateAdded);
  const now = new Date();
  
  const daysTogether = differenceInDays(now, adoptionDate);
  const monthsTogether = differenceInMonths(now, adoptionDate);
  const yearsTogether = differenceInYears(now, adoptionDate);
  
  // Calculate upcoming milestones
  const milestones = [
    { days: 7, label: '1 Week Together', emoji: '🌟', achieved: daysTogether >= 7 },
    { days: 30, label: '1 Month Together', emoji: '🎉', achieved: daysTogether >= 30 },
    { days: 100, label: '100 Days of Love', emoji: '💯', achieved: daysTogether >= 100 },
    { days: 365, label: '1 Year Anniversary', emoji: '🎂', achieved: daysTogether >= 365 },
    { days: 730, label: '2 Years Together', emoji: '🏆', achieved: daysTogether >= 730 },
  ];
  
  const nextMilestone = milestones.find(m => !m.achieved);
  const achievedMilestones = milestones.filter(m => m.achieved);

  return (
    <Card className="overflow-hidden border-2 border-primary/10">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/20 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Award className="h-5 w-5 text-primary" />
          {pet.name}'s Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Time together */}
        <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-accent/10 rounded-2xl">
          <motion.div
            className="text-4xl mb-2"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {PET_TYPE_CONFIG[pet.type].emoji}
          </motion.div>
          <p className="text-2xl font-bold text-primary">{daysTogether} days</p>
          <p className="text-sm text-muted-foreground">together with {pet.name}</p>
          <p className="text-xs text-primary/70 mt-1">
            Since {format(adoptionDate, 'MMMM d, yyyy')}
          </p>
        </div>

        {/* Next milestone */}
        {nextMilestone && (
          <motion.div
            className="p-3 bg-warning/10 rounded-xl border border-warning/20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{nextMilestone.emoji}</span>
              <div className="flex-1">
                <p className="font-medium text-foreground">{nextMilestone.label}</p>
                <p className="text-sm text-muted-foreground">
                  {nextMilestone.days - daysTogether} days to go!
                </p>
              </div>
              <Gift className="h-5 w-5 text-warning animate-bounce" />
            </div>
          </motion.div>
        )}

        {/* Achieved milestones */}
        {achievedMilestones.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Achieved 🏅
            </p>
            <div className="flex flex-wrap gap-2">
              {achievedMilestones.map((milestone, i) => (
                <motion.div
                  key={milestone.days}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-success/10 rounded-full text-sm"
                >
                  <span>{milestone.emoji}</span>
                  <span className="text-success font-medium">{milestone.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Achievement badge component
export function AchievementBadge({ 
  title, 
  emoji, 
  unlocked = false 
}: { 
  title: string; 
  emoji: string; 
  unlocked?: boolean;
}) {
  return (
    <motion.div
      className={`
        flex flex-col items-center gap-1 p-3 rounded-xl transition-all
        ${unlocked 
          ? 'bg-primary/10 border-2 border-primary/30' 
          : 'bg-muted/50 opacity-50 grayscale'
        }
      `}
      whileHover={unlocked ? { scale: 1.05 } : undefined}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-xs font-medium text-center">{title}</span>
      {unlocked && (
        <motion.span
          className="text-lg"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ✨
        </motion.span>
      )}
    </motion.div>
  );
}
