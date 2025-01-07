import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from '../../components/Interviewer/DashboardLayout';
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const AddJob: React.FC = () => {
  const [jobData, setJobData] = useState({
    // jobID: "",
    jobRole: "",
    description: "",
    company: "",
    location: "",
    salary: "",
    jobType: "Full-time",
  });

  const [errors, setErrors] = useState<{
    // jobID?: string;
    jobRole?: string;
    description?: string;
    company?: string;
    location?: string;
    salary?: string;
  }>({});

  const [message, setMessage] = useState("");
  const [jobsList, setJobsList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);  // Modal visibility state
  const [loading, setLoading] = useState(false);

  interface Job {
    _id: string;
    jobID: string;
    jobRole: string;
    description: string;
    company: string;
    location: string;
    salary: string;
    jobType: string;
  }
  const [currentJob, setCurrentJob] = useState<Job | null>(null);


  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Job ID Validation
    // if (!jobData.jobID.trim()) {
    //   newErrors.jobID = "Job ID is required";
    // } else if (!/^[A-Z]{2}\d{4}$/.test(jobData.jobID)) {
    //   newErrors.jobID = "Job ID must be 2 uppercase letters followed by 4 digits (e.g., AB1234)";
    // }

    // Job Role Validation
    if (!jobData.jobRole) {
      newErrors.jobRole = "Please select a job role";
    }

    // Description Validation
    if (!jobData.description.trim()) {
      newErrors.description = "Job description is required";
    } else if (jobData.description.trim().length < 5) {
      newErrors.description = "Description must be at least 5 characters long";
    }

    // Company Validation
    if (!jobData.company.trim()) {
      newErrors.company = "Company name is required";
    } else if (jobData.company.trim().length < 2) {
      newErrors.company = "Company name must be at least 2 characters long";
    }

    // Location Validation
    if (!jobData.location.trim()) {
      newErrors.location = "Location is required";
    }

    // Optional Salary Validation (if provided)
    if (jobData.salary) {
      const salaryNum = parseFloat(jobData.salary);
      if (isNaN(salaryNum) || salaryNum < 0) {
        newErrors.salary = "Salary must be a positive number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobData({ ...jobData, [name]: value });

    // Clear the specific error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleEdit = (job: Job) => {
    setCurrentJob(job);
    setIsModalOpen(true);  // Open the modal when editing
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentJob(null);
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    const updatedJob = { ...currentJob };
    if (!currentJob) return;

    try {
      // Send the updated job details to the backend
      await axios.put(`http://localhost:5000/api/jobs/${updatedJob._id}`, updatedJob);
      // Optionally update the jobsList state to reflect the changes
      setJobsList(jobsList.map(job => job._id === updatedJob._id ? updatedJob : job));
      handleCloseModal();  // Close the modal after saving changes
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous messages
    setMessage("");

    // Validate form
    console.log("Validating form...");
    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }

    console.log("Form is valid. Submitting data...");

    try {
      const response = await axios.post("http://localhost:5000/api/jobs/add", jobData);

      // Success message
      setMessage(response.data.message || "Job added successfully!");

      // Reset form
      setJobData({
        // jobID: "",
        jobRole: "",
        description: "",
        company: "",
        location: "",
        salary: "",
        jobType: "Full-time",
      });

      // Clear any errors
      setErrors({});

      // Refresh job list
      await fetchJobs();
    } catch (error: any) {
      // Error handling
      setMessage(error.response?.data?.message || "Error adding job");
      console.error("Job submission error:", error);
    }
  };




  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/jobs/all");
      // Assuming the response data contains an array of jobs, use response.data to access the jobs.
      setJobsList(response.data);  // Set the jobsList state with the received job objects
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error fetching jobs");
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchJobs().finally(() => setLoading(false));
  }, []);


  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }
    axios.delete(`http://localhost:5000/api/jobs/${id}`)
      .then(() => {

        setJobsList(jobsList.filter(job => job._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting job:", error);
      });
  };



  if (loading) {
    return <DashboardLayout>Loading...</DashboardLayout>;
  }




  return (
    <DashboardLayout>
      <div className="add-job-container">
        <h1>Add Job Vacancy</h1>
        <form className="add-job-form" onSubmit={handleSubmit}>
          {/* <div className="form-group">
            <label htmlFor="jobID">Job ID</label>
            <input
              type="text"
              name="jobID"
              value={jobData.jobID}
              onChange={handleChange}
              required
            />
          </div> */}

          <div className="form-group">
            <label htmlFor="jobRole">Job Role</label>
            <select
              name="jobRole"
              value={jobData.jobRole}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select role
              </option>
              <option value="software-engineer-intern">Software Engineer Intern</option>
              <option value="software-engineer-associate">Software Engineer Associate</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              type="text"
              name="company"
              value={jobData.company}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              name="location"
              value={jobData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="salary">Salary (Optional)</label>
            <input
              type="number"
              name="salary"
              value={jobData.salary}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="jobType">Job Type</label>
            <select
              name="jobType"
              value={jobData.jobType}
              onChange={handleChange}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <button type="submit">Add Job</button>
        </form>

        {message && <p className="message">{message}</p>}

      </div>



      <div className="job-container">

        <div className="mt-12">
          <h2 className="text-xl font-normal mb-4">Job Listings</h2>
          <div className="overflow-x-auto bg-white rounded-md shadow-md">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-xs font-medium text-gray-600 uppercase">
                <tr>
                  <th className="px-6 py-3">Job ID</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Salary</th>
                  <th className="px-6 py-3">Job Type</th>
                  <th className="px-6 py-3">Actions</th> {/* Added Actions column */}
                </tr>
              </thead>
              <tbody>
                {jobsList.map((job) => (
                  <tr key={job._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{job.jobID}</td>
                    <td className="px-6 py-4">{job.jobRole}</td>
                    <td className="px-6 py-4">{job.company}</td>
                    <td className="px-6 py-4">{job.location}</td>
                    <td className="px-6 py-4">{job.salary ? `$${job.salary}` : "N/A"}</td>
                    <td className="px-6 py-4">{job.jobType}</td>
                    <td className="px-6 py-4 flex space-x-2"> {/* Added flex layout for icons */}
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(job)}  // Edit action
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(job._id)}  // Delete action
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Modal for Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-md shadow-md p-6 ">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Edit Job</h2>
              <form onSubmit={handleUpdate}>
                <div className="mb-4">
                  <label htmlFor="jobID" className="block text-sm font-medium text-gray-600">Job ID</label>
                  <input
                    type="text"
                    id="jobID"
                    className="w-full p-2 border rounded-md mt-2 text-sm"
                    value={currentJob?.jobID || ''}
                    onChange={(e) => setCurrentJob(currentJob ? { ...currentJob, jobID: e.target.value } : null)}
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="jobRole" className="block text-sm font-medium text-gray-600">Role</label>
                  <select
                    name="jobRole"
                    id="jobRole"
                    className="w-full p-2 border rounded-md mt-2 text-sm"
                    value={currentJob?.jobRole || ''}
                    onChange={(e) => setCurrentJob(currentJob ? { ...currentJob, jobRole: e.target.value } : null)}
                  >
                    <option value="software-engineer-intern">Software Engineer Intern</option>
                    <option value="software-engineer-associate">Software Engineer Associate</option>
                  </select>

                </div>
                <div className="mb-4">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-600">Company</label>
                  <input
                    type="text"
                    id="company"
                    className="w-full p-2 border rounded-md mt-2 text-sm"
                    value={currentJob?.company || ''}
                    onChange={(e) => setCurrentJob(currentJob ? { ...currentJob, company: e.target.value } : null)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-600">Location</label>
                  <input
                    type="text"
                    id="location"
                    className="w-full p-2 border rounded-md mt-2 text-sm"
                    value={currentJob?.location || ''}
                    onChange={(e) => setCurrentJob(currentJob ? { ...currentJob, location: e.target.value } : null)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-600">Salary</label>
                  <input
                    type="number"
                    id="salary"
                    className="w-full p-2 border rounded-md mt-2 text-sm"
                    value={currentJob?.salary || ''}
                    onChange={(e) => setCurrentJob(currentJob ? { ...currentJob, salary: e.target.value } : null)}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-600">Job Type</label>
                  <select
                    name="jobType"
                    id="jobType"
                    className="w-full p-2 border rounded-md mt-2 text-sm"
                    value={currentJob?.jobType || ''}
                    onChange={(e) => setCurrentJob(currentJob ? { ...currentJob, jobType: e.target.value } : null)}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>



    </DashboardLayout>
  );
};

export default AddJob;
