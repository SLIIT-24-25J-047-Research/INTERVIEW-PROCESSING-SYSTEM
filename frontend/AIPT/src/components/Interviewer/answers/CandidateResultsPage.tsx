import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';

// Mock data types
interface AnswerResult {
  _id: { $oid: string };
  interviewId: { $oid: string };
  jobId: { $oid: string };
  userId: string | { $oid: string };
  responses: {
    questionId: { $oid: string };
    marks: number;
    _id: { $oid: string };
  }[];
  totalScore?: number;
  maxPossibleScore?: number;
  createdAt: { $date: string };
}

interface Candidate {
  id: string;
  userId: string;
  interviewId: string;
  jobId: string;
  technicalScore: number;
  nonTechnicalScore: number;
  totalScore: number;
  maxPossibleScore: number;
  submittedAt: Date;
}

// Mock data generator
const generateMockCandidates = (count: number): Candidate[] => {
  const candidates: Candidate[] = [];
  
  for (let i = 0; i < count; i++) {
    const techScore = Math.floor(Math.random() * 350);
    const nonTechScore = Math.floor(Math.random() * 100);
    
    candidates.push({
      id: `candidate_${i}`,
      userId: `user_${i}`,
      interviewId: `interview_${i % 3}`,
      jobId: 'job_123',
      technicalScore: techScore,
      nonTechnicalScore: nonTechScore,
      totalScore: techScore + nonTechScore,
      maxPossibleScore: 350 + 100, // Assuming max tech is 350 and non-tech is 100
      submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    });
  }
  
  return candidates;
};

const CandidateResultsPage: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Candidate; direction: 'ascending' | 'descending' }>({
    key: 'totalScore',
    direction: 'descending'
  });

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch and combine technical and non-technical results here
        // For now, we'll use mock data
        const mockData = generateMockCandidates(15);
        
        // Add some fixed data based on your examples
        mockData.push({
          id: '68357d8e2818f98bcf55a072',
          userId: '675932b49c1a60d97c147419',
          interviewId: '68357ce32818f98bcf559f81',
          jobId: '675aa4a1ea75fb1d58881897',
          technicalScore: 20,
          nonTechnicalScore: 0, // Assuming no non-technical answers in the example
          totalScore: 20,
          maxPossibleScore: 350,
          submittedAt: new Date('2025-05-27T08:53:34.179Z')
        });
        
        mockData.push({
          id: '6835cbf3252cc292f623d7ec',
          userId: 'defaultUserId',
          interviewId: '68357c332818f98bcf559f19',
          jobId: '675aa4a1ea75fb1d58881897',
          technicalScore: 0, // Assuming no technical answers in the example
          nonTechnicalScore: 0,
          totalScore: 0,
          maxPossibleScore: 100,
          submittedAt: new Date('2025-05-27T14:28:03.031Z')
        });
        
        setCandidates(mockData);
      } catch (error) {
        console.error('Error fetching candidate results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortedCandidates = React.useMemo(() => {
    const sortableItems = [...candidates];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [candidates, sortConfig]);

  const requestSort = (key: keyof Candidate) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof Candidate) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
    }
    return '';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Candidate Results
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom>
        Sorted by: {sortConfig.key} ({sortConfig.direction})
      </Typography>
      
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell onClick={() => requestSort('userId')}>
                User ID{getSortIndicator('userId')}
              </TableCell>
              <TableCell onClick={() => requestSort('technicalScore')}>
                Technical Score{getSortIndicator('technicalScore')}
              </TableCell>
              <TableCell onClick={() => requestSort('nonTechnicalScore')}>
                Non-Technical Score{getSortIndicator('nonTechnicalScore')}
              </TableCell>
              <TableCell onClick={() => requestSort('totalScore')}>
                Total Score{getSortIndicator('totalScore')}
              </TableCell>
              <TableCell onClick={() => requestSort('maxPossibleScore')}>
                Max Possible{getSortIndicator('maxPossibleScore')}
              </TableCell>
              <TableCell onClick={() => requestSort('submittedAt')}>
                Submitted At{getSortIndicator('submittedAt')}
              </TableCell>
              <TableCell>
                Percentage
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCandidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell>{candidate.userId}</TableCell>
                <TableCell>{candidate.technicalScore}</TableCell>
                <TableCell>{candidate.nonTechnicalScore}</TableCell>
                <TableCell>{candidate.totalScore}</TableCell>
                <TableCell>{candidate.maxPossibleScore}</TableCell>
                <TableCell>
                  {candidate.submittedAt.toLocaleDateString()} {candidate.submittedAt.toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  {Math.round((candidate.totalScore / candidate.maxPossibleScore) * 100)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CandidateResultsPage;