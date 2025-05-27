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
  onSkillValidation: (isValid: boolean, errorMessage?: string) => void; // Callback for skill validation
}

const FileSkillExtractor: React.FC<FileSkillExtractorProps> = ({ 
  filePath, 
  fileId, 
  jobId, 
  userId, 
  onSkillValidation 
}) => {
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
        onSkillValidation(false, "Unsupported file format. Please use a PDF or DOCX file.");
      }
    } catch (error) {
      console.error("Error loading file:", error);
      onSkillValidation(false, "Error loading file. Please try again.");
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
          extractedText += textContent.items.map((item) => ('str' in item ? item.str : '')).join(" ") + " ";
          extractedText += textContent.items.map((item) => ('str' in item ? item.str : '')).join(" ") + " ";
        }

        await validateSkillsWithJobRequirements(extractedText);
      } catch (error) {
        console.error("Error extracting text from PDF:", error);
        onSkillValidation(false, "Error processing PDF file. Please try again.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const extractTextFromDocx = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const result = await mammoth.extractRawText({ arrayBuffer: event.target?.result as ArrayBuffer });
        await validateSkillsWithJobRequirements(result.value);
      } catch (error) {
        console.error("Error extracting text from DOCX:", error);
        onSkillValidation(false, "Error processing DOCX file. Please try again.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const validateSkillsWithJobRequirements = async (cvText: string) => {
    try {
      // Fetch job requirements from the backend
      const jobResponse = await axios.get(`http://localhost:5000/api/jobs/${jobId}`);
      const jobData = jobResponse.data;
      
      if (!jobData || !jobData.requirements || !Array.isArray(jobData.requirements)) {
        onSkillValidation(false, "Unable to fetch job requirements. No Requirements, Please try again.");
        return;
      }

      // Parse job requirements - handle the nested array structure
      let jobRequirements: string[] = [];
      
      // Check if requirements is an array of strings or contains nested arrays
      if (jobData.requirements.length > 0) {
        if (typeof jobData.requirements[0] === 'string') {
          // If it's a string that contains comma-separated values with quotes
          const requirementsString = jobData.requirements[0];
          // Remove quotes and split by comma
          jobRequirements = requirementsString
            .replace(/"/g, '') // Remove all quotes
            .split(',')
            .map((skill: string) => skill.trim())
            .filter((skill: string) => skill.length > 0);
        } else {
          // If it's already an array of individual requirements
          jobRequirements = jobData.requirements.flat();
        }
      }

      console.log("Job Requirements:", jobRequirements);

      // Extract skills from CV text that match job requirements only
      const matchingSkills = jobRequirements.filter(requirement => 
        cvText.toLowerCase().includes(requirement.toLowerCase())
      );

      console.log("Matching Skills found in CV:", matchingSkills);

      // Check if candidate has at least 5 matching skills
      if (matchingSkills.length < 5) {
        const missingSkills = jobRequirements.filter(req => 
          !cvText.toLowerCase().includes(req.toLowerCase())
        );
        
        const errorMessage = `Your CV contains only ${matchingSkills.length} skills that match with job requirements. You need at least 5 matching skills to apply for this position. Missing skills from job requirements: ${missingSkills.join(', ')}.`;
        
        onSkillValidation(false, errorMessage);
        return;
      }

      // If validation passes, save only the matching skills to backend
      await saveMatchingSkillsToBackend(matchingSkills);
      onSkillValidation(true);

    } catch (error) {
      console.error("Error validating skills:", error);
      onSkillValidation(false, "Error validating skills against job requirements. Please try again.");
    }
  };
  
  const saveMatchingSkillsToBackend = async (matchingSkills: string[]) => {
    try {
      const response = await axios.post("http://localhost:5000/api/cv-skills/save-skills", {
        fileId, // Use the fileId passed as a prop
        jobId, // Use the jobId passed as a prop
        userId, // Use the userId passed as a prop
        skills: matchingSkills, // Save only matching skills
      });

      console.log("Matching skills saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving matching skills:", error);
      throw error; // Re-throw to handle in the calling function
    }
  };

  return null; // No UI elements, just processing
};

export default FileSkillExtractor;