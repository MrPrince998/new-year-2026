import { TimeCardProps } from "@/libs/interfaces/timeCard";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const TimeCard = ({ date, title }: TimeCardProps) => {
  return (
    <motion.div
      className="rounded-md shadow-md border border-gray-100 p-3 sm:p-4 md:p-6"
      whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <AnimatePresence mode="wait">
        <motion.h1
          key={date}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl drop-shadow-lg"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {date}
        </motion.h1>
      </AnimatePresence>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mt-1 sm:mt-2">
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
