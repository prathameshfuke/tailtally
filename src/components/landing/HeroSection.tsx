import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DogBone3D } from '@/components/3d/DogBone3D';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 sm:pt-24 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-300/10 rounded-full blur-3xl animate-pulse-glow" />

        {/* Floating paw prints */}
        <div className="absolute top-1/4 right-1/4 text-4xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>
          🐾
        </div>
        <div className="absolute bottom-1/3 left-1/4 text-3xl opacity-15 animate-float" style={{ animationDelay: '1.5s' }}>
          🐾
        </div>
        <div className="absolute top-2/3 right-1/3 text-2xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>
          🐾
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Hero Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left space-y-6 sm:space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/20 mx-auto lg:mx-0 shadow-lg backdrop-blur-sm"
            >
              <Sparkles className="size-4 text-primary" />
              <span className="text-sm font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                Free to use, easy to track
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight"
            >
              Track Your
              <br />
              <span className="bg-gradient-to-r from-primary via-orange-500 to-orange-600 bg-clip-text text-transparent">
                Pet's Budget
              </span>
              <br />
              With Love 🐾
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0"
            >
              Manage expenses, set budgets, and keep your furry friends happy without breaking the bank.
              Simple, beautiful, and built for pet parents.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start"
            >
              <Link to="/dashboard">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    size="lg"
                    className="h-14 px-8 rounded-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-xl hover:shadow-2xl transition-all text-base font-bold group w-full sm:w-auto min-w-[200px]"
                  >
                    Get Started Free
                    <ArrowRight className="size-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 rounded-full border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 text-base font-semibold w-full sm:w-auto min-w-[200px] transition-all"
                  onClick={() => {
                    const featuresSection = document.getElementById('features');
                    if (featuresSection) {
                      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right: 3D Dog Bone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            {/* Decorative elements with playful animations */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-10 -left-10 text-6xl sm:text-8xl filter drop-shadow-lg"
            >
              🦴
            </motion.div>
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, -8, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -bottom-10 -right-10 text-5xl sm:text-7xl filter drop-shadow-lg"
            >
              🐕
            </motion.div>

            {/* Additional cute elements */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-1/4 -right-8 text-4xl opacity-80"
            >
              💕
            </motion.div>
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-1/4 -left-8 text-3xl opacity-70"
            >
              ⭐
            </motion.div>

            {/* 3D Canvas with enhanced styling - SQUARE container for perfect centering */}
            <div className="relative z-10 w-full aspect-square max-w-[500px] mx-auto rounded-3xl bg-gradient-to-br from-primary/5 via-orange-400/5 to-yellow-300/5 border-2 border-primary/10 shadow-2xl overflow-hidden backdrop-blur-sm flex items-center justify-center">
              <DogBone3D className="w-full h-full absolute inset-0" />

              {/* Interaction hint with improved styling */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-xl border border-white/10"
              >
                <span className="inline-flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  >
                    👆
                  </motion.span>
                  Drag to rotate
                </span>
              </motion.div>

              {/* Sparkle effects */}
              <motion.div
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute top-8 right-8 text-2xl"
              >
                ✨
              </motion.div>
              <motion.div
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  delay: 0.5,
                }}
                className="absolute bottom-16 left-8 text-2xl"
              >
                ✨
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
