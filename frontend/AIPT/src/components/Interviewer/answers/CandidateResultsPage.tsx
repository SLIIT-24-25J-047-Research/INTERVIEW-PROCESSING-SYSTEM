import React, { useState, useEffect } from 'react';
import JobResultsCard from './data/JobResultsCard';
import RankingControls from './data/RankingControls';
import { Job, RankingCriteria } from './types';
import { groupResultsByJobId } from './utils/rankingUtils';

// Sample data - in a real app, this would come from an API
import mockTechnicalResults from './data/technicalResults';
import mockNonTechnicalResults from './data/nonTechnicalResults';

function CandidateResultsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [rankingCriteria, setRankingCriteria] = useState<RankingCriteria>('score');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from an API
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, fetch from your API here
        // const technicalResponse = await fetch('/api/technical-results');
        // const technicalResults = await technicalResponse.json();
        // const nonTechnicalResponse = await fetch('/api/non-technical-results');
        // const nonTechnicalResults = await nonTechnicalResponse.json();
        
        // Using mock data for demonstration
        const technicalResults = mockTechnicalResults;
        const nonTechnicalResults = mockNonTechnicalResults;
        
        // Group and organize the results
        const groupedJobs = groupResultsByJobId(technicalResults, nonTechnicalResults);
        setJobs(groupedJobs);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Interview Results Dashboard</h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ranking Controls */}
        <RankingControls 
          currentCriteria={rankingCriteria}
          onChangeCriteria={setRankingCriteria}
        />
        
        {/* Results Section */}
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-6">
              {jobs.map((job) => (
                <JobResultsCard 
                  key={job.jobId}
                  job={job}
                  rankingCriteria={rankingCriteria}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-lg text-gray-600">No interview results found.</p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Interview Results Dashboard
          </p>
        </div>
      </footer>
    </div>
  );
}

export default CandidateResultsPage;