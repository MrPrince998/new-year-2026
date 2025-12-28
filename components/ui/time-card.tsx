import { TimeCardProps } from "@/libs/interfaces/timeCard";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const TimeCard = ({ date, title }: TimeCardProps) => {
  return (
    <motion.div
      className="rounded-md p-3 sm:p-4 md:p-6 bg-white/0 backdrop-blur"
      whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <AnimatePresence mode="wait">
        <motion.h1
          key={date}
          className="text-xl sm:text-2xl md:text-3xl lg:text-6xl text-white font-bold drop-shadow-lg"
          initial={{ y: -20, scale: 0.8, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 20, scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {date}
        </motion.h1>
      </AnimatePresence>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 font-semibold mt-1 sm:mt-2">
        {typeof date === "string"
          ? date === "1"
            ? `${title}`
            : `${title}s`
          : date === 1
          ? `${title}`
          : `${title}s`}
      </p>
    </motion.div>
  );
};

export default TimeCard;
