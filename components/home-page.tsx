"use client";
import React from "react";
import { Pause, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LightRays from "./ui/light-rays";
import TimeCard from "./ui/time-card";
import Fireworks from "./ui/fireworks";
import FireworksParticles from "./ui/fireworks-particles";
const HomePage = () => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [currentYear, setCurrentYear] = React.useState(
    new Date().getFullYear()
  );
  const [DaysLeft, setDaysLeft] = React.useState(0);
  const [HourLeft, setHourLeft] = React.useState(0);
  const [MinutesLeft, setMinutesLeft] = React.useState(0);
  const [SecondLeft, setSecondLeft] = React.useState(0);

  const togglePlay = () => {
    if (!playing) {
      audioRef.current?.play().catch((error) => {
        console.error("Audio play failed:", error);
      });
    } else {
      audioRef.current?.pause();
    }
    setPlaying(!playing);
  };

  // countdown logic
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const nextYear = new Date(currentYear + 1, 0, 1);
      const difference = nextYear.getTime() - now.getTime();
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      setDaysLeft(days);
      setHourLeft(hours);
      setMinutesLeft(minutes);
      setSecondLeft(seconds);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentYear]);

  // Auto-play when year changes to 2026
  React.useEffect(() => {
    if (currentYear === 2026 && !playing && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Auto-play failed:", error);
      });
      setPlaying(true);
    }
  }, [currentYear, playing]);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="fixed inset-0"
        style={{
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
          backgroundSize: "400% 400%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Overlay gradient for depth */}
      <div
        className="fixed inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)",
        }}
      />

      {/* Animated mesh gradient */}
      <motion.div
        className="fixed inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 121, 198, 0.3), transparent 50%), radial-gradient(circle at 40% 20%, rgba(138, 35, 135, 0.3), transparent 50%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div
        className="relative z-10"
        style={{ width: "100%", height: "100%", position: "absolute" }}
      >
        {currentYear === 2026 && (
          <>
            <LightRays
              raysOrigin="top-center"
              raysColor="#00ffff"
              raysSpeed={2}
              lightSpread={10}
              rayLength={1.8}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0.1}
              distortion={0.05}
            />
            <Fireworks />
            <FireworksParticles />
          </>
        )}
      </div>
      <nav className="sticky top-0">
        <motion.div
          className="flex items-center justify-end p-2 sm:p-4"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.button
            onClick={togglePlay}
            className="flex items-center justify-center space-x-1 sm:space-x-2 cursor-pointer bg-gray-200 px-2 py-1 sm:px-3 sm:py-2 rounded-full transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {playing ? (
              <>
                <Pause fill="black" className="w-4 h-4 sm:w-5 sm:h-5" />
                <h1 className="text-black font-bold text-sm sm:text-base md:text-xl lg:text-2xl">
                  Stop Music
                </h1>
              </>
            ) : (
              <>
                <Play fill="black" className="w-4 h-4 sm:w-5 sm:h-5" />
                <h1 className="text-black font-bold text-sm sm:text-base md:text-xl lg:text-2xl">
                  Play Music
                </h1>
              </>
            )}
          </motion.button>
          <audio ref={audioRef} loop className="hidden">
            <source src="/new_year.mp3" type="audio/mpeg" />
          </audio>
        </motion.div>
      </nav>
      <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 relative z-60">
        <div className="flex flex-col items-center justify-center px-4 text-center text-white">
          {currentYear === 2026 ? (
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold drop-shadow-lg relative z-60"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                rotate: [0, 10, -10, 0],
                opacity: 1,
                y: [0, -20, 0],
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
                times: [0, 0.5, 1],
              }}
              style={{
                textShadow:
                  "0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,215,0,0.6), 0 0 60px rgba(255,105,180,0.4)",
              }}
            >
              <motion.span
                animate={{
                  scale: [1, 1.1, 1],
                  filter: [
                    "hue-rotate(0deg)",
                    "hue-rotate(360deg)",
                    "hue-rotate(0deg)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🎉 Happy New Year! 🎉
              </motion.span>
            </motion.h1>
          ) : (
            <motion.div
              className="grid grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 w-full max-w-md sm:max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <TimeCard date={DaysLeft} title={"Day"} />
              </motion.div>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <TimeCard date={HourLeft} title={"Hour"} />
              </motion.div>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <TimeCard date={MinutesLeft} title={"Minute"} />
              </motion.div>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <TimeCard date={SecondLeft} title={"Second"} />
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
    </section>
  );
};

export default HomePage;
