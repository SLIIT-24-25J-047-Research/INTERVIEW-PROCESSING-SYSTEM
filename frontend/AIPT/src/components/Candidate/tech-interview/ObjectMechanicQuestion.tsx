import React, { useState, useEffect, useRef } from 'react';
import { CodeEditor } from './CodeEditor';

interface ObjectMechanicQuestionProps {
  worldConfig: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

export const ObjectMechanicQuestion: React.FC<ObjectMechanicQuestionProps> = ({
  worldConfig,
  onChange,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [code, setCode] = useState(`// World configuration
const world = ${worldConfig};

class Ball {
  constructor(x, y, radius, vx, vy) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vx = vx;
    this.vy = vy;
  }

  update() {
    // Apply gravity
    this.vy += world.physics.gravity;
    
    // Update position
    this.x += this.vx;
    this.y += this.vy;
    
    // Apply friction
    this.vx *= world.physics.friction;
    this.vy *= world.physics.friction;
    
    // Handle collisions with canvas boundaries
    if (this.y + this.radius > world.canvas.height) {
      this.y = world.canvas.height - this.radius;
      this.vy = -this.vy * world.physics.bounce;
    }
    
    if (this.x + this.radius > world.canvas.width) {
      this.x = world.canvas.width - this.radius;
      this.vx = -this.vx * world.physics.bounce;
    }
    
    if (this.x - this.radius < 0) {
      this.x = this.radius;
      this.vx = -this.vx * world.physics.bounce;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
    ctx.closePath();
  }
}

// Create ball instance
const ball = new Ball(
  world.ball.initialPosition.x,
  world.ball.initialPosition.y,
  world.ball.radius,
  world.ball.initialVelocity.x,
  world.ball.initialVelocity.y
);

function gameLoop() {
  const canvas = document.getElementById('mechanicsCanvas');
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
  
  // Update and draw ball
  ball.update();
  ball.draw(ctx);
  
  // Continue the game loop
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
`);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onChange(newCode);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || disabled) return;

    canvas.width = 800;
    canvas.height = 400;

    try {
      // Execute the code in a safe context hihi
      const gameCode = new Function(code);
      gameCode();
    } catch (error) {
      console.error('Error in game code:', error);
    }
  }, [code, disabled]);

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">World Configuration:</h3>
        <pre className="text-sm overflow-x-auto">{worldConfig}</pre>
      </div>
      <canvas
        ref={canvasRef}
        id="mechanicsCanvas"
        className="w-full bg-white border border-gray-200 rounded-lg"
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