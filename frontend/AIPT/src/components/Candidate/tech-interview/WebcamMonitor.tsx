import React, { useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, CameraOff } from 'lucide-react';
import { useInterviewStore } from '../../store/InterviewStore';

interface WebcamMonitorProps {
    questionId: string;
  }


  
  export const WebcamMonitor: React.FC<WebcamMonitorProps> = ({ questionId }) => {
    const webcamRef = useRef<Webcam>(null);
    const { sendWebcamSnapshot } = useInterviewStore();
  
    const saveSnapshotLocally = (imageSrc: string) => {
      const link = document.createElement("a");
      link.href = imageSrc;
      link.download = `snapshot_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };


    const captureSnapshot = useCallback(() => {
      if (!webcamRef.current) return;
      
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        sendWebcamSnapshot(questionId, imageSrc);
        saveSnapshotLocally(imageSrc);
      }
    }, [questionId, sendWebcamSnapshot]);
  
    useEffect(() => {
      // Take snapshots every 30 seconds
      const interval = setInterval(captureSnapshot, 30000);
      
      // Take initial snapshot when question loads
      captureSnapshot();
  
      return () => {
        clearInterval(interval);
      };
    }, [captureSnapshot]);
  
    return (
      <div 
        className="fixed bottom-4 right-4 pointer-events-none"
        style={{
          zIndex: 1000,
          mixBlendMode: 'multiply',
        }}
      >
        <div className="relative group">
          <div 
            className="absolute inset-0 bg-white opacity-40 rounded-lg transition-opacity duration-300 group-hover:opacity-20"
            style={{ mixBlendMode: 'screen' }}
          />
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 160,
              height: 120,
              facingMode: "user"
            }}
            className="rounded-lg shadow-lg"
            style={{ 
              width: '160px', 
              height: '120px',
            }}
          />
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent text-white text-xs py-1 px-2 rounded-b-lg text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            Camera Active
          </div>
        </div>
      </div>
    );
  };