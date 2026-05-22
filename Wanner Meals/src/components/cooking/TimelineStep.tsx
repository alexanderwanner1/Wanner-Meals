import React from 'react';

interface TimelineStepProps {
  stepNumber: number;
  text: string;
  isLast: boolean;
}

export default function TimelineStep({ stepNumber, text, isLast }: TimelineStepProps) {
  return (
    <div className="flex gap-4">
      {/* Left column: circle + connecting line */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Step circle */}
        <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
          {stepNumber}
        </div>
        {/* Connecting line to next step */}
        {!isLast && (
          <div className="w-0.5 bg-green-100 flex-1 my-1 min-h-[1.5rem]" />
        )}
      </div>

      {/* Right column: step text */}
      <div className={`pt-1.5 ${isLast ? 'pb-2' : 'pb-6'}`}>
        <p className="text-gray-800 text-[15px] leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
