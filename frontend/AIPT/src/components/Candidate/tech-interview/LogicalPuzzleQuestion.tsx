import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';

interface LogicalPuzzleQuestionProps {
  initialState: string;
  goalState: string;
  rules: string[];
  onChange: (code: string) => void;
  disabled?: boolean;
}

export const LogicalPuzzleQuestion: React.FC<LogicalPuzzleQuestionProps> = ({
  initialState,
  goalState,
  rules,
  onChange,
  disabled = false,
}) => {
  // Parse JSON strings safely
  const parsedInitialState = React.useMemo(() => {
    try {
      return JSON.parse(initialState);
    } catch {
      return initialState;
    }
  }, [initialState]);

  const parsedGoalState = React.useMemo(() => {
    try {
      return JSON.parse(goalState);
    } catch {
      return goalState;
    }
  }, [goalState]);

  const [code, setCode] = useState(`// Puzzle Configuration
const initialState = ${JSON.stringify(parsedInitialState, null, 2)};
const goalState = ${JSON.stringify(parsedGoalState, null, 2)};

function solvePuzzle(initial, goal) {
  // Your solution here
  // Return the sequence of steps to reach the goal state
  return [];
}

// Example usage:
const solution = solvePuzzle(initialState, goalState);
console.log('Solution steps:', solution);
`);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onChange(newCode);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Initial State:</h3>
          <pre className="text-sm bg-white p-2 rounded border overflow-x-auto">
            {JSON.stringify(parsedInitialState, null, 2)}
          </pre>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Goal State:</h3>
          <pre className="text-sm bg-white p-2 rounded border overflow-x-auto">
            {JSON.stringify(parsedGoalState, null, 2)}
          </pre>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Rules:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {rules.map((rule, index) => (
              <li key={index} className="text-sm text-gray-600">{rule}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <CodeEditor
          language="javascript"
          code={code}
          onChange={handleCodeChange}
          readOnly={disabled}
        />
      </div>
    </div>
  );
};