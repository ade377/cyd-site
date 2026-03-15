import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface RevealSequenceProps {
    onComplete: () => void;
}

const RevealSequence: React.FC<RevealSequenceProps> = ({ onComplete }) => {
    const [phase, setPhase] = useState<'IGNITION' | 'LAUNCH' | 'EXPLOSION' | 'TRANSITION'>('IGNITION');
    const [particles, setParticles] = useState<any[]>([]);
    const [flashComplete, setFlashComplete] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const canvas = document.getElementById('firework-canvas') as HTMLCanvasElement;
            if (canvas) {
                const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap at 2 for mobile performance
                canvas.width = window.innerWidth * dpr;
                canvas.height = window.innerHeight * dpr;
                const ctx = canvas.getContext('2d');
                if (ctx) ctx.scale(dpr, dpr);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // 1. Ignition phase shortened to 0.8s
        const ignitionTimer = setTimeout(() => {
            setPhase('LAUNCH');
        }, 800);

        return () => clearTimeout(ignitionTimer);
    }, []);

    useEffect(() => {
        if (phase === 'LAUNCH') {
            // 2. Launching phase shortened to 1s
            const explosionTimer = setTimeout(() => {
                setPhase('EXPLOSION');
            }, 1000);
            return () => clearTimeout(explosionTimer);
        }

        if (phase === 'EXPLOSION') {
            // Only fire the sequence if we haven't already

            // Generate exact text particles
            const createTextFirework = (x: number, y: number) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                if (!ctx) return [];
            
                canvas.width = 600;
                canvas.height = 200;
                
                ctx.fillStyle = 'white';
                ctx.font = 'bold 50px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText("Happy birthday", canvas.width / 2, canvas.height / 2 - 30);
                ctx.fillText("cyd<3", canvas.width / 2, canvas.height / 2 + 30);
            
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                const newParticles = [];
                
                const step = 12; // Extreme reduction for mobile
                for (let py = 0; py < canvas.height; py += step) {
                    for (let px = 0; px < canvas.width; px += step) {
                        const index = (py * canvas.width + px) * 4;
                        if (imgData[index + 3] > 128) {
                            const dx = px - canvas.width / 2;
                            const dy = py - canvas.height / 2;
                            
                            const colors = ['#f48fb1', '#fce4ec', '#d81b60', '#ffb6c1', '#ffffff', '#ffd700'];
                            const color = colors[Math.floor(Math.random() * colors.length)];
                            
                            newParticles.push({
                                x: window.innerWidth * x, 
                                y: window.innerHeight * y,
                                vx: (Math.random() - 0.5) * 15,
                                vy: (Math.random() - 0.5) * 15 - 5,
                                color: color,
                                life: 1,
                                size: Math.random() * 1.5 + 1.5,
                                decay: 0.008,
                                targetX: window.innerWidth * 0.5 + dx * 2,
                                targetY: window.innerHeight * 0.35 + dy * 2,
                                forming: true
                            });
                        }
                    }
                }
                return newParticles;
            };

            // Phase 2: Trigger robust flash
            const flashTimer = setTimeout(() => {
                setFlashComplete(true);
            }, 800);

            // Phase 3: Offload particle generation
            setTimeout(() => {
                const initialPts = createTextFirework(0.5, 0.35);
                setParticles(initialPts);
            }, 50);

            // Phase 4: Simplified Confetti - Fire exactly 3 times
            let count = 0;
            const confettiInterval = setInterval(() => {
                confetti({
                    particleCount: 30,
                    angle: 60,
                    spread: 70,
                    origin: { x: 0, y: 0.8 },
                    colors: ['#f48fb1', '#ffffff', '#ffd700'],
                    disableForReducedMotion: true,
                });
                confetti({
                    particleCount: 30,
                    angle: 120,
                    spread: 70,
                    origin: { x: 1, y: 0.8 },
                    colors: ['#f48fb1', '#ffffff', '#ffd700'],
                    disableForReducedMotion: true,
                });
                count++;
                if (count >= 3) clearInterval(confettiInterval);
            }, 400);

            // 3. Transition out faster (3s)
            const transitionTimer = setTimeout(() => {
                setPhase('TRANSITION');
                setTimeout(onComplete, 800);
            }, 3000); 

            return () => {
                clearTimeout(transitionTimer);
                clearTimeout(flashTimer);
                clearInterval(confettiInterval);
            };
        }
    }, [phase, onComplete]);

    // Canvas rendering loop for the custom text particles
    useEffect(() => {
        if (particles.length === 0 || phase !== 'EXPLOSION') return;

        const canvas = document.getElementById('firework-canvas') as HTMLCanvasElement;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let pts = [...particles];

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            pts.forEach(p => {
                if (p.forming) {
                    // Move towards target
                    p.x += (p.targetX - p.x) * 0.05;
                    p.y += (p.targetY - p.y) * 0.05;
                    
                    // Stop forming once close enough
                    if (Math.abs(p.targetX - p.x) < 2 && Math.abs(p.targetY - p.y) < 2) {
                        p.forming = false;
                        p.vx = (Math.random() - 0.5) * 0.5; // slight drift
                        p.vy = Math.random() * 0.5; // slight gravity
                    }
                } else {
                    // Standard floating
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.02; // slow gravity
                    p.life -= p.decay;
                }

                if (p.life > 0) {
                    ctx.globalAlpha = Math.max(0, p.life);
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Removed ctx.shadowBlur/shadowColor for mobile performance
                }
            });

            // Keep alive particles
            pts = pts.filter(p => p.life > 0);

            if (pts.length > 0) {
                animationFrameId = requestAnimationFrame(render);
            }
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [particles, phase]);

    return (
        <motion.div
            id="reveal-container"
            className="relative w-screen h-screen overflow-hidden bg-background font-sans"
            style={{ width: '100vw', height: '100vh', maxWidth: '100vw', maxHeight: '100vh' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'TRANSITION' ? 0 : 1 }}
            transition={{ duration: 1 }}
        >
            {/* Custom Canvas for Text Fireworks */}
            <canvas 
                id="firework-canvas" 
                className="absolute inset-0 pointer-events-none z-30"
                width={window.innerWidth}
                height={window.innerHeight}
                style={{ width: '100%', height: '100%' }}
            />

            {/* Cinematic Camera Pan
                The environment pans down slightly only AFTER the explosion for the transition.
            */}
            <motion.div 
                className="absolute inset-0 flex flex-col items-center justify-end pb-32"
                initial={{ y: "0%" }}
                animate={{ 
                    y: phase === 'TRANSITION' ? "20%" : "0%"
                }}
                transition={{ 
                    duration: 1.5, 
                    ease: "easeInOut" 
                }}
            >
                {/* Launch Pad Glow */}
                <motion.div
                    className="absolute bg-brand-dark/40 rounded-full blur-[100px] z-0"
                    style={{ width: "400px", height: "100px", bottom: "10%" }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                        opacity: (phase === 'IGNITION' || phase === 'LAUNCH') ? 1 : 0, 
                        scale: phase === 'IGNITION' ? 1.5 : 1 
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* The Rocket & Trail - Stays in DOM until Explosion peaks */}
                {(phase === 'IGNITION' || phase === 'LAUNCH' || phase === 'EXPLOSION') && (
                    <motion.div
                        className="relative z-50 flex flex-col items-center"
                        style={{ position: 'absolute', bottom: '15%' }} // Fixed starting point
                        initial={{ y: 0 }}
                        animate={{ 
                            y: (phase === 'LAUNCH' || phase === 'EXPLOSION') ? '-85vh' : 0 
                        }}
                        transition={{ 
                            duration: 2, 
                            ease: "easeIn" // Accelerating momentum without bounce
                        }}
                    >
                        {/* Rocket Head */}
                        <motion.div 
                            className="w-[8px] h-16 bg-gradient-to-b from-white via-brand-light to-brand-dark rounded-full shadow-[0_0_20px_10px_rgba(244,143,177,0.8)]"
                            animate={{ 
                                opacity: phase === 'EXPLOSION' ? 0 : 1 // vanish into explosion
                            }}
                            transition={{ duration: 0.2 }}
                        />
                        
                        {/* Thrust Sparks */}
                        <motion.div 
                            className="w-[20px] h-32 bg-gradient-to-b from-brand-dark via-orange-300 to-transparent blur-md mt-[-10px]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: (phase === 'IGNITION' || phase === 'LAUNCH') ? 1 : 0 }}
                            transition={{ duration: 0.5 }}
                        />
                    </motion.div>
                )}

            </motion.div>

            {/* Falling Pink Lilies - triggered only on explosion */}
            <AnimatePresence>
                {phase === 'EXPLOSION' && !flashComplete && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[100]">
                        {/* Phase 2: CSS-based White Flash (More reliable than JS animation) */}
                        <div 
                            className="absolute inset-0 bg-white"
                            style={{
                                animation: 'fadeHold 0.6s ease-out forwards',
                            }}
                        />

                    </div>
                )}
            </AnimatePresence>
            
            <style>{`
                @keyframes fadeHold {
                    0% { opacity: 1; }
                    30% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `}</style>
        </motion.div>
    );
};

export default RevealSequence;
