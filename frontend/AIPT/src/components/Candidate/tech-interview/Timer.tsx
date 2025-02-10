
import React, { useEffect, useState } from 'react';
import { Timer as TimerIcon } from 'lucide-react';
import { useInterviewStore } from '../../store/InterviewStore';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  questionId: string; 
}

export const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, questionId }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const { lockQuestion, isQuestionLocked } = useInterviewStore();

  useEffect(() => {
    // Reset timer when duration or questionId changes
    setTimeLeft(duration);
    
    if (isQuestionLocked(questionId)) {
      setTimeLeft(0);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          lockQuestion(questionId);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [duration, questionId, lockQuestion, onTimeUp, isQuestionLocked]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center space-x-2 text-lg font-semibold">
      <TimerIcon className="w-6 h-6" />
      <span className={timeLeft < 30 ? 'text-red-500' : ''}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};