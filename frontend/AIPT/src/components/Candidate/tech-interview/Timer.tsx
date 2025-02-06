import React, { useEffect, useRef, useState } from 'react';
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
  const { updateTimeRemaining, lockQuestion, isQuestionLocked } = useInterviewStore();

  // Local state to control time remaining for this timer instance
  const [localTimeRemaining, setLocalTimeRemaining] = useState<number>(duration);

  // Using a ref to avoid re-triggering updates
  const isMounted = useRef(true);
  const isInitialRender = useRef(true);  // To track the first render

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false; // Set to false on unmount to stop updates
    };
  }, []);

  useEffect(() => {
    if (displayOnly) {
      // Set the local time for display only (doesn't start countdown)
      setLocalTimeRemaining(duration);
      return;
    }

    // Stop if the question is locked
    if (isQuestionLocked(questionId)) {
      setLocalTimeRemaining(0); // Set to 0 if the question is locked
      return;
    }

    // Initialize the timer only once during the first render
    if (isInitialRender.current) {
      updateTimeRemaining(duration);  // Update global store with initial duration
      isInitialRender.current = false;
    }

    const interval = setInterval(() => {
      // Avoid updating the state after component unmount
      if (!isMounted.current) return;

      // Decrease the time by 1 second
      setLocalTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          lockQuestion(questionId);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, questionId, displayOnly, lockQuestion, onTimeUp]);

  const minutes = Math.floor((localTimeRemaining || 0) / 60);
  const seconds = (localTimeRemaining || 0) % 60;

  return (
    <div className="flex items-center space-x-2 text-lg font-semibold">
      <TimerIcon className="w-6 h-6" />
      <span className={localTimeRemaining && localTimeRemaining < 30 ? 'text-red-500' : ''}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};
