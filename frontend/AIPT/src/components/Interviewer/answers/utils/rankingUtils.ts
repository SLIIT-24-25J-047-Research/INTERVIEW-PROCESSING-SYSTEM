import { Candidate, Job, RankingCriteria } from '../types';

/**
 * Groups results by job ID
 */
export const groupResultsByJobId = (
  technicalResults: any[],
  nonTechnicalResults: any[]
): Job[] => {
  const jobMap = new Map<string, Job>();

  // Process technical results
  technicalResults.forEach((result) => {
    const jobId = result.jobId.$oid;
    const userId = result.userId.$oid;

    if (!jobMap.has(jobId)) {
      jobMap.set(jobId, {
        jobId,
        candidates: [],
      });
    }

    const job = jobMap.get(jobId)!;
    let candidate = job.candidates.find((c) => c.userId === userId);

    if (!candidate) {
      candidate = {
        userId,
        technicalResult: result,
        overallScore: calculateOverallScore(result, null),
        stressLevel: result.sttresslevel || 'normal',
      };
      job.candidates.push(candidate);
    } else {
      candidate.technicalResult = result;
      candidate.overallScore = calculateOverallScore(result, candidate.nonTechnicalResult);
      candidate.stressLevel = result.sttresslevel || candidate.stressLevel || 'normal';
    }
  });

  // Process non-technical results
  nonTechnicalResults.forEach((result) => {
    const jobId = result.jobId.$oid;
    const userId = result.userId;

    if (!jobMap.has(jobId)) {
      jobMap.set(jobId, {
        jobId,
        candidates: [],
      });
    }

    const job = jobMap.get(jobId)!;
    let candidate = job.candidates.find((c) => c.userId === userId);

    if (!candidate) {
      candidate = {
        userId,
        nonTechnicalResult: result,
        overallScore: calculateOverallScore(null, result),
        confidenceLevel: getConfidenceLevel(result),
        stressLevel: result.sttresslevel || 'normal',
      };
      job.candidates.push(candidate);
    } else {
      candidate.nonTechnicalResult = result;
      candidate.overallScore = calculateOverallScore(candidate.technicalResult, result);
      candidate.confidenceLevel = getConfidenceLevel(result);
      candidate.stressLevel = result.sttresslevel || candidate.stressLevel || 'normal';
    }
  });

  return Array.from(jobMap.values());
};

/**
 * Calculates overall score based on technical and non-technical results
 */
const calculateOverallScore = (
  technicalResult: any | null,
  nonTechnicalResult: any | null
): number => {
  let score = 0;
  let maxScore = 0;

  if (technicalResult) {
    score += technicalResult.totalScore || 0;
    maxScore += technicalResult.maxPossibleScore || 0;
  }

  if (nonTechnicalResult) {
    // Calculate score from non-technical responses if available
    const nonTechScore = nonTechnicalResult.responses?.reduce(
      (acc: number, response: any) => acc + (response.marks || 0),
      0
    ) || 0;
    score += nonTechScore;
    
    // Assuming each non-technical question has a max score of 10
    const nonTechMaxScore = nonTechnicalResult.responses?.length * 10 || 0;
    maxScore += nonTechMaxScore;
  }

  // Return percentage if maxScore is available, otherwise raw score
  return maxScore > 0 ? (score / maxScore) * 100 : score;
};

/**
 * Gets confidence level from non-technical results
 */
const getConfidenceLevel = (nonTechnicalResult: any): string => {
  if (!nonTechnicalResult || !nonTechnicalResult.responses) return 'medium';

  // Check for confidence prediction in the first response
  const firstResponse = nonTechnicalResult.responses[0];
  return firstResponse?.prediction || 'medium';
};

/**
 * Ranks candidates based on specified criteria
 */
export const rankCandidates = (
  job: Job,
  criteria: RankingCriteria
): Job => {
  const rankedCandidates = [...job.candidates].sort((a, b) => {
    switch (criteria) {
      case 'score':
        return (b.overallScore || 0) - (a.overallScore || 0);
      
      case 'stress': {
        // Lower stress is better
        const stressOrder = { low: 3, normal: 2, high: 1 };
        const aStress = stressOrder[a.stressLevel as keyof typeof stressOrder] || 2;
        const bStress = stressOrder[b.stressLevel as keyof typeof stressOrder] || 2;
        return bStress - aStress;
      }
      case 'confidence': {
        // Higher confidence is better
        const confidenceOrder = { confident: 3, medium: 2, nervous: 1 };
        const aConfidence = confidenceOrder[a.confidenceLevel as keyof typeof confidenceOrder] || 2;
        const bConfidence = confidenceOrder[b.confidenceLevel as keyof typeof confidenceOrder] || 2;
        return bConfidence - aConfidence;
      }
      default:
        return (b.overallScore || 0) - (a.overallScore || 0);
    }
  });

  return {
    ...job,
    candidates: rankedCandidates,
  };
};