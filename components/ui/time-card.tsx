import { TimeCardProps } from "@/libs/interfaces/timeCard";
import React from "react";

const TimeCard = ({ date, title }: TimeCardProps) => {
  return (
    <div className="rounded-md shadow-md border border-gray-100 p-3 sm:p-4 md:p-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl drop-shadow-lg">
        {date}
      </h1>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mt-1 sm:mt-2">
        {typeof date === "string"
          ? date === "1"
            ? `${title}`
            : `${title}s`
          : date === 1
          ? `${title}`
          : `${title}s`}
      </p>
    </div>
  );
};

export default TimeCard;
