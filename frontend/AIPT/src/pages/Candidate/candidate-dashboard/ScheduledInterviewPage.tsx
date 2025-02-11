import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/Candidate/CandidateSidebar";
import Header from "../../../components/Candidate/CandidateHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import {
  Calendar,
  Clock,
  Video,

  Timer,

  Briefcase,
} from "lucide-react";
import {

  formatDistanceToNow,
} from "date-fns";

interface NonTechnicalSchedule {
  _id: string;
  userId: string;
  userName: string;
  interviewDate: string;
  interviewTime: string;
  media: string;
  status: string;
  jobId: {
    _id: string;
    description: string;
  };
}

interface TechnicalSchedule {
  _id: string;
  userId: string;
  userName: string;
  testDate: string;
  testTime: string;
  duration: number;
  status: string;
  testLink: string;
  jobId: string;
}

interface JobApplication {
  jobId: string;
  jobDescription: string;
  technicalInterview: TechnicalSchedule | null;
  nonTechnicalInterview: NonTechnicalSchedule | null;
}

const ScheduledInterviewPage: React.FC = () => {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const userId = "675932b49c1a60d97c147419";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const [technicalRes, nonTechnicalRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/t-interviews/schedule/user/${userId}`
          ),
          axios.get(
            `http://localhost:5000/api/non-t-interviews/schedule/user/${userId}`
          ),
        ]);

        const techSchedules = technicalRes.data?.schedules || [];
        const nonTechSchedules = nonTechnicalRes.data?.schedules || [];

        // Group interviews by jobId
        const applications = new Map<string, JobApplication>();

        techSchedules.forEach((tech: TechnicalSchedule) => {
          if (!applications.has(tech.jobId)) {
            applications.set(tech.jobId, {
              jobId: tech.jobId,
              jobDescription: "",
              technicalInterview: tech,
              nonTechnicalInterview: null,
            });
          } else {
            applications.get(tech.jobId)!.technicalInterview = tech;
          }
        });

        nonTechSchedules.forEach((nonTech: NonTechnicalSchedule) => {
          if (!applications.has(nonTech.jobId._id)) {
            applications.set(nonTech.jobId._id, {
              jobId: nonTech.jobId._id,
              jobDescription: nonTech.jobId.description,
              technicalInterview: null,
              nonTechnicalInterview: nonTech,
            });
          } else {
            const app = applications.get(nonTech.jobId._id)!;
            app.jobDescription = nonTech.jobId.description;
            app.nonTechnicalInterview = nonTech;
          }
        });

        setJobApplications(Array.from(applications.values()));
      } catch (error) {
        console.error("Error fetching interview schedules:", error);
      }
    };

    fetchInterviews();
  }, [userId]);

  const isTestDayAndTime = (
    testDate: string,
    testTime: string,
    duration: number
  ) => {
    const now = new Date();
    const startTime = new Date(testDate);
    const [time, meridian] = testTime.split(" ");
    const [hours, minutes] = time.split(":").map(Number);


    const adjustedHours =
      meridian === "PM" && hours !== 12
        ? hours + 12
        : meridian === "AM" && hours === 12
          ? 0
          : hours;

    startTime.setHours(adjustedHours, minutes, 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + duration);
    return now >= startTime && now <= endTime;
  };


  const isInterviewTimeValid = (interviewDate: string, interviewTime: string) => {
    const now = new Date();
    const startTime = new Date(interviewDate);
    const [time, meridian] = interviewTime.split(" ");
    const [hours, minutes] = time.split(":").map(Number);

    const adjustedHours =
      meridian === "PM" && hours !== 12
        ? hours + 12
        : meridian === "AM" && hours === 12
          ? 0
          : hours;

    startTime.setHours(adjustedHours, minutes, 0, 0);

    // Add a 30-minute buffer before and after the interview time
    const bufferStart = new Date(startTime);
    bufferStart.setMinutes(startTime.getMinutes() - 30);

    const bufferEnd = new Date(startTime);
    bufferEnd.setMinutes(startTime.getMinutes() + 30);

    return now >= bufferStart && now <= bufferEnd;
  };

  const handleStartTest = (interview: TechnicalSchedule) => {
    if (
      !isTestDayAndTime(
        interview.testDate,
        interview.testTime,
        interview.duration
      )
    ) {
      return;
    }

    navigate("/tech", {
      state: {
        interviewId: interview._id,
        testLink: interview.testLink,
        duration: interview.duration,
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "updated":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // const getProgress = (application: JobApplication) => {
  //   if (!application.technicalInterview) return 0;
  //   if (application.technicalInterview.status.toLowerCase() === 'completed') return 50;
  //   if (application.nonTechnicalInterview?.status.toLowerCase() === 'completed') return 100;
  //   return 25;
  // };

  const getStageStatus = (
    stage: "technical" | "nonTechnical",
    status?: string
  ) => {
    if (!status) return "pending";


    const technicalStatusMap: Record<string, string> = {
      scheduled: "scheduled",
      "in-progress": "in progress",
      updated: "rescheduled",
      completed: "completed",
      "not attended": "incomplete",
      canceled: "cancelled",
    };

    const nonTechnicalStatusMap: Record<string, string> = {
      scheduled: "scheduled",
      updated: "rescheduled",
      done: "completed",
      "not attended": "incomplete",
      canceled: "cancelled",
    };

    return stage === "technical"
      ? technicalStatusMap[status.toLowerCase()] || status
      : nonTechnicalStatusMap[status.toLowerCase()] || status;
  };

  const getTimeRemaining = (testDate: string, testTime: string) => {
    const now = new Date();
    const startTime = new Date(testDate);


    const [time, meridian] = testTime.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    const adjustedHours =
      meridian === "PM" && hours !== 12
        ? hours + 12
        : meridian === "AM" && hours === 12
          ? 0
          : hours;
    startTime.setHours(adjustedHours, minutes, 0, 0);

    if (now > startTime) {
      return "Interview has already started or ended.";
    }

    return `Starts ${formatDistanceToNow(startTime, { addSuffix: true })}`;
  };

  const getProgressSegments = (application: JobApplication) => {
    const techStatus = application.technicalInterview?.status.toLowerCase();
    const nonTechStatus = application.nonTechnicalInterview?.status.toLowerCase();
    const getTechProgress = () => {
      switch (techStatus) {
        case "completed":
          return "100%";
        case "in-progress":
          return "75%";
        case "scheduled":
          return "50%";
        default:
          return "0%";
      }
    };

    const getNonTechProgress = () => {
      switch (nonTechStatus) {
        case "done":
          return "100%";
        case "scheduled":
        case "updated":
          return techStatus === "completed" ? "50%" : "0%";
        default:
          return "0%";
      }
    };

    return [
      {
        label: "Technical Assessment",
        status: getStageStatus("technical", techStatus),
        completed: techStatus === "completed",
        active: techStatus === "scheduled" || techStatus === "in-progress",
        width: "50%",
        progress: getTechProgress(),
      },
      {
        label: "HR Interview",
        status: getStageStatus("nonTechnical", nonTechStatus),
        completed: nonTechStatus === "done",
        active: techStatus === "completed" &&
          (nonTechStatus === "scheduled" || nonTechStatus === "updated"),
        width: "50%",
        progress: getNonTechProgress(),
      },
    ];
  };

  return (
    <div className="mt-20 flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Interview Process" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {jobApplications.map((application) => (
              <Card key={application.jobId} className="overflow-hidden">
                <CardHeader className="bg-gray-50 border-b">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-gray-500" />
                    <CardTitle className="text-lg">
                      Job Application:{" "}
                      {application.jobDescription || "Position"}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="relative pt-1">
                      <div className="flex mb-4">
                        {getProgressSegments(application).map((segment, index) => (
                          <div
                            key={index}
                            className="relative"
                            style={{ width: segment.width }}
                          >
                            <div className="flex flex-col">
                              <div className="text-xs font-medium mb-1">
                                {segment.label}
                              </div>
                              <div className="relative h-2 w-full rounded overflow-hidden bg-gray-200">
                                <div
                                  className={`absolute top-0 left-0 h-full transition-all duration-300 ${segment.completed
                                    ? "bg-green-500"
                                    : segment.active
                                      ? "bg-blue-500"
                                      : "bg-gray-300"
                                    }`}
                                  style={{
                                    width: segment.progress,
                                  }}
                                />
                              </div>
                              <div className="text-xs mt-1 text-gray-600">
                                {segment.status}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">

                    {/* Technical Interview Card */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">
                        Technical Assessment
                      </h3>
                      {application.technicalInterview ? (
                        <Card>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  {formatDate(
                                    application.technicalInterview.testDate
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  {application.technicalInterview.testTime}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Timer className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">
                                  {application.technicalInterview.duration}{" "}
                                  minutes
                                </span>
                              </div>
                              {/* Time Remaining Section */}
                              <div className="flex items-center space-x-2">
                                <Timer className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {getTimeRemaining(
                                    application.technicalInterview.testDate,
                                    application.technicalInterview.testTime
                                  )}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    application.technicalInterview.status
                                  )}`}
                                >
                                  {application.technicalInterview.status}
                                </span>
                                {application.technicalInterview.status.toLowerCase() !==
                                  "completed" && (
                                    <Button
                                      onClick={() =>
                                        handleStartTest(
                                          application.technicalInterview!
                                        )
                                      }
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700"
                                      disabled={
                                        !isTestDayAndTime(
                                          application.technicalInterview!
                                            .testDate,
                                          application.technicalInterview!
                                            .testTime,
                                          application.technicalInterview!.duration
                                        )
                                      }
                                    >
                                      Start Test
                                    </Button>
                                  )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card className="bg-gray-50">
                          <CardContent className="p-4 text-center text-gray-500 text-sm">
                            Technical assessment not scheduled yet
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Non-Technical Interview Card */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900">
                        HR Interview
                      </h3>
                      <div
                        className={
                          application.technicalInterview?.status.toLowerCase() !==
                            "completed"
                            ? "opacity-50"
                            : ""
                        }
                      >
                        {application.nonTechnicalInterview ? (
                          <Card>
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">
                                    {formatDate(
                                      application.nonTechnicalInterview
                                        .interviewDate
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">
                                    {
                                      application.nonTechnicalInterview
                                        .interviewTime
                                    }
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Video className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">
                                    {application.nonTechnicalInterview.media}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Timer className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">
                                    {getTimeRemaining(
                                      application.nonTechnicalInterview.interviewDate,
                                      application.nonTechnicalInterview.interviewTime
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                      application.nonTechnicalInterview.status
                                    )}`}
                                  >
                                    {application.nonTechnicalInterview.status}
                                  </span>
                                  {application.nonTechnicalInterview.status.toLowerCase() !== "done" &&
                                    application.nonTechnicalInterview.status.toLowerCase() !== "canceled" && (
                                      <div className="space-y-2">
                                        {/* {application.technicalInterview?.status.toLowerCase() !== "completed" && (
                                          <p className="text-xs text-amber-600">
                                            Interview will be available after technical assessment is completed
                                          </p>
                                        )} */}
                                        <Button
                                          onClick={() => navigate(`/non-tech-interview?id=${application.nonTechnicalInterview?._id}`)}
                                          size="sm"
                                          className="bg-blue-600 hover:bg-blue-700"
                                          disabled={
                                            !isInterviewTimeValid(
                                              application.nonTechnicalInterview.interviewDate,
                                              application.nonTechnicalInterview.interviewTime
                                            ) ||
                                            application.technicalInterview?.status.toLowerCase() !== "completed"
                                          }
                                        >
                                          Join Interview
                                        </Button>

                                      </div>
                                    )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card className="bg-gray-50">
                            <CardContent className="p-4 text-center text-gray-500 text-sm">
                              HR interview will be scheduled after technical
                              assessment
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};


export default ScheduledInterviewPage;
