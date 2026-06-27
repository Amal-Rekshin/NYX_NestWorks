import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/nyx.png';

const SplashScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Total animation time: ~3.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 100); // Wait for exit animation to finish before notifying parent
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.3 }
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      filter: 'blur(10px)',
      transition: { duration: 0.8, ease: 'easeInOut' }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const lineVariants = {
    hidden: { scaleX: 0, opacity: 0 },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: { duration: 1.2, ease: 'easeInOut', delay: 0.8 }
    }
  };

  const glowVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 0.5,
      scale: [1, 1.2, 1],
      transition: {
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'reverse'
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark-bg overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Animated Background Glow */}
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-blue/20 via-dark-bg to-dark-bg z-0"
            variants={glowVariants}
          />

          <div className="relative z-10 text-center flex flex-col items-center">
            <motion.span
              variants={textVariants}
              width={200} height={200}
              className='m-10'
            >
              <img src={logo} alt="" height={250} width={250} />
            </motion.span>
            {/* Brand Logo/Text */}
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter flex items-center gap-4">
              <motion.span
                variants={textVariants}
                className="text-brand-blue drop-shadow-[0_0_20px_rgba(0,85,255,0.8)]"
              >
                Nyx
              </motion.span>
              <motion.span
                variants={textVariants}
                className="text-brand-green drop-shadow-[0_0_20px_rgba(255,183,0,0.8)]"
              >
                NestWorks
              </motion.span>
            </h1>

            {/* Decorative Line */}
            <motion.div
              variants={lineVariants}
              className="mt-8 h-1 w-3/4 rounded-full bg-gradient-to-r from-transparent via-brand-blue to-transparent shadow-[0_0_15px_rgba(0,85,255,1)]"
              style={{ originX: 0.5 }}
            />

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-6 text-gray-400 text-lg md:text-xl font-light tracking-widest uppercase"
            >
              LAUNCHING VISIONS INTO REALITY...
            </motion.p>
          </div>

          {/* subtle loading dots or pulse at bottom if desired */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-brand-green"
                animate={{
                  y: ['0%', '-50%', '0%'],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
