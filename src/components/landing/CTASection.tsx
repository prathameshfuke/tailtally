import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-orange-400/10 to-yellow-300/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-primary to-orange-600 rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 lg:p-16 text-white shadow-2xl overflow-hidden"
        >
          {/* Background patterns */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-300/20 rounded-full blur-2xl" />

          {/* Decorative elements */}
          <div className="absolute top-8 right-8 text-5xl sm:text-6xl opacity-50 animate-bounce-soft">
            🐾
          </div>
          <div className="absolute bottom-8 left-8 text-4xl sm:text-5xl opacity-50 animate-wiggle">
            ❤️
          </div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-6 sm:space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30"
            >
              <Sparkles className="size-4" />
              <span className="text-sm font-semibold">Start Your Journey Today</span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
            >
              Ready to Take Control of
              <br />
              Your Pet's Finances?
            </motion.h2>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto"
            >
              Join thousands of pet parents who are saving money and keeping their furry friends happy.
              No credit card required. Free forever.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Link to="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="h-14 sm:h-16 px-8 sm:px-12 rounded-full bg-white text-primary hover:bg-white/95 shadow-2xl hover:shadow-3xl transition-all text-base sm:text-lg font-bold group min-w-[200px] relative overflow-hidden"
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        translateX: ['100%', '100%', '-100%', '100%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "linear",
                      }}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      Start Tracking Now
                      <ArrowRight className="size-5 sm:size-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pt-4 text-white/80 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>No Sign-up Required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>Privacy First</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
