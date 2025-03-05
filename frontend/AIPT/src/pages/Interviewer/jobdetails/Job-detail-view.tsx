import React from "react"
import DashboardLayout from "../../../components/Interviewer/DashboardLayout"

interface JobDetailProps {
    job: {
        _id?: string
        jobID: string
        jobRole: string
        description: string
        company: string
        location: string
        salary?: number
        jobType: string
        createdAt?: string
        updatedAt?: string
    }
    onClose: () => void
}

export default function JobDetailView({ job, onClose }: JobDetailProps) {
    // Format salary with commas
    const formatSalary = (salary?: number) => {
        if (!salary) return "Not specified"
        return `$${salary.toLocaleString()}`
    }

    // Format job role for display
    const formatJobRole = (role: string) => {
        if (role === "software-engineer-intern") return "Software Engineer Intern"
        if (role === "software-engineer-associate") return "Software Engineer Associate"
        return role
    }

    // Format date
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A"
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }


    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // Simulate loading data
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
        return <DashboardLayout>Loading...</DashboardLayout>;
    }


    return (
        <DashboardLayout>
            <div className="add-job-container">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">{formatJobRole(job.jobRole)}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ×
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-sm text-gray-500">Job ID</p>
                        <p className="font-medium">{job.jobID}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Company</p>
                        <p className="font-medium">{job.company}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{job.location}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Job Type</p>
                        <p className="font-medium">{job.jobType}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Salary</p>
                        <p className="font-medium">{formatSalary(job.salary)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Posted Date</p>
                        <p className="font-medium">{formatDate(job.createdAt)}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">{job.description}</div>
                </div>

                <div className="text-sm text-gray-500">Last updated: {formatDate(job.updatedAt)}</div>
            </div>

        </DashboardLayout>
    )
}

