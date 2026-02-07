import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Heart, PieChart, Bell, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { BorderBeam } from '@/components/ui/border-beam';

const features = [
  {
    icon: Wallet,
    title: 'Smart Budget Tracking',
    description: 'Set monthly budgets for each pet and track spending across categories like food, healthcare, and toys.',
    color: 'from-primary to-orange-500',
    beamColor: '#FF6B35',
  },
  {
    icon: TrendingUp,
    title: 'Expense Analytics',
    description: 'Visualize spending patterns with beautiful charts and insights to make informed decisions.',
    color: 'from-orange-500 to-yellow-500',
    beamColor: '#FBBF24',
  },
  {
    icon: Heart,
    title: 'Multi-Pet Support',
    description: 'Manage budgets for all your furry friends in one place. Perfect for families with multiple pets.',
    color: 'from-pink-500 to-rose-500',
    beamColor: '#F472B6',
  },
  {
    icon: PieChart,
    title: 'Category Breakdown',
    description: 'Detailed breakdown of expenses by category to understand where your money goes.',
    color: 'from-blue-500 to-cyan-500',
    beamColor: '#38BDF8',
  },
  {
    icon: Bell,
    title: 'Budget Alerts',
    description: 'Get notified when you\'re approaching or exceeding your budget limits.',
    color: 'from-purple-500 to-indigo-500',
    beamColor: '#A78BFA',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data stays on your device. No sign-up required, completely free to use.',
    color: 'from-green-500 to-emerald-500',
    beamColor: '#34D399',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-secondary/5 scroll-mt-24">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-20 space-y-4"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Manage Pet Expenses
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make pet budgeting simple, fun, and stress-free.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full border-2 hover:border-primary/50 transition-all hover:shadow-2xl group bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 overflow-hidden relative">
                {/* Border Beam Effect */}
                <BorderBeam
                  lightColor={feature.beamColor}
                  lightWidth={250}
                  duration={6 + index}
                  borderWidth={2}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                {/* Decorative gradient blob */}
                <div className={`absolute -top-20 -right-20 size-40 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 rounded-full blur-3xl transition-opacity duration-500`} />

                <CardContent className="p-6 sm:p-8 space-y-4 relative z-10">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className={`inline-flex size-14 sm:size-16 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 shadow-lg group-hover:shadow-2xl transition-shadow group-hover:animate-pulse-glow`}
                  >
                    <div className="size-full rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center">
                      <feature.icon className="size-7 sm:size-8 text-foreground" strokeWidth={2} />
                    </div>
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Playful hover indicator - REMOVED as requested to avoid confusion */}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
