"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { Edit, Trash2, X, Check, AlertCircle, Loader, Briefcase, Calendar, Users } from "lucide-react"
import DashboardLayout from "../../../components/Interviewer/DashboardLayout"

interface Job {
  _id?: string
  jobID: string
  jobRole: "software-engineer-intern" | "software-engineer-associate"
  description: string
  company: string
  location: string
  salary?: number
  jobType: "Full-time" | "Part-time" | "Contract"
  createdAt?: string
}

interface User {
    _id: string
    name: string
    email: string
    createdAt: string
  }

// Initial empty job object
const emptyJob: Job = {
  jobID: "",
  jobRole: "software-engineer-intern",
  description: "",
  company: "",
  location: "",
  jobType: "Full-time",
}

export default function JobAdminDashboard() {
  // State for jobs list
  const [jobs, setJobs] = useState<Job[]>([])

  // State for form
  const [formData, setFormData] = useState<Job>(emptyJob)
  const [isEditing, setIsEditing] = useState(false)

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [toasts, setToasts] = useState<Array<{ id: string; type: "success" | "error"; message: string }>>([])
  const [users, setUsers] = useState<User[]>([])


  const [stats, setStats] = useState({
    totalJobs: 0,
    totalUsers: 0,
    jobsThisMonth: 0,
    usersThisMonth: 0,
    userRegistrationData: [0, 0, 0, 0, 0, 0], // Last 6 months data
  })

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users")
      setUsers(response.data)
      updateStats(jobs, response.data)
    } catch (err) {
      showToast("error", "Failed to fetch user data. Please try again.")
      console.error("Error fetching users:", err)
    }
  }


// Fetch all jobs
const fetchJobs = async () => {
  setLoading(true)
  setError(null)

  try {
    const response = await axios.get("http://localhost:5000/api/jobs/all")
console.log("API response:", response)
    setJobs(response.data)
    updateStats(response.data, users)
  } catch (err) {
    showToast("error", "Failed to fetch jobs. Please try again.")
    console.error("Error fetching jobs:", err)
    setError("Failed to fetch jobs. Please try again.")
  } finally {
    setLoading(false)
  }
}

  const showToast = (type: "success" | "error", message: string) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 5000)
  }


  const updateStats = (jobsData: Job[], usersData: User[]) => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()

    // Calculate jobs this month
    const jobsThisMonth = jobsData.filter((job) => {
      if (!job.createdAt) return false
      const created = new Date(job.createdAt)
      return created.getMonth() === thisMonth && created.getFullYear() === thisYear
    }).length

    // Calculate users this month
    const usersThisMonth = usersData.filter((user) => {
      if (!user.createdAt) return false
      const created = new Date(user.createdAt)
      return created.getMonth() === thisMonth && created.getFullYear() === thisYear
    }).length

    // Calculate user registrations per month for the last 6 months
    const userRegistrationData = Array(6).fill(0)

    usersData.forEach((user) => {
      if (!user.createdAt) return

      const created = new Date(user.createdAt)
      const monthDiff = (thisYear - created.getFullYear()) * 12 + (thisMonth - created.getMonth())

      if (monthDiff >= 0 && monthDiff < 6) {
        userRegistrationData[5 - monthDiff]++
      }
    })

    setStats({
      totalJobs: jobsData.length,
      totalUsers: usersData.length,
      jobsThisMonth,
      usersThisMonth,
      userRegistrationData,
    })
  }


  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "salary" ? (value ? Number.parseInt(value) : undefined) : value,
    })
  }

  // Reset form to default state
  const resetForm = () => {
    setFormData(emptyJob)
    setIsEditing(false)
    setError(null)
    setSuccess(null)
  }

  // Set up form for editing a job
  const handleEdit = (job: Job) => {
    setFormData(job)
    setIsEditing(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle form submission (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (isEditing && formData._id) {
        // Update existing job
        await axios.put(`http://localhost:5000/api/jobs/${formData._id}`, formData)
        setSuccess("Job updated successfully!")
      } else {
        // Create new job
        await axios.post("http://localhost:5000/api/jobs/add", formData)
        setSuccess("Job created successfully!")
      }

      // Refresh jobs list and reset form
      await fetchJobs()
      resetForm()
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "An error occurred. Please try again.")
      } else {
        setError("An error occurred. Please try again.")
      }
      console.error("Error submitting job:", err)
    } finally {
      setLoading(false)
    }
  }

  // Delete a job
  const handleDelete = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`)
      setSuccess("Job deleted successfully!")
      setDeleteConfirm(null)
      await fetchJobs()
    } catch (err) {
      setError("Failed to delete job. Please try again.")
      console.error("Error deleting job:", err)
    } finally {
      setLoading(false)
    }
  }

  // Validate form before submission
  const isFormValid = () => {
    return (
     
      formData.description.trim() !== "" &&
      formData.company.trim() !== "" &&
      formData.location.trim() !== ""
    )
  }

  const getMonthName = (monthsAgo: number) => {
    const date = new Date()
    date.setMonth(date.getMonth() - monthsAgo)
    return date.toLocaleString("default", { month: "short" })
  }

  return (
    <DashboardLayout>
   <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Job Posting Administration</h1>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-md shadow-lg flex items-center ${
              toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
            style={{ minWidth: "300px" }}
          >
            {toast.type === "success" ? (
              <Check className="mr-2" size={20} />
            ) : (
              <AlertCircle className="mr-2" size={20} />
            )}
            <span>{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="ml-auto text-white"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Briefcase size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-500">Total Jobs</h3>
              <p className="text-3xl font-bold">{stats.totalJobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-500">Jobs This Month</h3>
              <p className="text-3xl font-bold">{stats.jobsThisMonth}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-500">Total Users</h3>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-500">New Users</h3>
              <p className="text-3xl font-bold">{stats.usersThisMonth}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Registration Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">User Registrations Over Time</h2>
        <div className="h-64">
          <div className="flex items-end h-48 mt-2">
            {stats.userRegistrationData.map((count, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-purple-500 rounded-t w-16 mx-auto"
                  style={{
                    height: `${Math.max(5, (count / Math.max(...stats.userRegistrationData, 1)) * 100)}%`,
                    minHeight: count > 0 ? "10%" : "5%",
                  }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">{getMonthName(5 - index)}</div>
                <div className="text-sm font-medium">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Job Posting" : "Create New Job Posting"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Job ID*</label>
              <input
                type="text"
                name="jobID"
                value={formData.jobID}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Job Role*</label>
              <select
                name="jobRole"
                value={formData.jobRole}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="software-engineer-intern">Software Engineer Intern</option>
                <option value="software-engineer-associate">Software Engineer Associate</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Company*</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location*</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Salary (optional)</label>
              <input
                type="number"
                name="salary"
                value={formData.salary || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Job Type*</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              rows={5}
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center disabled:bg-blue-300"
            >
              {loading ? <Loader className="animate-spin mr-2" size={16} /> : null}
              {isEditing ? "Update Job" : "Create Job"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Job Listings</h2>
          <button
            onClick={fetchJobs}
            className="text-blue-600 hover:text-blue-800 flex items-center"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin mr-1" size={16} /> : null}
            Refresh
          </button>
        </div>

        {loading && jobs.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <Loader className="animate-spin mr-2" size={24} />
            <span>Loading jobs...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No jobs found. Create your first job posting above.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">{job.jobID}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {job.jobRole === "software-engineer-intern"
                        ? "Software Engineer Intern"
                        : "Software Engineer Associate"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{job.company}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{job.location}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{job.jobType}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(job)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(job._id || null)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this job posting? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 border rounded-md hover:bg-gray-100">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin mr-2" size={16} /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  )
}

