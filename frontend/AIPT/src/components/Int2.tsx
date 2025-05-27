import React, { useState, useEffect } from 'react';

const SpaceGameLevelMap = () => {
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const levels = [
    { id: 1, x: 10, y: 50, color: 'bg-purple-600' },
    { id: 2, x: 20, y: 55, color: 'bg-blue-600' },
    { id: 3, x: 30, y: 45, color: 'bg-cyan-500' },
    { id: 4, x: 40, y: 50, color: 'bg-indigo-600' },
    { id: 5, x: 50, y: 60, color: 'bg-blue-600' },
    { id: 6, x: 60, y: 50, color: 'bg-cyan-500' },
    { id: 7, x: 70, y: 40, color: 'bg-indigo-600' },
    { id: 8, x: 80, y: 50, color: 'bg-blue-600' },
    { id: 9, x: 85, y: 60, color: 'bg-cyan-500' },
    { id: 10, x: 90, y: 45, color: 'bg-purple-600' },
  ];

  const paths = [
    "M10,50 L20,55",
    "M20,55 L30,45",
    "M30,45 L40,50",
    "M40,50 L50,60",
    "M50,60 L60,50",
    "M60,50 L70,40",
    "M70,40 L80,50",
    "M80,50 L85,60",
    "M85,60 L90,45"
  ];

  const handleLevelClick = (levelId: number) => {
    alert(`Launching mission ${levelId}!`);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    const audioElement = document.getElementById('background-music') as HTMLAudioElement;
    if (audioElement) {
      if (isMuted) {
        audioElement.play();
      } else {
        audioElement.pause();
      }
    }
  };

  useEffect(() => {
    const audioElement = document.getElementById('background-music') as HTMLAudioElement;
    if (audioElement) {
      audioElement.volume = 0.9; 
      
      const handleFirstInteraction = () => {
        if (!isMuted) {
          audioElement.play().catch((e: DOMException) => console.log("Autoplay prevented:", e));
        }
        document.removeEventListener('click', handleFirstInteraction);
      };
      
      document.addEventListener('click', handleFirstInteraction);
      
      return () => {
        document.removeEventListener('click', handleFirstInteraction);
        audioElement.pause();
      };
    }
  }, []);

  return (
    <div className="relative w-full h-screen max-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-black to-purple-900"></div>
    
      {[...Array(100)].map((_, i) => (
        <div 
          key={`star-${i}`} 
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{ 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.8 + 0.2,
            animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`
          }}
        ></div>
      ))}

      <audio id="background-music" loop>
        <source src="https://cdnjs.cloudflare.com/ajax/libs/ionicons/5.5.2/mp3/game-music.mp3#" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      
      <button 
        className="absolute top-4 right-4 w-12 h-12 bg-gray-800 rounded-full shadow-lg flex items-center justify-center z-10 border border-purple-500"
        onClick={toggleMute}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        )}
      </button>

      <div className="relative w-full h-full">

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="bg-indigo-800 rounded-md px-6 py-1 text-cyan-300 text-lg font-bold shadow-md border border-cyan-500">
            Wonna Play Game 🚀
          </div>
        </div>
        
        {/* Space objects - planets and asteroids */}
        <div className="absolute right-12 top-12 w-16 h-16 bg-purple-700 rounded-full shadow-md opacity-80"></div>
        <div className="absolute left-16 top-16 w-20 h-20 bg-blue-800 rounded-full shadow-md opacity-80 border border-blue-400"></div>
        <div className="absolute right-32 bottom-16 w-14 h-14 bg-cyan-700 rounded-full shadow-md opacity-80"></div>
        <div className="absolute left-32 bottom-20 w-12 h-12 bg-gray-700 rounded-full shadow-md opacity-80"></div>
        

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {paths.map((path, index) => (
            <path
              key={index}
              d={path}
              stroke="rgba(100, 149, 237, 0.6)"
              strokeWidth="3"
              strokeDasharray="2,1"
              fill="none"
            />
          ))}
        </svg>
        
        <div className="absolute top-40 right-16 transform -translate-x-1/2">
          <div className="w-16 h-12 bg-gray-800 rounded-md border border-blue-500 rotate-12 relative">
            {/* Solar panels */}
            <div className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 w-6 h-2 bg-blue-400 border border-blue-300"></div>
            <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 w-6 h-2 bg-blue-400 border border-blue-300"></div>
            {/* Central light */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="absolute top-50 left-4">
          <div className="w-10 h-16 bg-gray-300 rounded-t-full relative">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-4 bg-red-500 rounded-b-md">
              {/* Rocket flames */}
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-orange-500 rounded-b-md"></div>
              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-yellow-500 rounded-b-md"></div>
            </div>
            {/* Window */}
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-cyan-300 rounded-full border-2 border-gray-700"></div>
          </div>
        </div>

        <div className="absolute bottom-16 right-24">
          <div className="w-12 h-14 bg-green-600 rounded-t-full flex items-center justify-center relative">
            {/* Alien eyes */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-black rounded-full"></div>
            <div className="absolute top-2 right-2 w-3 h-3 bg-black rounded-full"></div>
            {/* Alien antennae */}
            <div className="absolute -top-4 left-1/3 w-1 h-4 bg-green-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full absolute -top-1"></div>
            </div>
            <div className="absolute -top-3 right-1/3 w-1 h-3 bg-green-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full absolute -top-1"></div>
            </div>
          </div>
        </div>

        {levels.map((level) => (
          <div
            key={level.id}
            className={`absolute cursor-pointer transition-transform duration-200 ${
              hoveredLevel === level.id ? 'scale-110' : 'scale-100'
            }`}
            style={{ left: `${level.x}%`, top: `${level.y}%` }}
            onClick={() => handleLevelClick(level.id)}
            onMouseEnter={() => setHoveredLevel(level.id)}
            onMouseLeave={() => setHoveredLevel(null)}
          >
            <div className={`w-12 h-12 ${level.color} rounded-full flex items-center justify-center shadow-lg border border-cyan-300`}>
              <span className="text-white text-xl font-bold">{level.id}</span>
            </div>
            {/* Planet rings for some levels */}
            {level.id % 3 === 0 && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-4 border border-cyan-200 rounded-full rotate-12 -z-10"></div>
            )}
          </div>
        ))}

        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/2 w-3 h-3 bg-pink-300 rounded-full animate-pulse"></div>

        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="absolute"
            style={{ 
              left: `${Math.random() * 90 + 5}%`, 
              top: `${Math.random() * 90 + 5}%`
            }}
          >
            <div className="w-3 h-3 bg-gray-400 rounded-sm rotate-45"></div>
          </div>
        ))}

        {[...Array(5)].map((_, i) => (
          <div 
            key={`nebula-${i}`}
            className="absolute w-24 h-24 rounded-full opacity-20"
            style={{ 
              left: `${Math.random() * 80}%`, 
              top: `${Math.random() * 80}%`,
              backgroundColor: ['#8B5CF6', '#0EA5E9', '#0891B2', '#7C3AED', '#4F46E5'][Math.floor(Math.random() * 5)],
              filter: 'blur(8px)'
            }}
          ></div>
        ))}

        {[...Array(3)].map((_, i) => (
          <div 
            key={`ufo-${i}`}
            className="absolute"
            style={{ 
              left: `${Math.random() * 90 + 5}%`, 
              top: `${Math.random() * 90 + 5}%`,
            }}
          >
            <div className="w-8 h-3 bg-gray-400 rounded-full relative">
              <div className="w-4 h-2 bg-cyan-400 rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="w-6 h-1 bg-gray-600 absolute -bottom-1 left-1/2 transform -translate-x-1/2 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpaceGameLevelMap;