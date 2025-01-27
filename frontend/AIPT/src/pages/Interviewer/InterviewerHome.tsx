"use client"

import React, { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, Briefcase, UserCheck, Clock, TrendingUp, Building2, Search, Bell } from "lucide-react"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Chip,
  IconButton,
  Divider,
  Button,
} from "@mui/material"
import DashboardLayout from "../../components/Interviewer/DashboardLayout"

const applicationData = [
  { month: "Jan", applications: 120 },
  { month: "Feb", applications: 150 },
  { month: "Mar", applications: 200 },
  { month: "Apr", applications: 180 },
  { month: "May", applications: 220 },
  { month: "Jun", applications: 250 },
]

const hiringData = [
  { name: "Tech", value: 35 },
  { name: "Sales", value: 25 },
  { name: "Marketing", value: 20 },
  { name: "HR", value: 10 },
  { name: "Others", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

function InterviewerHome() {
  const [totalCandidatesModal, setTotalCandidatesModal] = useState(false)
  const [openPositionsModal, setOpenPositionsModal] = useState(false)
  const [interviewsScheduledModal, setInterviewsScheduledModal] = useState(false)
  const [timeToHireModal, setTimeToHireModal] = useState(false)

  interface Position {
    _id: string;
    jobID: string;
    jobRole: string;
    description: string;
    company: string;
    location: string;
    salary: number;
    jobType: string;
    createdAt: string;
    updatedAt: string;
  }


  const [openPositionsData, setOpenPositionsData] = useState<Position[]>([])
  interface Interview {
    _id: string;
    userName: string;
    testDate?: string;
    interviewDate?: string;
    testTime?: string;
    interviewTime?: string;
    duration?: number;
    media?: string;
    status: string;
    jobId: string;
    type: "Technical" | "Non-Technical";
  }


  const [interviewsScheduledData, setInterviewsScheduledData] = useState<Interview[]>([])
  const [totalInterviews, setTotalInterviews] = useState(0)
  const [openPositionsCount, setOpenPositionsCount] = useState(0)
  const [hiringData, setHiringData] = useState<{ name: string; value: number }[]>([]);
  

  interface ApplicationData {
    month: string;
    technical: number;
    nonTechnical: number;
  }

  const [applicationData, setApplicationData] = useState<ApplicationData[]>([]);


  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchOpenPositions(),
        fetchInterviews()
      ])
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const fetchOpenPositions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/jobs/all")
      const data = await response.json()
      console.log(data)
      setOpenPositionsData(data)
      setOpenPositionsCount(data.length)
      const processedData = processHiringData(data);
      setHiringData(processedData);
    } catch (error) {
      console.error("Error fetching open positions:", error)
      setOpenPositionsData([])
      setOpenPositionsCount(0)
      setHiringData([]);
    }
  }

  const fetchInterviews = async () => {
    try {
      const [technicalResponse, nonTechnicalResponse] = await Promise.all([
        fetch("http://localhost:5000/api/t-interviews/schedule/get"),
        fetch("http://localhost:5000/api/non-t-interviews/schedule/get")
      ]);

      const technicalData = await technicalResponse.json();
      const nonTechnicalData = await nonTechnicalResponse.json();


      interface TechnicalInterview {
        _id: string;
        userName: string;
        testDate: string;
        testTime: string;
        duration: number;
        status: string;
        jobId: string;
        type: "Technical";
      }

      interface NonTechnicalInterview {
        _id: string;
        userName: string;
        interviewDate: string;
        interviewTime: string;
        media: string;
        status: string;
        jobId: string;
        type: "Non-Technical";
      }

      const combinedInterviews: (TechnicalInterview | NonTechnicalInterview)[] = [
        ...technicalData.map((interview: TechnicalInterview) => ({
          _id: interview._id,
          userName: interview.userName,
          testDate: interview.testDate,
          testTime: interview.testTime,
          duration: interview.duration,
          status: interview.status,
          jobId: interview.jobId,
          type: 'Technical',
        })),
        ...nonTechnicalData.schedules.map((interview: NonTechnicalInterview) => ({
          _id: interview._id,
          userName: interview.userName,
          interviewDate: interview.interviewDate,
          interviewTime: interview.interviewTime,
          media: interview.media,
          status: interview.status,
          jobId: interview.jobId,
          type: 'Non-Technical',
        }))
      ];
      setInterviewsScheduledData(combinedInterviews);
      setTotalInterviews(combinedInterviews.length);
      const trendData = processScheduleTrendData(combinedInterviews);
      setApplicationData(trendData);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      setInterviewsScheduledData([]);
      setTotalInterviews(0);
    }
  };

  const processScheduleTrendData = (
    interviews: Interview[]
  ): { month: string; technical: number; nonTechnical: number }[] => {
    // Initialize all months
    const trendData: Record<string, { technical: number; nonTechnical: number }> = {};
    const startDate = new Date("2025-01-01"); // Example 
    const endDate = new Date(); // Current date
    while (startDate <= endDate) {
      const month = startDate.toLocaleString("default", { month: "long", year: "numeric" });
      trendData[month] = { technical: 0, nonTechnical: 0 };
      startDate.setMonth(startDate.getMonth() + 1);
    }
  
    // Populate data from interviews
    interviews.forEach((interview) => {
      const dateKey = interview.type === "Technical"
        ? interview.testDate
        : interview.interviewDate;
  
      if (dateKey) {
        const month = new Date(dateKey).toLocaleString("default", { month: "long", year: "numeric" });
        if (!trendData[month]) {
          trendData[month] = { technical: 0, nonTechnical: 0 };
        }
  
        if (interview.type === "Technical") {
          trendData[month].technical += 1;
        } else if (interview.type === "Non-Technical") {
          trendData[month].nonTechnical += 1;
        }
      }
    });
  
  
    const sortedData = Object.entries(trendData)
      .map(([month, counts]) => ({
        month,
        technical: counts.technical,
        nonTechnical: counts.nonTechnical,
        sortDate: new Date(month), // Convert month to a Date 
      }))
      .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime()) 
  
      .map(({ month, technical, nonTechnical }) => ({
        month,
        technical,
        nonTechnical,
      }));
  
    return sortedData;
  };
  

  const processHiringData = (positions: Position[]) => {
    const roleCounts: Record<string, number> = {};
  
    // Count the number of positions per job role
    positions.forEach((position) => {
      const role = position.jobRole;
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
  
    // Convert the object into an array format for the chart
    return Object.entries(roleCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };








  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 mt-10">
        <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer"
              onClick={() => setTotalCandidatesModal(true)}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Candidates</dt>
                      <dd className="text-lg font-medium text-gray-900">1,234</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer"
              onClick={() => setOpenPositionsModal(true)}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Briefcase className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Open Positions</dt>
                      <dd className="text-lg font-medium text-gray-900">{openPositionsCount}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer"
              onClick={() => setInterviewsScheduledModal(true)}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserCheck className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Interviews Scheduled</dt>
                      <dd className="text-lg font-medium text-gray-900">{totalInterviews}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="bg-white overflow-hidden shadow rounded-lg cursor-pointer"
              onClick={() => setTimeToHireModal(true)}
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Time to Hire (Avg)</dt>
                      <dd className="text-lg font-medium text-gray-900">18 days</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Interviews Scheduled Trend</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={applicationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="technical"
                      stroke="#8884d8"
                      name="Technical Interviews"
                    />
                    <Line
                      type="monotone"
                      dataKey="nonTechnical"
                      stroke="#82ca9d"
                      name="Non-Technical Interviews"
                    />
                  </LineChart>
                </ResponsiveContainer>

              </div>
            </div>

            {/* Department-wise Hiring */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Department-wise Hiring</h2>
              <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={hiringData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {hiringData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="px-6 py-4 flex items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={`/api/placeholder/40/40`}
                    alt=""
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Candidate {item}</h3>
                        <p className="text-sm text-gray-500">Applied for Senior Developer</p>
                      </div>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Open Positions Modal */}
      <Dialog open={openPositionsModal} onClose={() => setOpenPositionsModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Open Positions</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Job Role</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Salary</TableCell>
                  <TableCell>Job Type</TableCell>
                  <TableCell>Posted On</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {openPositionsData.map((position) => (
                  <TableRow key={position._id}>
                    <TableCell>{position.jobID}</TableCell>
                    <TableCell>{position.jobRole}</TableCell>
                    <TableCell>{position.company}</TableCell>
                    <TableCell>{position.location}</TableCell>
                    <TableCell>${position.salary.toLocaleString()}</TableCell>
                    <TableCell>{position.jobType}</TableCell>
                    <TableCell>{new Date(position.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPositionsModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>


      {/* Interviews Scheduled Modal */}
      <Dialog
        open={interviewsScheduledModal}
        onClose={() => setInterviewsScheduledModal(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Interviews Scheduled</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Candidate</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {interviewsScheduledData.map((interview) => (
                  <TableRow key={interview._id}>
                    <TableCell>{interview._id}</TableCell>
                    <TableCell>{interview.userName}</TableCell>
                    <TableCell>{interview.jobId}</TableCell>
                    <TableCell>{interview.type}</TableCell>
                    <TableCell>
                      {interview.type === 'Technical'
                        ? interview.testDate ? new Date(interview.testDate).toLocaleDateString() : 'N/A'
                        : interview.interviewDate ? new Date(interview.interviewDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {interview.type === 'Technical'
                        ? interview.testTime
                        : interview.interviewTime}
                    </TableCell>
                    <TableCell>{interview.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInterviewsScheduledModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </DashboardLayout>
  )
}

export default InterviewerHome