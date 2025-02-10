import React, { useEffect, useState, useCallback } from 'react';
import { Timer as TimerIcon, AlertTriangle } from 'lucide-react';
import { useInterviewStore } from '../../store/InterviewStore';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  questionId: string;
}

export const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, questionId }) => {
  const { lockQuestion, isQuestionLocked, updateTimer, getTimeLeft } = useInterviewStore();
  
  // Initialize timeLeft state with the full duration if no saved state exists
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = getTimeLeft(questionId, duration);
    return savedTime === duration ? duration : savedTime;
  });
  
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [warningCount, setWarningCount] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const handleVisibilityChange = useCallback(() => {
    const isHidden = document.hidden;
    setIsWindowFocused(!isHidden);
    
    if (isHidden) {
      setWarningCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          setIsTimerActive(false);
          lockQuestion(questionId);
          onTimeUp();
        }
        return newCount;
      });
    }
  }, [questionId, lockQuestion, onTimeUp]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  useEffect(() => {
    // Reset timer state when question changes
    setTimeLeft(duration);
    setIsTimerActive(true);
    setWarningCount(0);
  }, [questionId, duration]);

  useEffect(() => {
    if (isQuestionLocked(questionId) || !isTimerActive) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          setIsTimerActive(false);
          lockQuestion(questionId);
          onTimeUp();
          return 0;
        }

        const newTime = prevTime - 1;
        updateTimer(questionId, newTime);
        return newTime;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [questionId, lockQuestion, onTimeUp, isQuestionLocked, isTimerActive, updateTimer]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 text-lg font-semibold">
        <TimerIcon className="w-6 h-6" />
        <span className={timeLeft < 30 ? 'text-red-500' : ''}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
      {!isWindowFocused && (
        <div className="flex items-center text-amber-600">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span className="text-sm">
            Warning {warningCount}/3: Please stay in this window!
          </span>
        </div>
      )}
    </div>
  );
};