import { useState, useEffect, useRef, useCallback } from "react";

const TIMEZONE = "America/Chicago";
const BIRTHDAY_MONTH = 3;
const BIRTHDAY_DAY = 15;

function getHoustonNow() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: TIMEZONE }));
}

function getMode() {
  const now = getHoustonNow();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  return m === BIRTHDAY_MONTH && d === BIRTHDAY_DAY ? "birthday" : "countdown";
}

function getTargetDate() {
  const now = getHoustonNow();
  const year = now.getFullYear();
  const thisYear = new Date(year, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0);
  if (now < thisYear) return thisYear;
  if (now.getMonth() + 1 === BIRTHDAY_MONTH && now.getDate() === BIRTHDAY_DAY) return thisYear;
  return new Date(year + 1, BIRTHDAY_MONTH - 1, BIRTHDAY_DAY, 0, 0, 0);
}

function getCountdown() {
  const now = getHoustonNow();
  const target = getTargetDate();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 1,
  speed: Math.random() * 20 + 15,
  delay: Math.random() * 10,
  drift: (Math.random() - 0.5) * 30,
}));

const CONFETTI = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 5,
  duration: Math.random() * 3 + 3,
  size: Math.random() * 8 + 4,
  color: ["#d4af37", "#f5e6cc", "#e8c4a0", "#fff8e7", "#c9a84c", "#b8860b"][Math.floor(Math.random() * 6)],
  rotation: Math.random() * 360,
  drift: (Math.random() - 0.5) * 200,
}));

function Particle({ p, isBirthday }) {
  const color = isBirthday ? "#d4af37" : "rgba(255,255,255,0.3)";
  return (
    <div
      style={{
        position: "absolute",
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: p.size,
        height: p.size,
        borderRadius: "50%",
        background: color,
        animation: `floatUp ${p.speed}s linear ${p.delay}s infinite`,
        opacity: 0.6,
        pointerEvents: "none",
      }}
    />
  );
}

function ConfettiPiece({ c }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${c.x}%`,
        top: "-5%",
        width: c.size,
        height: c.size * 1.5,
        background: c.color,
        borderRadius: 1,
        animation: `confettiFall ${c.duration}s ease-in ${c.delay}s infinite`,
        transform: `rotate(${c.rotation}deg)`,
        opacity: 0.8,
        pointerEvents: "none",
        ["--drift"]: `${c.drift}px`,
      }}
    />
  );
}

function CountdownView() {
  const [cd, setCd] = useState(getCountdown());
  useEffect(() => {
    const t = setInterval(() => setCd(getCountdown()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #050505 0%, #0a0a0a 40%, #0d0906 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Playfair Display', 'Georgia', serif",
    }}>
      {PARTICLES.map(p => <Particle key={p.id} p={p} isBirthday={false} />)}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "2rem" }}>
        <div style={{
          fontSize: 13,
          letterSpacing: 8,
          color: "rgba(212,175,55,0.5)",
          textTransform: "uppercase",
          marginBottom: 32,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
        }}>
          Something is coming
        </div>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 48 }}>
          {[
            { val: cd.days, label: "days" },
            { val: cd.hours, label: "hours" },
            { val: cd.minutes, label: "minutes" },
            { val: cd.seconds, label: "seconds" },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <div style={{
                fontSize: 56,
                fontWeight: 400,
                color: "#d4af37",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                textShadow: "0 0 40px rgba(212,175,55,0.3)",
              }}>
                {String(item.val).padStart(2, "0")}
              </div>
              <div style={{
                fontSize: 11,
                letterSpacing: 4,
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                marginTop: 8,
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          width: 1,
          height: 60,
          background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.3), transparent)",
          margin: "0 auto 24px",
        }} />
        <div style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.15)",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          letterSpacing: 2,
        }}>
          March 15
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
        @keyframes floatUp {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
      `}</style>
    </div>
  );
}

function BirthdayView() {
  const [phase, setPhase] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [activeNote, setActiveNote] = useState(0);
  const [revealedCards, setRevealedCards] = useState(new Set());

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2500);
    const t4 = setTimeout(() => { setPhase(4); setShowContent(true); }, 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const revealCard = (id) => {
    setRevealedCards(prev => new Set([...prev, id]));
  };

  const notes = [
    { title: "What I see in you", body: "Write the real words here. Pour your heart into this space. She'll read it and know it was written just for her." },
    { title: "A memory I hold close", body: "Replace this with a memory that makes you both smile. The kind of moment that doesn't need context to feel warm." },
    { title: "What I want you to know", body: "This is where you say what you don't always say out loud. Make it count. She deserves to read it." },
  ];

  const timeline = [
    { date: "Chapter One", title: "The beginning", desc: "Where it all started. Replace with your real story.", icon: "\u2728" },
    { date: "A shift", title: "Things got real", desc: "The moment you both knew this was different.", icon: "\u{1F4AB}" },
    { date: "Right now", title: "Building something", desc: "Every day, choosing this. Replace with what matters now.", icon: "\u{1F451}" },
  ];

  const cards = [
    { id: "c1", title: "Open first", content: "The first surprise goes here. Something she won't expect.", type: "reveal" },
    { id: "c2", title: "A promise", content: "Write a real commitment. Something you'll follow through on.", type: "promise" },
    { id: "c3", title: "For later", content: "A surprise she'll unwrap later today. Could be a gift, a plan, an experience.", type: "gift" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050505",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Playfair Display', Georgia, serif",
      color: "#f5e6cc",
    }}>
      {CONFETTI.map(c => <ConfettiPiece key={c.id} c={c} />)}
      {PARTICLES.map(p => <Particle key={p.id} p={p} isBirthday={true} />)}

      {/* Hero */}
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 2,
        textAlign: "center",
        padding: "2rem",
      }}>
        <div style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "translateY(0)" : "translateY(20px)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          fontSize: 13,
          letterSpacing: 8,
          color: "rgba(212,175,55,0.6)",
          textTransform: "uppercase",
          marginBottom: 24,
          fontFamily: "'Cormorant Garamond', Georgia, serif",
        }}>
          March 15, {new Date().getFullYear()}
        </div>

        <h1 style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
          transition: "all 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
          fontSize: "clamp(40px, 10vw, 80px)",
          fontWeight: 400,
          fontStyle: "italic",
          color: "#d4af37",
          lineHeight: 1.1,
          marginBottom: 16,
          textShadow: "0 0 80px rgba(212,175,55,0.2)",
        }}>
          Happy Birthday
        </h1>

        <div style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "translateY(0)" : "translateY(20px)",
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
          fontSize: 18,
          color: "rgba(245,230,204,0.6)",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          letterSpacing: 2,
          fontStyle: "italic",
        }}>
          A day made just for you
        </div>

        <div style={{
          opacity: phase >= 4 ? 1 : 0,
          transition: "opacity 2s ease",
          marginTop: 60,
        }}>
          <div style={{
            width: 1,
            height: 80,
            background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.4), transparent)",
            margin: "0 auto",
            animation: "pulse 3s ease-in-out infinite",
          }} />
          <div style={{
            fontSize: 12,
            letterSpacing: 6,
            color: "rgba(212,175,55,0.4)",
            textTransform: "uppercase",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            marginTop: 16,
          }}>
            Scroll down
          </div>
        </div>
      </div>

      {/* Content sections */}
      {showContent && (
        <>
          {/* Love Notes */}
          <section style={{
            padding: "80px 24px",
            maxWidth: 640,
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
          }}>
            <div style={{
              fontSize: 12,
              letterSpacing: 6,
              color: "rgba(212,175,55,0.5)",
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: 40,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}>
              Words for you
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 32 }}>
              {notes.map((_, i) => (
                <button key={i} onClick={() => setActiveNote(i)} style={{
                  width: 32,
                  height: 3,
                  background: i === activeNote ? "#d4af37" : "rgba(212,175,55,0.2)",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.4s ease",
                  borderRadius: 2,
                }} />
              ))}
            </div>

            <div style={{
              padding: "40px 32px",
              border: "1px solid rgba(212,175,55,0.15)",
              borderRadius: 2,
              background: "rgba(212,175,55,0.03)",
              textAlign: "center",
              minHeight: 200,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              transition: "opacity 0.5s ease",
            }}>
              <div style={{
                fontSize: 20,
                fontStyle: "italic",
                color: "#d4af37",
                marginBottom: 20,
              }}>
                {notes[activeNote].title}
              </div>
              <div style={{
                fontSize: 16,
                lineHeight: 1.8,
                color: "rgba(245,230,204,0.7)",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontWeight: 300,
              }}>
                {notes[activeNote].body}
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section style={{
            padding: "80px 24px",
            maxWidth: 640,
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
          }}>
            <div style={{
              fontSize: 12,
              letterSpacing: 6,
              color: "rgba(212,175,55,0.5)",
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: 48,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}>
              Our story
            </div>

            <div style={{ position: "relative", paddingLeft: 40 }}>
              <div style={{
                position: "absolute",
                left: 12,
                top: 0,
                bottom: 0,
                width: 1,
                background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.3), transparent)",
              }} />

              {timeline.map((item, i) => (
                <div key={i} style={{
                  marginBottom: i < timeline.length - 1 ? 48 : 0,
                  position: "relative",
                }}>
                  <div style={{
                    position: "absolute",
                    left: -34,
                    top: 4,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#d4af37",
                    boxShadow: "0 0 20px rgba(212,175,55,0.4)",
                  }} />
                  <div style={{
                    fontSize: 11,
                    letterSpacing: 4,
                    color: "rgba(212,175,55,0.5)",
                    textTransform: "uppercase",
                    marginBottom: 8,
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                  }}>
                    {item.date}
                  </div>
                  <div style={{
                    fontSize: 20,
                    fontStyle: "italic",
                    color: "#d4af37",
                    marginBottom: 8,
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "rgba(245,230,204,0.6)",
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                  }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Surprise Cards */}
          <section style={{
            padding: "80px 24px",
            maxWidth: 700,
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
          }}>
            <div style={{
              fontSize: 12,
              letterSpacing: 6,
              color: "rgba(212,175,55,0.5)",
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: 48,
              fontFamily: "'Cormorant Garamond', Georgia, serif",
            }}>
              Surprises
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16,
            }}>
              {cards.map((card) => {
                const isRevealed = revealedCards.has(card.id);
                return (
                  <div
                    key={card.id}
                    onClick={() => revealCard(card.id)}
                    style={{
                      padding: "32px 24px",
                      border: "1px solid rgba(212,175,55,0.15)",
                      borderRadius: 2,
                      background: isRevealed ? "rgba(212,175,55,0.06)" : "rgba(212,175,55,0.02)",
                      cursor: isRevealed ? "default" : "pointer",
                      textAlign: "center",
                      transition: "all 0.6s ease",
                      minHeight: 160,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    {!isRevealed ? (
                      <>
                        <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.4 }}>
                          {card.type === "reveal" ? "\u2728" : card.type === "promise" ? "\u{1F91D}" : "\u{1F381}"}
                        </div>
                        <div style={{
                          fontSize: 13,
                          letterSpacing: 3,
                          color: "rgba(212,175,55,0.5)",
                          textTransform: "uppercase",
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                        }}>
                          Tap to open
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{
                          fontSize: 16,
                          fontStyle: "italic",
                          color: "#d4af37",
                          marginBottom: 12,
                        }}>
                          {card.title}
                        </div>
                        <div style={{
                          fontSize: 14,
                          lineHeight: 1.7,
                          color: "rgba(245,230,204,0.7)",
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                        }}>
                          {card.content}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Footer */}
          <section style={{
            padding: "80px 24px 60px",
            textAlign: "center",
            position: "relative",
            zIndex: 2,
          }}>
            <div style={{
              width: 1,
              height: 60,
              background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.3), transparent)",
              margin: "0 auto 24px",
            }} />
            <div style={{
              fontSize: 24,
              fontStyle: "italic",
              color: "#d4af37",
              marginBottom: 12,
            }}>
              Today is yours
            </div>
            <div style={{
              fontSize: 14,
              color: "rgba(245,230,204,0.4)",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              letterSpacing: 2,
            }}>
              Made with love
            </div>
          </section>
        </>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes floatUp {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh) translateX(30px); opacity: 0; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(100vh) translateX(var(--drift, 0px)) rotate(720deg); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        html { scroll-behavior: smooth; }
        body { background: #050505; }
      `}</style>
    </div>
  );
}

export default function BirthdaySurprise() {
  const [mode, setMode] = useState(null);

  useEffect(() => {
    setMode(getMode());
    const interval = setInterval(() => setMode(getMode()), 30000);
    return () => clearInterval(interval);
  }, []);

  if (!mode) return null;
  return mode === "birthday" ? <BirthdayView /> : <CountdownView />;
}
