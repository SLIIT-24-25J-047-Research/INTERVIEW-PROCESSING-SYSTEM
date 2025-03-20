import React, { useState } from 'react';
import { Upload, X, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from "../../../lib/Utils";

interface FileUploadAreaProps {
  onFileSelect: (file: File | null) => void;
  file: File | null;
  acceptedFileTypes?: string;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  onFileSelect,
  file,
  acceptedFileTypes = ".pdf,.doc,.docx"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startUpload(e.dataTransfer.files[0]);
    }
  };

  const startUpload = (selectedFile: File) => {
    onFileSelect(selectedFile);
    setIsUploading(true);
    setIsUploaded(false);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsUploaded(true);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-gray-200",
          file ? "bg-gray-50" : "bg-white"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file ? (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept={acceptedFileTypes}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      startUpload(e.target.files[0]);
                    }
                  }}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">PDF, DOC, or DOCX up to 10MB</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 shrink-0 rounded-md bg-gray-100 flex items-center justify-center">
                  <span className="text-xs font-medium uppercase text-gray-500">
                    {file.name.split('.').pop()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => {
                  onFileSelect(null);
                  setIsUploading(false);
                  setIsUploaded(false);
                  setUploadProgress(null);
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {isUploading && (
              <div className="flex items-center space-x-2">
                <Loader2 className="animate-spin text-primary" />
                <p className="text-sm text-primary">Uploading...</p>
              </div>
            )}
            {uploadProgress !== null && uploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            {isUploaded && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <p className="text-sm">Upload complete!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
