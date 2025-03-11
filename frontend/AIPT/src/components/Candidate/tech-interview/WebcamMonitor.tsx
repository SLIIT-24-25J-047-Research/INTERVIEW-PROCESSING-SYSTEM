import React, { useEffect, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, CameraOff } from 'lucide-react';
import { useInterviewStore } from '../../store/InterviewStore';

interface WebcamMonitorProps {
  questionId: string;
}

export const WebcamMonitor: React.FC<WebcamMonitorProps> = ({ questionId }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isEnabled, setIsEnabled] = React.useState(true);
  const { sendWebcamSnapshot } = useInterviewStore();

  const captureSnapshot = useCallback(() => {
    if (!webcamRef.current || !isEnabled) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      sendWebcamSnapshot(questionId, imageSrc);
    }
  }, [questionId, isEnabled, sendWebcamSnapshot]);

  useEffect(() => {
    if (!isEnabled) return;

    // Take snapshots every 30 seconds
    const interval = setInterval(captureSnapshot, 30000);
    
    // Take initial snapshot when question loads
    captureSnapshot();

    return () => {
      clearInterval(interval);
    };
  }, [captureSnapshot, isEnabled]);

  return (
    <div className="fixed bottom-4 right-4">
      <div className="relative">
        {isEnabled ? (
          <div className="relative">
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
              style={{ width: '160px', height: '120px' }}
            />
            <button
              onClick={() => setIsEnabled(false)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Disable camera"
            >
              <CameraOff className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEnabled(true)}
            className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Camera className="w-5 h-5" />
            <span>Enable Camera</span>
          </button>
        )}
      </div>
    </div>
  );
};