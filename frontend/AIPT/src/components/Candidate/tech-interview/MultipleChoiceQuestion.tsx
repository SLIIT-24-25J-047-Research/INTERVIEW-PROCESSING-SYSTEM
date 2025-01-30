import React, { useState } from 'react';

interface MultipleChoiceQuestionProps {
  options: string[];
  onChange: (selectedIndex: number) => void;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  options,
  onChange,
}) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelected(index);
    onChange(index);
  };

  return (
    <div className="space-y-4">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleSelect(index)}
          className={`w-full p-4 text-left rounded-lg border transition-all ${
            selected === index
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selected === index
                  ? 'border-blue-500'
                  : 'border-gray-300'
              }`}
            >
              {selected === index && (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              )}
            </div>
            <span>{option}</span>
          </div>
        </button>
      ))}
    </div>
  );
};