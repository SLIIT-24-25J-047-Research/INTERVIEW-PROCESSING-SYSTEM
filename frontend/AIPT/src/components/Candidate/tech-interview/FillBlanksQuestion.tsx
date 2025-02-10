import React, { useState } from 'react';

interface Blank {
  id: string;
  answer: string;
}

interface FillBlanksQuestionProps {
  text: string;
  blanks: Blank[];
  onChange: (answers: Record<string, string>) => void;
  disabled?: boolean;
}

export const FillBlanksQuestion: React.FC<FillBlanksQuestionProps> = ({
  text,
  // blanks,
  onChange,
  disabled = false,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    if (disabled) return;
    const newAnswers = { ...answers, [id]: value };
    setAnswers(newAnswers);
    onChange(newAnswers);
  };

  const parts = text.split(/___(\d+)___/);

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
        {parts.map((part, index) => {
          const blankId = part.match(/^\d+$/)?.[0];
          if (blankId) {
            return (
              <input
                key={index}
                type="text"
                value={answers[blankId] || ''}
                onChange={(e) => handleChange(blankId, e.target.value)}
                disabled={disabled}
                className={`mx-1 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-32 ${
                  disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
                }`}
                placeholder={`Blank ${blankId}`}
              />
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    </div>
  );
};