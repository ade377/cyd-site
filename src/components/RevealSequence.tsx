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
        // 1. Ignition phase lasts 1.5s
        const ignitionTimer = setTimeout(() => {
            setPhase('LAUNCH');
        }, 1500);

        return () => clearTimeout(ignitionTimer);
    }, []);

    useEffect(() => {
        if (phase === 'LAUNCH') {
            // 2. Launching phase lasts 2 seconds, then explodes
            const explosionTimer = setTimeout(() => {
                setPhase('EXPLOSION');
            }, 2000);
            return () => clearTimeout(explosionTimer);
        }

        if (phase === 'EXPLOSION') {
            // Only fire the sequence if we haven't already
            const end = Date.now() + 4000;

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
                
                const step = 5; // Increased from 3 to 5 for ~60% fewer particles
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
                                size: Math.random() * 1.5 + 1.5, // Slightly smaller
                                decay: 0.008, // Slightly faster decay
                                targetX: window.innerWidth * 0.5 + dx * 2,
                                targetY: window.innerHeight * 0.35 + dy * 2,
                                forming: true
                            });
                        }
                    }
                }
                return newParticles;
            };

            const initialPts = createTextFirework(0.5, 0.35);
            setParticles(initialPts);

            // Phase 2: Trigger robust flash
            // Safety fallback: Force flash to hide after 800ms no matter what
            const flashTimer = setTimeout(() => {
                setFlashComplete(true);
            }, 800);

            // Massive Exaggerated Explosion
            let animationFrame: number;
            const runConfetti = () => {
                // Outer bursts
                confetti({
                    particleCount: 15,
                    angle: 60,
                    spread: 100,
                    origin: { x: 0, y: 0.8 },
                    colors: ['#f48fb1', '#fce4ec', '#d81b60', '#ffb6c1', '#ffffff', '#ffd700'],
                    disableForReducedMotion: true,
                    startVelocity: 50,
                    gravity: 0.8
                });
                confetti({
                    particleCount: 15,
                    angle: 120,
                    spread: 100,
                    origin: { x: 1, y: 0.8 },
                    colors: ['#f48fb1', '#fce4ec', '#d81b60', '#ffb6c1', '#ffffff', '#ffd700'],
                    disableForReducedMotion: true,
                    startVelocity: 50,
                    gravity: 0.8
                });

                if (Date.now() < end) {
                    animationFrame = requestAnimationFrame(runConfetti);
                }
            };
            runConfetti();

            // 3. Transition out to Birthday Experience automatically after explosion subsides
            const transitionTimer = setTimeout(() => {
                setPhase('TRANSITION');
                setTimeout(onComplete, 1500);
            }, 6500); // Give plenty of time for the text to form and float

            return () => {
                clearTimeout(transitionTimer);
                clearTimeout(flashTimer);
                cancelAnimationFrame(animationFrame);
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
            className="relative w-full h-screen overflow-hidden bg-background font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'TRANSITION' ? 0 : 1 }}
            transition={{ duration: 1.5 }}
        >
            {/* Custom Canvas for Text Fireworks */}
            <canvas 
                id="firework-canvas" 
                className="absolute inset-0 pointer-events-none z-30"
                width={window.innerWidth}
                height={window.innerHeight}
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

                        {/* Exaggerated Lilies */}
                        {[...Array(30)].map((_, i) => (
                            <motion.div
                                key={`ex-lily-${i}`}
                                className="absolute"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: '-20%'
                                }}
                                initial={{ y: 0, x: 0, rotate: 0 }}
                                animate={{
                                    y: '140vh',
                                    x: (Math.random() - 0.5) * 300,
                                    rotate: Math.random() * 720 - 360
                                }}
                                transition={{
                                    duration: Math.random() * 3 + 2.5, // fast, chaotic fall
                                    ease: "easeOut",
                                    delay: Math.random() * 0.5 // immediate burst
                                }}
                            >
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_10px_20px_rgba(216,27,96,0.5)] opacity-95" transform={`scale(${Math.random() * 1 + 1.2})`}>
                                    <path d="M12 2C12 2 10 8 6 10C2 12 2 12 2 12C2 12 8 14 10 18C12 22 12 22 12 22C12 22 14 16 18 14C22 12 22 12 22 12C22 12 16 10 14 6C12 2 12 2 12 2Z" fill="#f48fb1" />
                                    <path d="M12 4C12 4 11 8 8 9.5C5 11 5 11 5 11C5 11 9 12.5 10.5 15.5C12 18.5 12 18.5 12 18.5C12 18.5 13 14.5 16 13C19 11.5 19 11.5 19 11.5C19 11.5 15 10 13.5 7C12 4 12 4 12 4Z" fill="#d81b60" />
                                    <circle cx="12" cy="12" r="1.5" fill="#fbc02d" />
                                </svg>
                            </motion.div>
                        ))}

                        {/* Additional floating petals */}
                        {[...Array(40)].map((_, i) => (
                            <motion.div
                                key={`petal-${i}`}
                                className="absolute rounded-full bg-brand blur-[1px]"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: '30%',
                                    width: Math.random() * 10 + 5,
                                    height: Math.random() * 10 + 5,
                                }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1.5, 1],
                                    y: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 800 + 400],
                                    x: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 600],
                                }}
                                transition={{
                                    duration: Math.random() * 3 + 2,
                                    ease: "easeOut"
                                }}
                            />
                        ))}
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
