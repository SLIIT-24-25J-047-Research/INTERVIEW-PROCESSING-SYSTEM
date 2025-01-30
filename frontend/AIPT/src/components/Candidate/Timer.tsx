import React, { useEffect } from 'react';
import { Timer as TimerIcon } from 'lucide-react';
import { useInterviewStore } from '../store/InterviewStore';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
}

export const Timer: React.FC<TimerProps> = ({ duration, onTimeUp }) => {
  const { timeRemaining, updateTimeRemaining } = useInterviewStore();

  useEffect(() => {
    updateTimeRemaining(duration);
    const interval = setInterval(() => {
      updateTimeRemaining((prev: number) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      } );
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  const minutes = Math.floor((timeRemaining || 0) / 60);
  const seconds = (timeRemaining || 0) % 60;

  return (
    <div className="flex items-center space-x-2 text-lg font-semibold">
      <TimerIcon className="w-6 h-6" />
      <span className={timeRemaining && timeRemaining < 30 ? 'text-red-500' : ''}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};