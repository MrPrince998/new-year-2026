"use client";
import React from "react";
import { Pause, Play } from "lucide-react";
import LightRays from "./ui/light-rays";
import TimeCard from "./ui/time-card";
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
      audioRef.current?.play();
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

  return (
    <section>
      <div style={{ width: "100%", height: "100%", position: "absolute" }}>
        {currentYear === 2026 && (
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
        )}
      </div>
      <nav className="sticky top-0">
        <div className="flex items-center justify-end p-2 sm:p-4">
          <button
            onClick={togglePlay}
            className="flex items-center justify-center space-x-1 sm:space-x-2 cursor-pointer bg-gray-200 px-2 py-1 sm:px-3 sm:py-2 rounded-full transition"
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
          </button>
          <audio ref={audioRef} loop className="hidden">
            <source src="/music.mp3" type="audio/mpeg" />
          </audio>
        </div>
      </nav>
      <main>
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <h1 className="text-8xl sm:text-8xl md:text-9xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
            {currentYear}
          </h1>
          <div className="grid grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 w-full max-w-md sm:max-w-2xl">
            <TimeCard date={DaysLeft} title={"Day"} />
            <TimeCard date={HourLeft} title={"Hour"} />
            <TimeCard date={MinutesLeft} title={"Minute"} />
            <TimeCard date={SecondLeft} title={"Second"} />
          </div>
        </div>
      </main>
    </section>
  );
};

export default HomePage;
