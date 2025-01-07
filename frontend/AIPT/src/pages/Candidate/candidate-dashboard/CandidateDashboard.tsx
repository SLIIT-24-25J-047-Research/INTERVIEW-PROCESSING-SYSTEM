import React from "react";
import CandidateLayout from "../../../components/Candidate/CandidateLayout";

const CandidateDashboard: React.FC = () => {
  const name = "Deneth";
  const data = [
    {
      jobRole: "Software Engineer -Intern",
      company: "TechCorp Inc.",
      mockupExam: "85/100",
      videoEval: "85/100",
      interview: "78/100",
      technical: "78/100",
      status: "rejected",
    },
    {
      jobRole: "Web Developer - Trainee",
      company: "Webify Solutions",
      mockupExam: "90/100",
      videoEval: "85/100",
      interview: "78/100",
      technical: "90/100",
      status: "approved",
    },
    {
      jobRole: "Software Engineer - Associate",
      company: "DataPro Ltd.",
      mockupExam: "78/100",
      videoEval: "78/100",
      interview: "78/100",
      technical: "78/100",
      status: "rejected",
    },
    {
      jobRole: "React Developer",
      company: "DesignHub",
      mockupExam: "92/100",
      videoEval: "85/100",
      interview: "78/100",
      technical: "88/100",
      status: "approved",
    },
  ];

  return (
    <CandidateLayout>
      <div className="font-sans my-8 px-10 max-w-[100%] mx-auto">
        <h1 className="text-2xl font-semibold mb-8 text-white bg-gradient-to-r from-[#6a11cb] to-[#2575fc] p-5 rounded-lg shadow-md uppercase tracking-wider w-fit mx-auto">
          Welcome, {name}
        </h1>

        <div className="flex justify-center flex-wrap gap-5">
          <div className="min-h-[300px] w-full max-w-[1200px] bg-white rounded-[30px] shadow-[3px_3px_10px_rgb(188,188,188)] p-8">
            <div className="flex justify-between items-center border-b-2 border-[rgba(0,20,151,0.59)] pb-4 mb-5">
              <h1 className="text-[28px] font-semibold text-[#5500cb]">
                Interview Results
              </h1>
              <button className="h-[35px] w-[90px] rounded-lg bg-[#5500cb] text-white text-[15px] border-none cursor-pointer">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table-auto w-full text-left border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-gray-600 font-semibold border-b">
                      Job Role
                    </th>
                    <th className="px-6 py-4 text-gray-600 font-semibold border-b">
                      Mockup Exam
                    </th>
                    <th className="px-6 py-4 text-gray-600 font-semibold border-b">
                      Video Evaluation
                    </th>
                    <th className="px-6 py-4 text-gray-600 font-semibold border-b">
                      Interview
                    </th>
                    <th className="px-6 py-4 text-gray-600 font-semibold border-b">
                      Technical
                    </th>
                    <th className="px-6 py-4 text-gray-600 font-semibold border-b">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="relative group">
                          <span>{item.jobRole}</span>
                          <span className="invisible group-hover:visible absolute w-[200px] bg-[#333] text-white text-center rounded-md py-[5px] px-[5px] bottom-[125%] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            Company: {item.company}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{item.mockupExam}</td>
                      <td className="px-6 py-4">{item.videoEval}</td>
                      <td className="px-6 py-4">{item.interview}</td>
                      <td className="px-6 py-4">{item.technical}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`py-[5px] px-[10px] text-white rounded inline-block text-sm font-medium
                            ${item.status === "approved" && "bg-[rgb(0,177,0)]"}
                            ${item.status === "rejected" && "bg-[#cb0700]"}
                            ${item.status === "pending" && "bg-orange-500"}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
};

export default CandidateDashboard;
