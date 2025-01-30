import React, { useEffect } from 'react';
import { Timer as TimerIcon } from 'lucide-react';
import { useInterviewStore } from '../../store/InterviewStore';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  questionId: number;
  displayOnly?: boolean;  // New prop to indicate if this is just for display
}

export const Timer: React.FC<TimerProps> = ({ 
  duration, 
  onTimeUp, 
  questionId, 
  displayOnly = false 
}) => {
  const { timeRemaining, updateTimeRemaining, lockQuestion, isQuestionLocked } = useInterviewStore();

  useEffect(() => {
    // Only the main timer should set up the interval and update the time
    if (displayOnly) return;

    if (isQuestionLocked(questionId)) {
      updateTimeRemaining(0);
      return;
    }

    updateTimeRemaining(duration);
    
    const interval = setInterval(() => {
      updateTimeRemaining((prev: number) => {
        if (prev <= 1) {
          clearInterval(interval);
          lockQuestion(questionId);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, questionId, displayOnly]);

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