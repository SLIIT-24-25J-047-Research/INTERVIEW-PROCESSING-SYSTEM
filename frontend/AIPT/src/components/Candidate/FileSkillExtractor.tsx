import React, { useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import axios from "axios";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

interface FileSkillExtractorProps {
  filePath: string;
  fileId: string; // Add fileId as a prop
  jobId: string; // Add jobId as a prop
  userId: string; // Add userId as a prop
}

const FileSkillExtractor: React.FC<FileSkillExtractorProps> = ({ filePath, fileId, jobId, userId }) => {
  useEffect(() => {
    if (filePath) {
      loadFile(filePath);
    }
  }, [filePath]);

  const loadFile = async (path: string) => {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const fileType = path.split(".").pop()?.toLowerCase();
      const file = new File([blob], "file." + fileType, { type: blob.type });

      if (blob.type.includes("pdf") || fileType === "pdf") {
        extractTextFromPDF(file);
      } else if (blob.type.includes("word") || fileType === "docx") {
        extractTextFromDocx(file);
      } else {
        console.error("Unsupported file format. Please use a PDF or DOCX file.");
      }
    } catch (error) {
      console.error("Error loading file:", error);
    }
  };

  const extractTextFromPDF = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          extractedText += textContent.items.map((item: any) => item.str).join(" ") + " ";
        }

        const skills = extractSkills(extractedText);
        saveSkillsToBackend(skills);
      } catch (error) {
        console.error("Error extracting text from PDF:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const extractTextFromDocx = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const result = await mammoth.extractRawText({ arrayBuffer: event.target?.result as ArrayBuffer });
        const skills = extractSkills(result.value);
        saveSkillsToBackend(skills);
      } catch (error) {
        console.error("Error extracting text from DOCX:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const extractSkills = (text: string): string[] => {
    const skillsList = [
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "Django",
      "Machine Learning",
      "Data Analysis",
      "SQL",
      "Java",
      "C++",
      "HTML",
      "CSS",
      "TensorFlow",
      "Project Management",
      "MVC",
    ];

    return skillsList.filter((skill) => text.toLowerCase().includes(skill.toLowerCase()));
  };

  const saveSkillsToBackend = async (skills: string[]) => {
    try {
      const response = await axios.post("http://localhost:5000/api/cv-skills/save-skills", {
        fileId, // Use the fileId passed as a prop
        jobId, // Use the jobId passed as a prop
        userId, // Use the userId passed as a prop
        skills,
      });

      console.log("Skills saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving skills:", error);
    }
  };

  return null; // No UI elements, just processing
};

export default FileSkillExtractor;