import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { X, Download, Filter, RefreshCw, BarChart2, AlertCircle, Calendar, ChevronDown } from 'lucide-react';

interface CodeComplexityDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: string;
}

const CodeComplexityDashboard: React.FC<CodeComplexityDashboardProps> = ({ isOpen, onClose, questionId }) => {
  interface EvaluationData {
    id: number;
    submissionId: string;
    timestamp: string;
    date: Date;
    cognitiveComplexity: number;
    cyclomaticComplexity: number;
    maintainabilityIndex: number;
    weightedComplexity: number;
    overallScore: number;
    status: string;
    interpretation: string;
    recommendations: string[];
  }

  const [evaluationData, setEvaluationData] = useState<EvaluationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);
  const pollIntervalRef = useRef(null);

  const getQualityStatus = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 50) return 'Moderate';
    return 'Low';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return '#10B981'; // emerald-500
      case 'Good': return '#3B82F6'; // blue-500
      case 'Moderate': return '#F59E0B'; // amber-500
      case 'Low': return '#EF4444'; // red-500
      default: return '#A1A1AA'; // gray-400
    }
  };

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

  useEffect(() => {
    let isMounted = true;
    let socket: WebSocket;

    const fetchData = async () => {
      if (!questionId) return;

      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/CodeSubmissions/question/${questionId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch evaluation data');
        }

        let data = await response.json();
        if (!Array.isArray(data)) {
          data = [data];
        }

        // Define the type for the incoming data item
        interface RawSubmission {
          _id: string;
          submittedAt: string;
          evaluationResult?: {
            metrics?: {
              cognitive_complexity?: { value: number };
              cyclomatic_complexity?: { value: number };
              maintainability_index?: { value: number };
              weighted_complexity?: { value: number };
            };
            overall_Complexity_score?: number;
            interpretation?: {
              overall?: string;
              recommendations?: string[];
            };
          };
        }

        // Format data for visualization
        const formattedData = data.map((item: RawSubmission, index: number) => {
          const result = item.evaluationResult || {};
          const metrics = result.metrics || {};

          return {
            id: index + 1,
            submissionId: item._id,
            timestamp: new Date(item.submittedAt).toLocaleString(),
            date: new Date(item.submittedAt),
            cognitiveComplexity: metrics.cognitive_complexity?.value || 0,
            cyclomaticComplexity: metrics.cyclomatic_complexity?.value || 0,
            maintainabilityIndex: metrics.maintainability_index?.value || 0,
            weightedComplexity: metrics.weighted_complexity?.value || 0,
            overallScore: result.overall_Complexity_score || 0,
            status: getQualityStatus(metrics.maintainability_index?.value || 0),
            interpretation: result.interpretation?.overall || '',
            recommendations: result.interpretation?.recommendations || []
          };
        });

        if (isMounted) {
          setEvaluationData(formattedData);
        }
      } catch (err) {
        if (isMounted) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('An unknown error occurred');
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Setup WebSocket for real-time updates
    const setupWebSocket = () => {
      try {
        socket = new WebSocket('ws://localhost:5000');

        socket.onopen = () => {
          console.log('WebSocket connected');
          setWsConnected(true);
          socket.send(JSON.stringify({ type: 'subscribe', questionId }));
        };

        socket.onmessage = (event) => {
          const message = JSON.parse(event.data);
          if (message.type === 'evaluation-update' && message.questionId === questionId) {
            fetchData();
          }
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          setWsConnected(false);
        };

        socket.onclose = () => {
          console.log('WebSocket disconnected');
          setWsConnected(false);
        };
      } catch (err) {
        console.error('WebSocket setup failed:', err);
        setWsConnected(false);
      }
    };

    setupWebSocket();

    return () => {
      isMounted = false;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [questionId, refreshKey]);

  const filteredData = () => {
    if (dateRange === 'all') return evaluationData;

    const now = new Date();
    let startDate;

    switch (dateRange) {
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        return evaluationData;
    }

    return evaluationData.filter(item => item.date >= startDate);
  };

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  const exportToCsv = () => {
    const headers = ['ID', 'Submission ID', 'Timestamp', 'Cognitive Complexity', 'Cyclomatic Complexity', 'Maintainability Index', 'Weighted Complexity', 'Overall Score', 'Status', 'Interpretation'];
    const csvData = [
      headers.join(','),
      ...evaluationData.map(row => [
        row.id,
        row.submissionId,
        row.timestamp,
        row.cognitiveComplexity,
        row.cyclomaticComplexity,
        row.maintainabilityIndex.toFixed(2),
        row.weightedComplexity.toFixed(2),
        row.overallScore.toFixed(2),
        row.status,
        `"${row.interpretation}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `code-complexity-${questionId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  // Prepare data for radar chart
  const radarData = evaluationData.length > 0 ? [
    {
      subject: 'Cognitive',
      A: evaluationData[0].cognitiveComplexity,
      fullMark: 20,
    },
    {
      subject: 'Cyclomatic',
      A: evaluationData[0].cyclomaticComplexity,
      fullMark: 20,
    },
    {
      subject: 'Maintainability',
      A: evaluationData[0].maintainabilityIndex > 100 ? 100 : evaluationData[0].maintainabilityIndex,
      fullMark: 100,
    },
    {
      subject: 'Weighted',
      A: evaluationData[0].weightedComplexity,
      fullMark: 25,
    },
    {
      subject: 'Overall',
      A: evaluationData[0].overallScore,
      fullMark: 100,
    },
  ] : [];

  // Prepare status distribution for pie chart
  const statusDistribution = [
    { name: 'Excellent', value: evaluationData.filter(d => d.status === 'Excellent').length },
    { name: 'Good', value: evaluationData.filter(d => d.status === 'Good').length },
    { name: 'Moderate', value: evaluationData.filter(d => d.status === 'Moderate').length },
    { name: 'Low', value: evaluationData.filter(d => d.status === 'Low').length }
  ];

  return (
    <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <BarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Code Complexity Analysis</h2>
            {wsConnected ? (
              <span className="flex items-center text-xs text-green-600 dark:text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                Live updates
              </span>
            ) : (
              <span className="flex items-center text-xs text-yellow-600 dark:text-yellow-400">
                <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                Polling for updates
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 dark:border-gray-700 border-t-blue-500"></div>
              <p className="text-gray-500 dark:text-gray-400">Analyzing complexity data...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
              <p className="text-red-500 font-medium mb-2">Unable to load analysis data</p>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : evaluationData.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="w-12 h-12 text-blue-500 mb-3" />
              <p className="text-blue-500 font-medium mb-2">No complexity data available</p>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Submit your code to generate complexity analysis and visualizations.
              </p>
            </div>
          ) : (
            <div className="p-6">
              {/* Controls Bar */}
              <div className="flex flex-wrap gap-4 items-center justify-between mb-6 sticky top-0 z-10">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value)}
                      className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-10 py-2 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    >
                      <option value="all">All Time</option>
                      <option value="day">Last 24 Hours</option>
                      <option value="week">Last Week</option>
                      <option value="month">Last Month</option>
                    </select>
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <button
                    onClick={handleRefresh}
                    className="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </button>
                </div>
                <button
                  onClick={exportToCsv}
                  className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Cognitive Complexity</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${evaluationData[0].cognitiveComplexity > 15 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      evaluationData[0].cognitiveComplexity > 10 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {evaluationData[0].cognitiveComplexity > 15 ? 'Critical' :
                        evaluationData[0].cognitiveComplexity > 10 ? 'High' : 'Good'}
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2">{evaluationData[0].cognitiveComplexity}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Optimal: 1-5 | Scale: 1-15+
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Cyclomatic Complexity</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${evaluationData[0].cyclomaticComplexity > 20 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      evaluationData[0].cyclomaticComplexity > 10 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {evaluationData[0].cyclomaticComplexity > 20 ? 'Critical' :
                        evaluationData[0].cyclomaticComplexity > 10 ? 'High' : 'Good'}
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2">{evaluationData[0].cyclomaticComplexity}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Optimal: 1-5 | Scale: 1-20+
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Maintainability Index</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${evaluationData[0].maintainabilityIndex < 50 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      evaluationData[0].maintainabilityIndex < 65 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {evaluationData[0].maintainabilityIndex < 50 ? 'Low' :
                        evaluationData[0].maintainabilityIndex < 65 ? 'Moderate' : 'Excellent'}
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2">{evaluationData[0].maintainabilityIndex.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Optimal: 85-100 | Scale: 0-100
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Score</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${evaluationData[0].overallScore < 50 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      evaluationData[0].overallScore < 65 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}`}>
                      {evaluationData[0].overallScore < 50 ? 'Low' :
                        evaluationData[0].overallScore < 65 ? 'Moderate' : 'Good'}
                    </div>
                  </div>
                  <p className="text-2xl font-bold mt-2">{evaluationData[0].overallScore.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Scale: 0-100
                  </p>
                </div>
              </div>

              {/* Interpretation and Recommendations */}
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Code Quality Interpretation</h3>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg mb-4">
                  <p className="text-blue-800 dark:text-blue-200">{evaluationData[0].interpretation}</p>
                </div>

                <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">Recommendations</h4>
                <ul className="space-y-2">
                  {evaluationData[0].recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 mt-0.5 mr-2 text-blue-500 dark:text-blue-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Radar Chart for all metrics */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Code Metrics Overview</h3>
                    <div className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium px-2 py-1 rounded-full">Radar</div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="Metrics" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Quality Status Distribution</h3>
                    <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full">Distribution</div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                          formatter={(value) => [value, 'Submissions']}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Detailed Data Table */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">Submission Details</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cognitive</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cyclomatic</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Maintainability</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Weighted</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Overall Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredData().map((row) => (
                        <tr key={row.submissionId} className="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">{row.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.timestamp}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.cognitiveComplexity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.cyclomaticComplexity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.maintainabilityIndex.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.weightedComplexity.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                                <div
                                  className="h-2 rounded-full"
                                  style={{
                                    width: `${row.overallScore}%`,
                                    backgroundColor: getStatusColor(row.status)
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium" style={{ color: getStatusColor(row.status) }}>
                                {row.overallScore.toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: getStatusColor(row.status) + '20',
                                color: getStatusColor(row.status)
                              }}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeComplexityDashboard;