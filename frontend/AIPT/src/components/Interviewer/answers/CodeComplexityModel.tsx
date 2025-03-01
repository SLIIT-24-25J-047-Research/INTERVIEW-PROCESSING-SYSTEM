import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from 'recharts';
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
    cyclomatic: number;
    maintainability: number;
    coupling: number;
    qualityScore: number;
    status: string;
  }
  
  const [evaluationData, setEvaluationData] = useState<EvaluationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [wsConnected, setWsConnected] = useState(false);
const pollIntervalRef = useRef(null);


  // Status distribution for pie chart
  const [statusDistribution, setStatusDistribution] = useState([
    { name: 'Good', value: 0 },
    { name: 'Average', value: 0 },
    { name: 'Poor', value: 0 }
  ]);

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
        
        // Sort by date
        data.sort((a: { submittedAt: string }, b: { submittedAt: string }) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
        
        // Format data for visualization
        const formattedData = data.map((item: { _id: string; submittedAt: string; evaluationResult: { cyclomatic_complexity: number; maintainability_index: { maintainability_index: number }; coupling_between_classes: number; single_value: number } }, index: number) => {
          const result = item.evaluationResult || {};
          return {
            id: index + 1,
            submissionId: item._id,
            timestamp: new Date(item.submittedAt).toLocaleString(),
            date: new Date(item.submittedAt),
            cyclomatic: result.cyclomatic_complexity || 0,
            maintainability: result.maintainability_index?.maintainability_index || 0,
            coupling: result.coupling_between_classes || 0,
            qualityScore: result.single_value || 0,
            status: getQualityStatus(result.single_value || 0)
          };
        });
        
        if (isMounted) {
          setEvaluationData(formattedData);
          
         
          const distribution = [
            { name: 'Good', value: formattedData.filter((d: { status: string }) => d.status === 'Good').length },
            { name: 'Average', value: formattedData.filter((d: { status: string }) => d.status === 'Average').length },
            { name: 'Poor', value: formattedData.filter((d: { status: string }) => d.status === 'Poor').length }
          ];
          setStatusDistribution(distribution);
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
    
    //  real-time updates
    const setupWebSocket = () => {
      try {
        socket = new WebSocket('ws://localhost:5000');
        
        socket.onopen = () => {
          console.log('WebSocket connected');
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
        };
        
        socket.onclose = () => {
          console.log('WebSocket disconnected');

          const pollInterval = setInterval(() => {
            if (isMounted) {
              fetchData();
            } else {
              clearInterval(pollInterval);
            }
          }, 60000); 
        };
      } catch (err) {
        console.error('WebSocket setup failed:', err);
   
        const pollInterval = setInterval(() => {
          if (isMounted) {
            fetchData();
          } else {
            clearInterval(pollInterval);
          }
        }, 15000);
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

  const getQualityStatus = (score: number) => {
    if (score >= 80) return 'Good';
    if (score >= 50) return 'Average';
    return 'Poor';
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Good': return '#4ade80'; // green
      case 'Average': return '#facc15'; // yellow
      case 'Poor': return '#f87171'; // red
      default: return '#a1a1aa'; // gray
    }
  };
  
  const COLORS = ['#4ade80', '#facc15', '#f87171'];
  
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
    const headers = ['ID', 'Submission ID', 'Timestamp', 'Cyclomatic Complexity', 'Maintainability Index', 'Coupling', 'Quality Score', 'Status'];
    const csvData = [
      headers.join(','),
      ...evaluationData.map(row => [
        row.id,
        row.submissionId,
        row.timestamp,
        row.cyclomatic,
        row.maintainability.toFixed(2),
        row.coupling,
        row.qualityScore.toFixed(2),
        row.status
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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
              <BarChart2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Code Complexity Analysis</h2>
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
              
              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Maintainability Index Trend</h3>
                    <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium px-2 py-1 rounded-full">Trend</div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={filteredData()}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                        <XAxis 
                          dataKey="id" 
                          tick={{ fontSize: 12, fill: '#888' }}
                          axisLine={{ stroke: '#eaeaea' }}
                        />
                        <YAxis 
                          domain={[0, 100]}
                          tick={{ fontSize: 12, fill: '#888' }}
                          axisLine={{ stroke: '#eaeaea' }}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                          formatter={(value) => [typeof value === 'number' ? value.toFixed(2) : value, 'Maintainability']}
                          labelFormatter={(id) => `Submission ${id}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="maintainability" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4, fill: '#fff' }}
                          activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#3b82f6' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Cyclomatic Complexity */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Cyclomatic Complexity</h3>
                    <div className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium px-2 py-1 rounded-full">Complexity</div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredData()}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                        <XAxis 
                          dataKey="id" 
                          tick={{ fontSize: 12, fill: '#888' }}
                          axisLine={{ stroke: '#eaeaea' }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: '#888' }}
                          axisLine={{ stroke: '#eaeaea' }}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                          formatter={(value) => [value, 'Complexity']}
                          labelFormatter={(id) => `Submission ${id}`}
                        />
                        <Bar 
                          dataKey="cyclomatic" 
                          fill="#8884d8"
                          name="Cyclomatic Complexity"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
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
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Quality Score Trend */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">Overall Quality Score Trend</h3>
                    <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full">Quality</div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={filteredData()}
                        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                        <XAxis 
                          dataKey="id" 
                          tick={{ fontSize: 12, fill: '#888' }}
                          axisLine={{ stroke: '#eaeaea' }}
                        />
                        <YAxis 
                          domain={[0, 100]}
                          tick={{ fontSize: 12, fill: '#888' }}
                          axisLine={{ stroke: '#eaeaea' }}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                          formatter={(value) => [typeof value === 'number' ? value.toFixed(2) : value, 'Quality Score']}
                          labelFormatter={(id) => `Submission ${id}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="qualityScore" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          dot={{ stroke: '#10b981', strokeWidth: 2, r: 4, fill: '#fff' }}
                          activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#10b981' }}
                        />
                      </LineChart>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cyclomatic</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Maintainability</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Coupling</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quality Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredData().map((row) => (
                        <tr key={row.submissionId} className="hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">{row.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.timestamp}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.cyclomatic}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.maintainability.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{row.coupling}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                                <div 
                                  className="h-2 rounded-full" 
                                  style={{ 
                                    width: `${row.qualityScore}%`,
                                    backgroundColor: getStatusColor(row.status)
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium" style={{ color: getStatusColor(row.status) }}>
                                {row.qualityScore.toFixed(2)}
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