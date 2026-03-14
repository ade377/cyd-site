import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Countdown from './components/Countdown';
import RevealSequence from './components/RevealSequence';
import BirthdayExperience from './components/BirthdayExperience';

// The target date: March 15, 2026, 00:00:00 (Midnight)
// Set to a past date for testing if needed
const TARGET_DATE = new Date('2026-03-15T00:00:00').getTime();

export type AppMode = 'COUNTDOWN' | 'REVEAL' | 'BIRTHDAY';

function App() {
  const [mode, setMode] = useState<AppMode>('COUNTDOWN');
  const [timeLeft, setTimeLeft] = useState(TARGET_DATE - new Date().getTime());

  useEffect(() => {
    // If it's already past the date when the app loads, go straight to reveal
    if (timeLeft <= 0 && mode === 'COUNTDOWN') {
      setMode('REVEAL');
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = TARGET_DATE - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        // At exactly zero, trigger the cinematic reveal
        if (mode === 'COUNTDOWN') {
          setMode('REVEAL');
        }
      } else {
        setTimeLeft(difference);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, timeLeft]);

  // Handle successful finish of reveal sequence
  // Wrapped in useCallback to prevent RevealSequence from re-running its effect
  const handleRevealComplete = useCallback(() => {
    setMode('BIRTHDAY');
  }, []);

  return (
    <div className="min-h-screen bg-background text-white selection:bg-brand-DEFAULT selection:text-white overflow-x-hidden font-sans">
      <AnimatePresence mode="wait">
        {mode === 'COUNTDOWN' && (
          <Countdown key="countdown" timeLeft={timeLeft} />
        )}

        {mode === 'REVEAL' && (
          <RevealSequence key="reveal" onComplete={handleRevealComplete} />
        )}

        {mode === 'BIRTHDAY' && (
          <BirthdayExperience key="birthday" />
        )}
      </AnimatePresence>

      {/* DEV HELPER: A mostly-invisible subtle button to force the transition for testing */}
      {mode === 'COUNTDOWN' && (
        <button
          onClick={() => setTimeLeft(0)}
          className="fixed bottom-4 right-4 w-4 h-4 bg-white/5 rounded-full hover:bg-white/20 transition-colors z-50 text-[8px] text-transparent hover:text-white/50 flex flex-col items-center justify-center cursor-pointer"
        >
          skip
        </button>
      )}
    </div>
  );
}

export default App;
