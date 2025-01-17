'use client'

// import { DashboardHeader } from './dashboard-header'
import { useState, useEffect } from 'react';
import CandidateHeader from "../../../components/Candidate/CandidateHeader"
import { Card, CardContent } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import { Calendar } from 'lucide-react'
import CandidateLayout from "../../../components/Candidate/CandidateLayout"
import { useAuth } from '../../../contexts/AuthContext';
import image from '../../../assets/hh.png'
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle,Typography, Box, Accordion, AccordionSummary, AccordionDetails, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,Paper } from '@mui/material';
import { IoIosArrowDropdownCircle as ExpandMoreIcon } from "react-icons/io";

// Note: You'll need to install recharts for the charts
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const pieData = [
  { name: 'Total Order', value: 81, color: '#FF6B6B' },
  { name: 'Customer Growth', value: 22, color: '#A8E6CF' },
  { name: 'Total Revenue', value: 62, color: '#3498DB' },
]

const lineData = [
  { name: 'Sunday', value: 30 },
  { name: 'Monday', value: 45 },
  { name: 'Tuesday', value: 35 },
  { name: 'Wednesday', value: 50 },
  { name: 'Thursday', value: 40 },
  { name: 'Friday', value: 55 },
  { name: 'Saturday', value: 60 },
]

export default function CandidateDashboard() {

 

  interface CVData {
 fullName: string;
  email: string;
  jobId: string;
  uploadDate: string;
  fileId: string;
    cvCount: number;
    filename: string;
  fileSize: number;
  }

  interface APIResponse {
    message: string;
    cvData: CVData[];
    cvCount: number;
  }

  const [cvData, setCVData] = useState<CVData | null>(null);
  const [cvDataList, setCVDataList] = useState<CVData[]>([]);
  const [cvCount, setCVCount] = useState<number>(0);
  const [selectedCV, setSelectedCV] = useState<CVData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  console.log("hello", user);



  const fetchCVData = async () => {
    try {
      setLoading(true);
      if (!user) {
        throw new Error('User is not authenticated');
      }
      const response = await axios.get(`http://localhost:5000/api/CVfiles/user/${user.id}`);
      setCVDataList(response.data.cvData);
      setCVCount(response.data.cvCount);
      console.log(cvDataList);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Error fetching CV data');
      } else {
        setError('Error fetching CV data');
      }
      setCVDataList([]);
      setCVCount(0);
    } finally {
      setLoading(false);
    }
  };


  const handleOpen = () => {
    setOpen(true);
    fetchCVData();
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCV(null);
  };

  const handleRowClick = (cv: CVData) => {
    setSelectedCV(cv);
  };

  const handleUpdate = async () => {
    if (selectedCV?.fileId) {
      // Implement update logic here
      console.log('Update CV with ID:', selectedCV.fileId);
    }
  };
  const handleDelete = async () => {
    if (selectedCV?.fileId) {
      try {
        // Implement delete logic here
        console.log('Delete CV with ID:', selectedCV.fileId);
        await fetchCVData(); // Refresh the list after deletion
      } catch (err) {
        console.error('Error deleting CV:', err);
      }
    }
  };

  useEffect(() => {
    fetchCVData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };




  return (

    <>
      <CandidateLayout>
        <div className="min-h-screen bg-gray-50">
          <CandidateHeader title="Candidate Dashboard" />

          <main className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold">
                Hi, {user?.name}. Welcome back !
              </h1>

              <Select defaultValue="current">
                <SelectTrigger className="w-[180px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">1 Apr 2024 - 7 Apr 2024</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Banner Section */}
            <Card className="mb-6 bg-gradient-to-r from-purple-500 to-purple-700 text-white">
              <CardContent className="">
                <div className="flex justify-between items-center">
                  <div className="space-y-2 max-w-xl">
                    <h2 className="text-2xl font-bold p-6">Your Only Place to Apply for the Jobs</h2>
                    <p className="text-purple-100">APT 2.9 is an online interview platform, we make recruiting easier.</p>


                  </div>
                  <div >
                    {/* Image on the right side */}
                    <img
                      src={image}
                      alt="Your Image Description"

                    />
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card onClick={handleOpen}
               style={{
                cursor: 'pointer', 
                transition: 'transform 0.3s', 
                boxShadow: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <h3 className="text-xl font-semibold">{cvCount}</h3>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your Applications</p>
                    <h3 className="text-xl font-semibold">{cvCount}</h3>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xl font-bold">7</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">New Applications</p>
                    <h3 className="text-xl font-semibold">7</h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Pie Chart</h3>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">Chart</Button>
                      <Button variant="outline" size="sm">Show Value</Button>
                    </div>
                  </div>
                  <div className="flex justify-around">
                    {pieData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <PieChart width={120} height={120}>
                          <Pie
                            data={[{ value: data.value }, { value: 100 - data.value }]}
                            dataKey="value"
                            innerRadius={35}
                            outerRadius={50}
                            startAngle={90}
                            endAngle={-270}
                          >
                            <Cell fill={data.color} />
                            <Cell fill="#F3F4F6" />
                          </Pie>
                        </PieChart>
                        <p className="text-sm text-muted-foreground mt-2">{data.name}</p>
                        <p className="font-semibold">{data.value}%</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Chart Order</h3>
                    <Button variant="outline" size="sm">
                      Save Report
                    </Button>
                  </div>
                  <LineChart width={500} height={300} data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6' }}
                    />
                  </LineChart>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>

      </CandidateLayout>
      {/* Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Your CV Applications</DialogTitle>
        <DialogContent>
          {loading ? (
            <Typography variant="body2" color="textSecondary">Loading...</Typography>
          ) : error ? (
            <Typography variant="body2" color="error">{error}</Typography>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Full Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Job ID</TableCell>
                      <TableCell>Upload Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cvDataList.map((cv) => (
                      <TableRow 
                        key={cv.fileId}
                        onClick={() => handleRowClick(cv)}
                        selected={selectedCV?.fileId === cv.fileId}
                        hover
                        style={{ cursor: 'pointer' }}
                      >
                        <TableCell>{cv.fullName}</TableCell>
                        <TableCell>{cv.email}</TableCell>
                        <TableCell>{cv.jobId}</TableCell>
                        <TableCell>{formatDate(cv.uploadDate)}</TableCell>
                        <TableCell>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCV(cv);
                            }}
                            size="sm"
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {selectedCV && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>Selected Application Details</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography><strong>Full Name:</strong> {selectedCV.fullName}</Typography>
                    <Typography><strong>Email:</strong> {selectedCV.email}</Typography>
                    <Typography><strong>Job ID:</strong> {selectedCV.jobId}</Typography>
                    <Typography><strong>Upload Date:</strong> {formatDate(selectedCV.uploadDate)}</Typography>
                    <Typography><strong>File ID:</strong> {selectedCV.fileId}</Typography>
                  </Box>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {selectedCV && (
            <>
              <Button onClick={handleUpdate} color="primary">
                Update Selected
              </Button>
              <Button onClick={handleDelete} color="secondary">
                Delete Selected
              </Button>
            </>
          )}
          <Button onClick={handleClose} color="default">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    
    </>


  )
}

