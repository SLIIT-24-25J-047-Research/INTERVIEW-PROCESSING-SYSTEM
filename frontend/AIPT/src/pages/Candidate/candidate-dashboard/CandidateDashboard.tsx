"use client";

// import { DashboardHeader } from './dashboard-header'
import { useState, useEffect } from "react";
import CandidateHeader from "../../../components/Candidate/CandidateHeader";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../../../components/ui/select";
import { Briefcase, Calendar, Mail, MapPin, User, DollarSign, BookmarkIcon, Trash2 } from "lucide-react";
import CandidateLayout from "../../../components/Candidate/CandidateLayout";
import { useAuth } from "../../../contexts/AuthContext";
import image from "../../../assets/hh.png";
import axios from "axios";
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Chip,
  IconButton, Divider,
} from "@mui/material";
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const pieData = [
  { name: "Total Order", value: 81, color: "#FF6B6B" },
  { name: "Customer Growth", value: 22, color: "#A8E6CF" },
  { name: "Total Revenue", value: 62, color: "#3498DB" },
];

const lineData = [
  { name: "Sunday", value: 30 },
  { name: "Monday", value: 45 },
  { name: "Tuesday", value: 35 },
  { name: "Wednesday", value: 50 },
  { name: "Thursday", value: 40 },
  { name: "Friday", value: 55 },
  { name: "Saturday", value: 60 },
];

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

  interface JobData {
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

  interface JobState {
    data?: JobData;
    loading: boolean;
    error?: string;
  }

  interface CVWithJobState extends CVData {
    job: JobState;
  }

  interface APIResponse {
    message: string;
    cvData: CVData[];
    cvCount: number;
  }

  interface SavedJob {
    _id: string;
    jobId: string;
    savedAt: string;
  }

  const [cvData, setCVData] = useState<CVData | null>(null);
  const [cvDataList, setCVDataList] = useState<CVWithJobState[]>([]);
  const [cvCount, setCVCount] = useState<number>(0);
  const [selectedCV, setSelectedCV] = useState<CVWithJobState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [savedJobsList, setSavedJobsList] = useState<(SavedJob & { jobDetails?: JobData })[]>([]);
  const [savedJobsModalOpen, setSavedJobsModalOpen] = useState(false);
  interface Interview {
    _id: string;
    jobId: string;
    status: string;
    testDate: string;
    testTime: string;
    testLink?: string;
  }

  const [techInterviews, setTechInterviews] = useState<Interview[]>([]);
  interface NonTechInterview {
    _id: string;
    jobId: string | { _id: string; description?: string };
    status: string;
    interviewDate: string;
    interviewTime: string;
    media?: string;
  }

  const [nonTechInterviews, setNonTechInterviews] = useState<NonTechInterview[]>([]);

  console.log("hello", user);


  // fetch cv details
  const fetchCVData = async () => {
    try {
      setLoading(true);
      if (!user) {
        throw new Error("User is not authenticated");
      }
      const response = await axios.get<APIResponse>(
        `http://localhost:5000/api/CVfiles/user/${user.id}`
      );

      // Initialize CVs with job states
      const initializedCVs: CVWithJobState[] = response.data.cvData.map(
        (cv) => ({
          ...cv,
          job: { loading: false },
        })
      );

      setCVDataList(initializedCVs);
      setCVCount(response.data.cvCount);

      // Fetch job details for each CV
      initializedCVs.forEach((cv) => {
        fetchJobDetails(cv);
      });

      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Error fetching CV data");
      } else {
        setError("Error fetching CV data");
      }
      setCVDataList([]);
      setCVCount(0);
    } finally {
      setLoading(false);
    }
  };

  // fetch job details
  const fetchJobDetails = async (cv: CVData) => {
    // Create or update CV with job state
    setCVDataList((prevList) =>
      prevList.map((item) =>
        item.fileId === cv.fileId
          ? { ...item, job: { ...item.job, loading: true } }
          : item
      )
    );

    try {
      const response = await axios.get<JobData>(
        `http://localhost:5000/api/jobs/${cv.jobId}`
      );

      setCVDataList((prevList) =>
        prevList.map((item) =>
          item.fileId === cv.fileId
            ? {
              ...item,
              job: {
                loading: false,
                data: response.data,
              },
            }
            : item
        )
      );
    } catch (err) {
      setCVDataList((prevList) =>
        prevList.map((item) =>
          item.fileId === cv.fileId
            ? {
              ...item,
              job: {
                loading: false,
                error: axios.isAxiosError(err)
                  ? err.response?.data?.message ||
                  "Error fetching job details"
                  : "Error fetching job details",
              },
            }
            : item
        )
      );
    }
  };


  // saved jobs
  const fetchSavedJobs = async () => {
    try {
      if (!user) return;

      const savedJobsResponse = await axios.get(
        `http://localhost:5000/api/savejobs/getSavedJobs/${user.id}`
      );

      const savedJobsWithDetails = await Promise.all(
        savedJobsResponse.data.map(async (savedJob: SavedJob) => {
          try {
            const jobDetailsResponse = await axios.get(
              `http://localhost:5000/api/jobs/${savedJob.jobId}`
            );
            return {
              ...savedJob,
              jobDetails: jobDetailsResponse.data
            };
          } catch (error) {
            console.error("Error fetching job details:", error);
            return savedJob;
          }
        })
      );

      setSavedJobsList(savedJobsWithDetails);
      setSavedJobsCount(savedJobsWithDetails.length);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, [user]);

  console.log("savedJobsList", cvDataList);

  // remove saved jobs
  const removeSavedJob = async (jobId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/savejobs/removeSavedJob/${user?.id}/${jobId}`);
      await fetchSavedJobs(); // Refresh 
    } catch (error) {
      console.error("Error removing saved job:", error);
    }
  };

  // fetch interviews
  const fetchInterviews = async () => {
    try {
      if (!user) return;

      // technical interviews
      const techResponse = await axios.get(
        `http://localhost:5000/api/t-interviews/schedule/user/${user.id}`
      );

      // non-technical interviews
      const nonTechResponse = await axios.get(
        `http://localhost:5000/api/non-t-interviews/schedule/user/${user.id}`
      );

      setTechInterviews(techResponse.data.schedules);
      setNonTechInterviews(nonTechResponse.data.schedules);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [user]);



  const handleOpen = () => {
    setOpen(true);
    fetchCVData();
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCV(null);
  };

  const handleRowClick = (cv: CVWithJobState) => {
    setSelectedCV(cv);
    console.log("Selected CV:", cv);
  };

  const handleUpdate = async () => {
    if (selectedCV?.fileId) {
      console.log("Update CV with ID:", selectedCV.fileId);
    }
  };

  const handleDelete = async () => {
    if (selectedCV?.fileId) {
      try {
        console.log("Delete CV with ID:", selectedCV.fileId);
        await fetchCVData();
      } catch (err) {
        console.error("Error deleting CV:", err);
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
                  <SelectItem value="current">
                    1 Apr 2024 - 7 Apr 2024
                  </SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Banner Section */}
            <Card className="mb-6 bg-gradient-to-r from-purple-500 to-purple-700 text-white">
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="space-y-2 max-w-xl">
                    <h2 className="text-2xl font-bold p-6">
                      Your Only Place to Apply for the Jobs
                    </h2>
                    <p className="text-purple-100">
                      APT 2.9 is an online interview platform, we make recruiting easier.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {/* Image on the right side */}
                    <img
                      src={image}
                      alt="Your Image Description"
                      className="w-64 h-64 object-cover" // Adjust size and fit as needed
                    />
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card
                onClick={handleOpen}
                style={{
                  cursor: "pointer",
                  transition: "transform 0.3s",
                  boxShadow: "none",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <h3 className="text-xl font-semibold">{cvCount}</h3>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Your Applications
                    </p>
                    <h3 className="text-xl font-semibold">{cvCount}</h3>
                  </div>
                </CardContent>
              </Card>
              <Card
                onClick={() => setSavedJobsModalOpen(true)}
                style={{
                  cursor: "pointer",
                  transition: "transform 0.3s",
                  boxShadow: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xl font-bold">{savedJobsCount}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Saved Jobs</p>
                    <h3 className="text-xl font-semibold">{savedJobsCount}</h3>
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
                      <Button variant="outline" size="sm">
                        Chart
                      </Button>
                      <Button variant="outline" size="sm">
                        Show Value
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-around">
                    {pieData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <PieChart width={120} height={120}>
                          <Pie
                            data={[
                              { value: data.value },
                              { value: 100 - data.value },
                            ]}
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
                        <p className="text-sm text-muted-foreground mt-2">
                          {data.name}
                        </p>
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
                      dot={{ fill: "#3B82F6" }}
                    />
                  </LineChart>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </CandidateLayout>


      {/* job deatails Modal */}

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: "80vh",
            maxHeight: "90vh",
            bgcolor: "background.default",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            CV Applications
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            View and manage your submitted CV applications
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <Typography color="text.secondary">
                Loading applications...
              </Typography>
            </Box>
          ) : error ? (
            <Paper sx={{ p: 2, bgcolor: "error.light", color: "error.main" }}>
              {error}
            </Paper>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TableContainer component={Paper} elevation={2}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Applicant
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Job Details
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Upload Date
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cvDataList.map((cv) => (
                      <TableRow
                        key={cv.fileId}
                        hover
                        selected={selectedCV?.fileId === cv.fileId}
                        onClick={() => handleRowClick(cv)}
                        sx={{
                          cursor: "pointer",
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <Typography variant="body1">
                              {cv.fullName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Mail size={16} />
                                {cv.email}
                              </Box>
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {cv.job.loading ? (
                            <Typography color="text.secondary">
                              Loading...
                            </Typography>
                          ) : cv.job.error ? (
                            <Typography color="error">
                              Error loading job
                            </Typography>
                          ) : cv.job.data ? (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.5,
                              }}
                            >
                              <Typography variant="body1">
                                {cv.job.data.jobRole}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {cv.job.data.company}
                              </Typography>
                            </Box>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={cv.job.data?.jobType || "N/A"}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Calendar size={16} />
                            <Typography variant="body2">
                              {formatDate(cv.uploadDate)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(cv);
                            }}
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
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <User size={20} />
                          <Typography variant="h6">
                            Application Details
                          </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Full Name
                            </Typography>
                            <Typography variant="body1">
                              {selectedCV.fullName}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Email
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Mail size={16} />
                              <Typography variant="body1">
                                {selectedCV.email}
                              </Typography>
                            </Box>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Application Date
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Calendar size={16} />
                              <Typography variant="body1">
                                {formatDate(selectedCV.uploadDate)}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>

                            <Button
                              variant="outline"
                              color="destructive"
                              onClick={handleDelete}
                            >
                              Delete
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          <Briefcase size={20} />
                          <Typography variant="h6">Job Details</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        {selectedCV.job.loading ? (
                          <Typography color="text.secondary">
                            Loading job details...
                          </Typography>
                        ) : selectedCV.job.error ? (
                          <Typography color="error">
                            {selectedCV.job.error}
                          </Typography>
                        ) : selectedCV.job.data ? (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                            }}
                          >
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Role
                              </Typography>
                              <Typography variant="body1">
                                {selectedCV.job.data.jobRole}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Company
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Briefcase size={16} />
                                <Typography variant="body1">
                                  {selectedCV.job.data.company}
                                </Typography>
                              </Box>
                            </Box>
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Location
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <MapPin size={16} />
                                <Typography variant="body1">
                                  {selectedCV.job.data.location}
                                </Typography>
                              </Box>
                            </Box>
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Salary
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <DollarSign size={16} />
                                  <Typography variant="body1">
                                    {selectedCV.job.data.salary.toLocaleString()}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Type
                                </Typography>
                                <Chip
                                  label={selectedCV.job.data.jobType}
                                  color="primary"
                                  variant="outlined"
                                  size="small"
                                />
                              </Grid>
                            </Grid>
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Description
                              </Typography>
                              <Typography variant="body1" sx={{ mt: 0.5 }}>
                                {selectedCV.job.data.description}
                              </Typography>
                            </Box>
                          </Box>
                        ) : null}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>


              )}
              <Grid item xs={12} md={12}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <Calendar size={20} />
                      <Typography variant="h6">Interview Schedules</Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />

                    {/* Technical Interviews */}
                    {selectedCV && techInterviews
                    .filter(interview => {
                      // Ensure job ID matches and exists
                      return selectedCV.job.data && interview.jobId === selectedCV.job.data._id;
                    })
                      .map((interview) => (
                        <Box key={interview._id} sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Technical Interview
                          </Typography>
                          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            <Chip
                              label={interview.status}
                              color={
                                interview.status === 'completed' ? 'success' :
                                  interview.status === 'scheduled' ? 'primary' :
                                    interview.status === 'canceled' ? 'error' : 'default'
                              }
                              size="small"
                            />
                            <Typography variant="body2">
                              {new Date(interview.testDate).toLocaleDateString()} at {interview.testTime}
                            </Typography>
                          </Box>
                          {interview.testLink && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open("/interview")}
                              style={{ marginTop: '0.25rem' }}
                            >
                              Join Interview
                            </Button>
                          )}
                        </Box>
                      ))}

                    {/* Non-Technical Interviews */}
                    {selectedCV && nonTechInterviews
                      .filter(interview => {
                        // Handle both string and object job ID formats
                        const jobId = typeof interview.jobId === 'string' 
                          ? interview.jobId 
                          : interview.jobId?._id;
                        
                        return selectedCV.job.data && jobId === selectedCV.job.data._id;
                      })
                      .map((interview) => (
                        <Box key={interview._id} sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Non-Technical Interview
                          </Typography>
                          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            <Chip
                              label={interview.status}
                              color={
                                interview.status === 'done' ? 'success' :
                                  interview.status === 'scheduled' ? 'primary' :
                                    interview.status === 'canceled' ? 'error' : 'default'
                              }
                              size="small"
                            />
                            <Typography variant="body2">
                              {new Date(interview.interviewDate).toLocaleDateString()} at {interview.interviewTime}
                            </Typography>
                          </Box>
                          {interview.media && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              Platform: {interview.media}
                            </Typography>
                          )}
                        </Box>
                      ))}

                    {selectedCV && techInterviews.filter(interview => interview.jobId === selectedCV.job.data?._id).length === 0 &&
                      nonTechInterviews.filter(interview =>
                        typeof interview.jobId === "object" && interview.jobId?._id === selectedCV.job.data?._id
                      ).length === 0 && (
                        <Typography variant="body2" color="text.secondary">
                          No interview schedules for this job.
                        </Typography>
                      )}
                  </CardContent>
                </Card>
              </Grid>
            </Box>

          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal */}

      <Dialog open={savedJobsModalOpen} onClose={() => setSavedJobsModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Saved Jobs
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {savedJobsList.map((savedJob) => savedJob.jobDetails && (
              <Grid item xs={12} key={savedJob._id}>
                <Card>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <Typography variant="h6" fontWeight="bold">
                        {savedJob.jobDetails.jobRole}
                      </Typography>
                      <div className="flex items-center space-x-2">
                        <Chip
                          icon={<BookmarkIcon size={16} />}
                          label="Saved"
                          color="primary"
                          size="small"
                        />
                        <button
                          onClick={() => removeSavedJob(savedJob.jobId)}
                          className="hover:bg-red-100 rounded-full p-1 transition-colors"
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>

                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-gray-500" />
                        <Typography variant="body2">
                          {savedJob.jobDetails.company}


                        </Typography>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-500" />
                        <Typography variant="body2">
                          {savedJob.jobDetails.location}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-gray-500" />
                        <Typography variant="body2">
                          ${savedJob.jobDetails.salary.toLocaleString()} / year
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
