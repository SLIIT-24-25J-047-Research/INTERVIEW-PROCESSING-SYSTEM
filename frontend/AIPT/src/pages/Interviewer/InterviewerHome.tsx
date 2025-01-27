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

  const [totalCandidatesData, setTotalCandidatesData] = useState<{ id: number; name: string; position: string }[]>([])
  const [openPositionsData, setOpenPositionsData] = useState<{ id: number; title: string; department: string }[]>([])
  const [interviewsScheduledData, setInterviewsScheduledData] = useState<{ id: number; candidate: string; position: string; date: string }[]>([])
  const [timeToHireData, setTimeToHireData] = useState<{ department: string; avgDays: number }[]>([])

  useEffect(() => {
    // Simulate API calls
    fetchTotalCandidatesData()
    fetchOpenPositionsData()
    fetchInterviewsScheduledData()
    fetchTimeToHireData()
  }, [])

  const fetchTotalCandidatesData = () => {
    // Simulated API call
    setTimeout(() => {
      setTotalCandidatesData([
        { id: 1, name: "John Doe", position: "Software Engineer" },
        { id: 2, name: "Jane Smith", position: "Product Manager" },
        { id: 3, name: "Mike Johnson", position: "Data Scientist" },
        { id: 4, name: "Emily Brown", position: "UX Designer" },
        { id: 5, name: "Chris Lee", position: "Marketing Specialist" },
      ])
    }, 500)
  }

  const fetchOpenPositionsData = () => {
    // Simulated API call
    setTimeout(() => {
      setOpenPositionsData([
        { id: 1, title: "Senior Software Engineer", department: "Engineering" },
        { id: 2, title: "Product Manager", department: "Product" },
        { id: 3, title: "Data Analyst", department: "Data Science" },
        { id: 4, title: "UX/UI Designer", department: "Design" },
        { id: 5, title: "Marketing Manager", department: "Marketing" },
      ])
    }, 500)
  }

  const fetchInterviewsScheduledData = () => {
    // Simulated API call
    setTimeout(() => {
      setInterviewsScheduledData([
        { id: 1, candidate: "Alice Johnson", position: "Software Engineer", date: "2023-07-15" },
        { id: 2, candidate: "Bob Williams", position: "Product Manager", date: "2023-07-16" },
        { id: 3, candidate: "Carol Davis", position: "Data Scientist", date: "2023-07-17" },
        { id: 4, candidate: "David Miller", position: "UX Designer", date: "2023-07-18" },
        { id: 5, candidate: "Eva Wilson", position: "Marketing Specialist", date: "2023-07-19" },
      ])
    }, 500)
  }

  const fetchTimeToHireData = () => {
    // Simulated API call
    setTimeout(() => {
      setTimeToHireData([
        { department: "Engineering", avgDays: 20 },
        { department: "Product", avgDays: 25 },
        { department: "Data Science", avgDays: 18 },
        { department: "Design", avgDays: 15 },
        { department: "Marketing", avgDays: 22 },
      ])
    }, 500)
  }

  return (
    <>
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
                      <dd className="text-lg font-medium text-gray-900">23</dd>
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
                      <dd className="text-lg font-medium text-gray-900">45</dd>
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
            {/* Applications Trend */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Applications Trend</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={applicationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="applications" stroke="#8884d8" />
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
                    src={`https://images.unsplash.com/photo-${1500000000000 + item}?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
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

      {/* Total Candidates Modal */}
      <Dialog open={totalCandidatesModal} onClose={() => setTotalCandidatesModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Total Candidates</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Position</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {totalCandidatesData.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>{candidate.id}</TableCell>
                    <TableCell>{candidate.name}</TableCell>
                    <TableCell>{candidate.position}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTotalCandidatesModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Open Positions Modal */}
      <Dialog open={openPositionsModal} onClose={() => setOpenPositionsModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Open Positions</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Department</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {openPositionsData.map((position) => (
                  <TableRow key={position.id}>
                    <TableCell>{position.id}</TableCell>
                    <TableCell>{position.title}</TableCell>
                    <TableCell>{position.department}</TableCell>
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
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {interviewsScheduledData.map((interview) => (
                  <TableRow key={interview.id}>
                    <TableCell>{interview.id}</TableCell>
                    <TableCell>{interview.candidate}</TableCell>
                    <TableCell>{interview.position}</TableCell>
                    <TableCell>{interview.date}</TableCell>
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

      {/* Time to Hire Modal */}
      <Dialog open={timeToHireModal} onClose={() => setTimeToHireModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Time to Hire</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Department</TableCell>
                  <TableCell>Average Days to Hire</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeToHireData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.department}</TableCell>
                    <TableCell>{item.avgDays}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTimeToHireModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>


    </>
   
  )
}

export default InterviewerHome

