import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CountdownProps {
    timeLeft: number;
}

const Countdown: React.FC<CountdownProps> = ({ timeLeft }) => {
    // Calculate time components
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    // Generate some random floating particles for the background
    const [particles] = useState([...Array(30)].map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.4 + 0.1,
    })));

    return (
        <motion.div
            className="relative w-full h-screen overflow-hidden bg-background flex flex-col items-center justify-center font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
        >
            {/* Cinematic Background Gradient & Glows */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(54,50,49,0.3)_0%,rgba(18,14,13,1)_100%)] z-0" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-dark/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow z-0" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#3a272b]/30 rounded-full blur-[150px] mix-blend-screen animate-pulse-slow z-0" style={{ animationDelay: '2s' }} />

            {/* Floating Particles (Dust/Petal abstraction) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        className="absolute rounded-full bg-brand-light"
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: p.size,
                            height: p.size,
                            opacity: p.opacity,
                            filter: 'blur(1px)'
                        }}
                        animate={{
                            y: ["0%", "-100%"],
                            x: ["0%", "5%", "-5%", "0%"],
                            rotate: [0, 180, 360]
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: p.delay
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center gap-12 text-center px-4">

                {/* Subtle, mysterious typography */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                    className="tracking-[0.3em] uppercase text-sm md:text-base text-brand/70 font-light"
                >
                    Something beautiful is coming
                </motion.div>

                {/* The Timer */}
                <div className="flex items-center gap-4 md:gap-8 justify-center">
                    <TimeBlock value={days} label="Days" delay={0.8} />
                    <Separator delay={0.9} />
                    <TimeBlock value={hours} label="Hours" delay={1.0} />
                    <Separator delay={1.1} />
                    <TimeBlock value={minutes} label="Minutes" delay={1.2} />
                    <Separator delay={1.3} />
                    <TimeBlock value={seconds} label="Seconds" delay={1.4} />
                </div>

                {/* Extra minimal ornament */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, delay: 2 }}
                    className="mt-16 w-px h-24 bg-gradient-to-b from-brand/50 to-transparent"
                />

            </div>
        </motion.div>
    );
};

// Sub-components for clean structure
const TimeBlock = ({ value, label, delay }: { value: number, label: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-4"
    >
        <div className="relative">
            <span className="text-5xl md:text-7xl lg:text-9xl font-light tracking-tight text-brand-light text-shadow-glow">
                {value.toString().padStart(2, '0')}
            </span>
        </div>
        <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-accent-gray text-brand/50">
            {label}
        </span>
    </motion.div>
);

const Separator = ({ delay }: { delay: number }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1, delay }}
        className="text-3xl md:text-5xl lg:text-7xl font-light text-brand/30 pb-8"
    >
        :
    </motion.div>
);

export default Countdown;
