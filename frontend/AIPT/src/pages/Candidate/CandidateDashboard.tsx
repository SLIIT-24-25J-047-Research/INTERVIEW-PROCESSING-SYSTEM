import React from "react";
import CandidateLayout from "../../components/Candidate/CandidateLayout";

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
    <>
      <style>
        {`
          .dashboard {
            font-family: Arial, sans-serif;
            margin: 20px auto;
            text-align: center;
            max-width: 85%;
          }

          .welcome {
            font-size: 2rem;
            font-weight: 00;
            margin-bottom: 30px;
            color: #fff;
            background: linear-gradient(to right, #6a11cb, #2575fc);
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            text-transform: uppercase;
            letter-spacing: 1px;
            width: fit-content;
            margin: 0 auto;
          }

          .box-container {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
          }

          .report-container {
            min-height: 300px;
            width: 100%;
            max-width: 1200px;
            margin: 70px auto 0;
            background-color: #ffffff;
            border-radius: 30px;
            box-shadow: 3px 3px 10px rgb(188, 188, 188);
            padding: 20px;
          }

          .report-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid rgba(0, 20, 151, 0.59);
            padding: 20px;
          }

          .recent-Interviews {
            font-size: 30px;
            font-weight: 600;
            color: #5500cb;
          }

          .view {
            height: 35px;
            width: 90px;
            border-radius: 8px;
            background-color: #5500cb;
            color: white;
            font-size: 15px;
            border: none;
            cursor: pointer;
          }

          .report-body {
            max-width: 100%;
            overflow-x: auto;
            padding: 20px;
          }

          .report-topic-heading,
          .item1 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
            text-align: center;
            gap: 10px;
          }

          .report-topic-heading {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            border-bottom: 2px solid #ddd;
            padding-bottom: 10px;
          }

          .item1 {
            margin-top: 15px;
            font-size: 16px;
            color: #444;
            align-items: center;
          }

          .label-tag {
            padding: 5px 10px;
            background-color: rgb(0, 177, 0);
            color: white;
            border-radius: 4px;
            display: inline-block;
          }

          .label-tag.pending {
            background-color: orange;
          }

          .label-tag.rejected {
            background-color: #cb0700;
          }

          .label-tag.approved {
            background-color: rgb(0, 177, 0);
          }

          .tooltip {
            display: inline-block;
          }

          .tooltip .tooltiptext {
            visibility: hidden;
            width: 200px;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px;
            position: absolute;
            z-index: 1;
            bottom: 125%; /* Position above the text */
            left: 50%;
            transform: translateX(-50%);
            opacity: 0;
            transition: opacity 0.3s;
          }

          .tooltip:hover .tooltiptext {
            visibility: visible;
            opacity: 1;
          }
        `}
      </style>
      <CandidateLayout>
        <div className="dashboard">
          <h1 className="welcome">Welcome, {name}</h1>
          <div className="box-container">
            <div className="report-container">
              <div className="report-header">
                <h1 className="recent-Interviews">Interview Results</h1>
                <button className="view">View All</button>
              </div>

              <div className="report-body">
                <div className="report-topic-heading">
                  <h3>Job Role</h3>
                  <h3>Mockup Exam</h3>
                  <h3>Video Evaluation</h3>
                  <h3>Interview</h3>
                  <h3>Technical</h3>
                  <h3>Status</h3>
                </div>

                <div className="items">
                  {data.map((item, index) => (
                    <div key={index} className="item1">
                      <span className="tooltip">
                        {item.jobRole}
                        <span className="tooltiptext">
                          Company: {item.company}
                        </span>
                      </span>
                      <span>{item.mockupExam}</span>
                      <span>{item.videoEval}</span>
                      <span>{item.interview}</span>
                      <span>{item.technical}</span>
                      <span
                        className={`label-tag ${item.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CandidateLayout>
    </>
  );
};

export default CandidateDashboard;
