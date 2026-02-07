import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Save, Download, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { usePets } from '@/hooks/usePetData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ExpenseCategory, CATEGORY_CONFIG, PET_TYPE_CONFIG, AnnualEstimate } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function EstimatorPage() {
  const navigate = useNavigate();
  const { pets } = usePets();
  const { toast } = useToast();
  
  const [savedEstimates, setSavedEstimates] = useLocalStorage<AnnualEstimate[]>('pet-expenses-estimates', []);
  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || '');
  const [estimateName, setEstimateName] = useState('');
  
  // Monthly expenses state
  const [monthlyExpenses, setMonthlyExpenses] = useState<Record<ExpenseCategory, number>>({
    food: 0,
    healthcare: 0,
    grooming: 0,
    toys: 0,
    training: 0,
    other: 0,
  });
  
  // One-time expenses state
  const [oneTimeExpenses, setOneTimeExpenses] = useState<Record<string, number>>({
    adoption: 0,
    vaccinations: 0,
    neutering: 0,
    supplies: 0,
  });

  const selectedPet = pets.find((p) => p.id === selectedPetId);

  // Calculate totals
  const calculations = useMemo(() => {
    const monthlyTotal = Object.values(monthlyExpenses).reduce((sum, val) => sum + val, 0);
    const annualFromMonthly = monthlyTotal * 12;
    const oneTimeTotal = Object.values(oneTimeExpenses).reduce((sum, val) => sum + val, 0);
    const totalAnnual = annualFromMonthly + oneTimeTotal;
    
    return {
      monthlyTotal,
      annualFromMonthly,
      oneTimeTotal,
      totalAnnual,
    };
  }, [monthlyExpenses, oneTimeExpenses]);

  // Chart data
  const pieData = useMemo(() => {
    const data: { name: string; value: number; color: string }[] = [];
    
    Object.entries(monthlyExpenses).forEach(([category, amount]) => {
      if (amount > 0) {
        const annual = amount * 12;
        data.push({
          name: CATEGORY_CONFIG[category as ExpenseCategory].label,
          value: annual,
          color: CATEGORY_CONFIG[category as ExpenseCategory].color,
        });
      }
    });
    
    const oneTimeTotal = Object.values(oneTimeExpenses).reduce((sum, val) => sum + val, 0);
    if (oneTimeTotal > 0) {
      data.push({
        name: 'One-Time Costs',
        value: oneTimeTotal,
        color: '#6B7280',
      });
    }
    
    return data;
  }, [monthlyExpenses, oneTimeExpenses]);

  const barData = useMemo(() => {
    return Object.entries(monthlyExpenses)
      .filter(([_, amount]) => amount > 0)
      .map(([category, amount]) => ({
        category: CATEGORY_CONFIG[category as ExpenseCategory].label,
        monthly: amount,
        annual: amount * 12,
        fill: CATEGORY_CONFIG[category as ExpenseCategory].color,
      }));
  }, [monthlyExpenses]);

  const handleSaveEstimate = () => {
    if (!estimateName.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for this estimate.',
        variant: 'destructive',
      });
      return;
    }
    
    const newEstimate: AnnualEstimate = {
      id: uuidv4(),
      petId: selectedPetId,
      name: estimateName,
      monthlyExpenses,
      oneTimeExpenses,
      createdAt: new Date().toISOString(),
    };
    
    setSavedEstimates((prev) => [...prev, newEstimate]);
    setEstimateName('');
    toast({
      title: 'Estimate saved!',
      description: `"${estimateName}" has been saved for future reference.`,
    });
  };

  const handleLoadEstimate = (estimate: AnnualEstimate) => {
    setMonthlyExpenses(estimate.monthlyExpenses);
    setOneTimeExpenses(estimate.oneTimeExpenses);
    setSelectedPetId(estimate.petId);
    toast({
      title: 'Estimate loaded!',
      description: `"${estimate.name}" has been loaded.`,
    });
  };

  const handleDeleteEstimate = (id: string) => {
    setSavedEstimates((prev) => prev.filter((e) => e.id !== id));
    toast({
      title: 'Estimate deleted',
      description: 'The estimate has been removed.',
    });
  };

  const handleReset = () => {
    setMonthlyExpenses({
      food: 0,
      healthcare: 0,
      grooming: 0,
      toys: 0,
      training: 0,
      other: 0,
    });
    setOneTimeExpenses({
      adoption: 0,
      vaccinations: 0,
      neutering: 0,
      supplies: 0,
    });
  };

  if (pets.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon={<Calculator className="h-8 w-8" />}
          title="No pets to estimate for"
          description="Add a pet first to calculate annual costs."
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
          <h1 className="text-3xl font-bold tracking-tight">Annual Cost Estimator</h1>
          <p className="text-muted-foreground">Calculate and plan yearly pet expenses</p>
        </div>
        
        <Select value={selectedPetId} onValueChange={setSelectedPetId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pets.map((pet) => (
              <SelectItem key={pet.id} value={pet.id}>
                {PET_TYPE_CONFIG[pet.type].emoji} {pet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Monthly Expenses */}
          <Card>
            <CardHeader className="gradient-primary text-white rounded-t-lg">
              <CardTitle>Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {(Object.keys(CATEGORY_CONFIG) as ExpenseCategory[]).map((category) => {
                  const config = CATEGORY_CONFIG[category];
                  return (
                    <div key={category} className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: config.color }}
                        />
                        {config.label}
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input
                          type="number"
                          value={monthlyExpenses[category] || ''}
                          onChange={(e) =>
                            setMonthlyExpenses((prev) => ({
                              ...prev,
                              [category]: parseFloat(e.target.value) || 0,
                            }))
                          }
                          className="pl-7"
                          placeholder="0.00"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Annual: ${(monthlyExpenses[category] * 12).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* One-Time Expenses */}
          <Card>
            <CardHeader className="gradient-accent text-white rounded-t-lg">
              <CardTitle>One-Time Expenses</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(oneTimeExpenses).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        value={value || ''}
                        onChange={(e) =>
                          setOneTimeExpenses((prev) => ({
                            ...prev,
                            [key]: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="pl-7"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Save Estimate */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-3">
                <Input
                  placeholder="Name this estimate..."
                  value={estimateName}
                  onChange={(e) => setEstimateName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSaveEstimate}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Total Annual Cost */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <Card className="gradient-hero text-white overflow-hidden">
              <CardContent className="p-6 text-center">
                <p className="text-white/80 mb-2">Total Annual Cost</p>
                <p className="text-5xl font-bold mb-4">
                  ${calculations.totalAnnual.toFixed(2)}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg bg-white/10 p-3">
                    <p className="text-white/70">Monthly Total</p>
                    <p className="text-xl font-bold">${calculations.monthlyTotal.toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg bg-white/10 p-3">
                    <p className="text-white/70">One-Time</p>
                    <p className="text-xl font-bold">${calculations.oneTimeTotal.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pie Chart */}
          {pieData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-sm">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Saved Estimates */}
          {savedEstimates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Saved Estimates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {savedEstimates.map((estimate) => {
                  const pet = pets.find((p) => p.id === estimate.petId);
                  const total = 
                    Object.values(estimate.monthlyExpenses).reduce((s, v) => s + v, 0) * 12 +
                    Object.values(estimate.oneTimeExpenses).reduce((s, v) => s + v, 0);
                  
                  return (
                    <div
                      key={estimate.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="font-medium">{estimate.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {pet?.name} • ${total.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => handleLoadEstimate(estimate)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => handleDeleteEstimate(estimate.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
