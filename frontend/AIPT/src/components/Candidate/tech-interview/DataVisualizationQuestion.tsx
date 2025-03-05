import React, { useState, useEffect, useRef } from 'react';
import { CodeEditor } from './CodeEditor';

interface DataVisualizationQuestionProps {
  dataset: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

export const DataVisualizationQuestion: React.FC<DataVisualizationQuestionProps> = ({
  dataset,
  onChange,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [code, setCode] = useState(`// Use this data to create your visualization
const dataset = ${dataset};

function createVisualization() {
  const canvas = document.getElementById('visualizationCanvas');
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear the canvas
  ctx.clearRect(0, 0, width, height);
  
  // Set up the chart dimensions
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  
  // Calculate the maximum value for scaling
  const maxSales = Math.max(...dataset.sales);
  const barWidth = chartWidth / dataset.months.length;
  
  // Draw bars
  dataset.months.forEach((month, i) => {
    const barHeight = (dataset.sales[i] / maxSales) * chartHeight;
    const x = padding + i * barWidth;
    const y = height - padding - barHeight;
    
    // Draw bar
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(x, y, barWidth - 10, barHeight);
    
    // Draw month label
    ctx.fillStyle = '#1f2937';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(month, x + barWidth/2, height - padding + 20);
    
    // Draw value label
    ctx.fillText(dataset.sales[i].toLocaleString(), x + barWidth/2, y - 10);
  });
  
  // Draw axes
  ctx.strokeStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
}

// Initial render
createVisualization();
`);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onChange(newCode);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || disabled) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    try {
      // Execute the user's code in a safe context
      const visualizationCode = new Function(code);
      visualizationCode();
    } catch (error) {
      console.error('Error in visualization code:', error);
    }
  }, [code, disabled]);

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Dataset:</h3>
        <pre className="text-sm overflow-x-auto">{dataset}</pre>
      </div>
      <canvas
        ref={canvasRef}
        id="visualizationCanvas"
        className="w-full h-64 bg-white border border-gray-200 rounded-lg"
      />
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