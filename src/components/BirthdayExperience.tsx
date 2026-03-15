import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Gift, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

// Reliable Vite asset imports
import img1 from '../assets/images/IMG_1211.jpeg';
import img2 from '../assets/images/IMG_1445.jpeg';
import img3 from '../assets/images/IMG_1741.jpeg';
import img4 from '../assets/images/IMG_2496.jpeg';
import img5 from '../assets/images/lp_image.jpeg';
import img6 from '../assets/images/IMG_4831.jpeg';

const BirthdayExperience: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    // Parallax background movements
    const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const yOrbs = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
    const opacityDust = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);

    useEffect(() => {
        // Grand finale confetti burst on initial load - updated with more magical colors
        const end = Date.now() + 5000;
        const colors = ['#f48fb1', '#c084fc', '#818cf8', '#ffb6c1', '#ffffff', '#ffd700'];

        (function frame() {
            confetti({
                particleCount: 8,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 8,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }, []);

    return (
        <div ref={containerRef} className="relative w-full text-white overflow-hidden bg-[#0d0b14] font-sans selection:bg-indigo-500 selection:text-white pb-32">

            {/* Parallax Background Elements - Updated to Indigo/Iris glows */}
            <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 pointer-events-none opacity-50">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(129,140,248,0.2),transparent_50%)]" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,rgba(192,132,252,0.15),transparent_50%)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle,rgba(244,143,177,0.05),transparent_60%)]" />
            </motion.div>

            {/* Interactive Scroll Particles (Phase 3) */}
            <motion.div style={{ y: yOrbs, opacity: opacityDust }} className="absolute inset-0 z-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={`dust-${i}`}
                        className="absolute rounded-full bg-white/20 blur-[2px]"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 200}%`,
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            boxShadow: '0 0 10px rgba(255,255,255,0.2)',
                            willChange: 'transform'
                        }}
                    />
                ))}
            </motion.div>

            {/* Floating Pink Lilies Loop - Magical tint */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={`lily-${i}`}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `-10%`
                        }}
                        animate={{
                            y: ['0vh', '110vh'],
                            x: Math.random() > 0.5 ? ['0vw', '10vw', '-5vw', '10vw'] : ['0vw', '-10vw', '5vw', '-10vw'],
                            rotate: [0, 180, 360, 540]
                        }}
                        transition={{
                            y: { duration: Math.random() * 15 + 15, repeat: Infinity, ease: 'linear' },
                            x: { duration: Math.random() * 10 + 10, repeat: Infinity, ease: 'easeInOut' },
                            rotate: { duration: Math.random() * 15 + 10, repeat: Infinity, ease: 'linear' },
                            delay: Math.random() * 15
                        }}
                    >
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40" transform={`scale(${Math.random() * 0.6 + 0.4})`}>
                            <path d="M12 2C12 2 10 8 6 10C2 12 2 12 2 12C2 12 8 14 10 18C12 22 12 22 12 22C12 22 14 16 18 14C22 12 22 12 22 12C22 12 16 10 14 6C12 2 12 2 12 2Z" fill="#f48fb1" />
                            <path d="M12 4C12 4 11 8 8 9.5C5 11 5 11 5 11C5 11 9 12.5 10.5 15.5C12 18.5 12 18.5 12 18.5C12 18.5 13 14.5 16 13C19 11.5 19 11.5 19 11.5C19 11.5 15 10 13.5 7C12 4 12 4 12 4Z" fill="#d81b60" />
                            <circle cx="12" cy="12" r="1.5" fill="#fef08a" />
                        </svg>
                    </motion.div>
                ))}
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* 1. Hero Section */}
                <section className="min-h-screen flex flex-col items-center justify-center pt-20 pb-32 text-center" id="hero">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-8 text-rose-100 drop-shadow-[0_0_40px_rgba(192,132,252,0.6)] tracking-tight">
                            Happy birthday <br className="md:hidden" /> cyd&lt;3
                        </h1>
                        <p className="text-xl md:text-2xl text-indigo-200/80 font-light tracking-wide max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                            Wishing you a year filled with as much joy, beauty, and wonder as you bring to the world.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="mt-20 animate-bounce cursor-pointer"
                        onClick={() => {
                            document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                    >
                        <div className="w-px h-16 bg-gradient-to-b from-indigo-400 to-transparent mx-auto" />
                    </motion.div>
                </section>

                {/* 2. Gallery Section */}
                <section className="py-24" id="gallery" data-sync-marker="v2">
                    <SectionHeader icon={<ImageIcon className="w-6 h-6" />} title="Beautiful Memories" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                        {[
                            { id: 1, src: img1, alt: "Memory 1" },
                            { id: 2, src: img2, alt: "Memory 2" },
                            { id: 3, src: img3, alt: "Memory 3" },
                            { id: 4, src: img4, alt: "Memory 4" },
                            { id: 5, src: img5, alt: "Memory 5" },
                            { id: 6, src: img6, alt: "Memory 6" },
                        ].map((img) => (
                            <motion.div
                                key={img.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: (img.id % 3) * 0.2 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#1e1a2e]/40 backdrop-blur-md border border-white/5 shadow-xl"
                            >
                                {img.src ? (
                                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-[#1e1a2e] mix-blend-overlay group-hover:opacity-50 transition-opacity duration-500" />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center text-indigo-400/20">
                                    {!img.src && <span className="text-sm tracking-widest uppercase">{img.alt}</span>}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 3. Messages Section */}
                <section className="py-24" id="messages">
                    <SectionHeader icon={<Heart className="w-6 h-6" />} title="Heartfelt Notes" />
                    <div className="grid md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto">
                        {["You inspire everyone around you.", "May this year bring everything you hope for.", "Thank you for being you.", "Cheers to another amazing year."].map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="p-8 rounded-2xl bg-[#1e1a2e]/40 backdrop-blur-md border border-white/5 shadow-xl relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <p className="text-lg md:text-xl font-light leading-relaxed italic text-white/90">
                                    "{msg}"
                                </p>
                                <div className="mt-6 w-12 h-px bg-indigo-500/50" />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 4. Surprise Interactions */}
                <section className="py-24" id="surprise">
                    <SectionHeader icon={<Gift className="w-6 h-6" />} title="Little Surprises" />
                    <div className="flex flex-wrap justify-center gap-6 mt-16">
                        {[1, 2, 3].map((idx) => (
                            <SurpriseCard key={idx} index={idx} />
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-4 justify-center"
    >
        <div className="w-12 h-px bg-gradient-to-r from-transparent to-indigo-500" />
        <span className="text-indigo-400 flex items-center gap-2">
            {icon}
        </span>
        <h2 className="text-3xl md:text-4xl font-light text-white tracking-wide">{title}</h2>
        <div className="w-12 h-px bg-gradient-to-l from-transparent to-indigo-500" />
    </motion.div>
);

const SurpriseCard = ({ index }: { index: number }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isOpen) {
            setIsOpen(true);
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
                particleCount: 30,
                spread: 40,
                origin: { x, y },
                colors: ['#c084fc', '#ffffff'],
                disableForReducedMotion: true,
            });
        }
    };

    return (
        <motion.button
            onClick={handleClick}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            whileHover={!isOpen ? { y: -5, boxShadow: "0 10px 30px -10px rgba(129,140,248,0.3)" } : {}}
            className={`relative w-48 h-64 rounded-2xl bg-[#1e1a2e]/40 backdrop-blur-md border border-white/5 shadow-xl flex items-center justify-center transition-all duration-500 overflow-hidden ${isOpen ? 'bg-indigo-500/10 border-indigo-500/30 cursor-default' : 'hover:bg-indigo-900/60 cursor-pointer'
                }`}
        >
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                {!isOpen ? (
                    <Gift className="w-10 h-10 text-rose-300 animate-pulse-slow" />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-white/90 font-light"
                    >
                        {index === 1 && "A promise for a vanilla latte."}
                        {index === 2 && "A big hug."}
                        {index === 3 && "A secret adventure."}
                    </motion.div>
                )}
            </div>
        </motion.button>
    );
};

export default BirthdayExperience;
