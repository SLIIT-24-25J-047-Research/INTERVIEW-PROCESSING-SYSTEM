import React from 'react';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import DashboardLayout from '../../components/Interviewer/DashboardLayout';

// Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Chart options and data
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    },
  },
};

const workflowData = {
  labels: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
  datasets: [
    {
      label: 'Workflow Progress (%)',
      data: [25, 50, 75, 100],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
    },
  ],
};

const barChartData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Candidates Processed',
      data: [15, 20, 25, 30],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
  ],
};

const pieChartData = {
  labels: ['Technical', 'Non-Technical', 'Pending'],
  datasets: [
    {
      data: [50, 30, 20],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const doughnutChartData = {
  labels: ['Accepted', 'Rejected', 'On Hold'],
  datasets: [
    {
      data: [60, 25, 15],
      backgroundColor: [
        'rgba(75, 192, 192, 0.5)',
        'rgba(255, 99, 132, 0.5)',
        'rgba(255, 205, 86, 0.5)',
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 205, 86, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

// ChartCard Component
const ChartCard: React.FC<{
  title: string;
  ChartComponent: React.ElementType;
  data: any;
}> = ({ title, ChartComponent, data }) => (
  <div className="flex flex-col items-center justify-center border rounded-lg bg-white shadow-lg p-4 h-full">
    <h2 className="text-xl font-bold mb-4 text-gray-800">{title}</h2>
    <div className="w-full h-64">
      <ChartComponent data={data} options={chartOptions} />
    </div>
  </div>
);

// Main Page Component
const InterviewerHome: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-2 gap-6 p-6 bg-gray-100 min-h-screen">
        {/* Workflow Progress */}
        <div className="border border-gray-300 rounded-lg shadow-lg p-4 bg-blue-50">
          <ChartCard
            title="Workflow Progress"
            ChartComponent={Line}
            data={workflowData}
          />
        </div>

        {/* Candidates Processed */}
        <div className="border border-gray-300 rounded-lg shadow-lg p-4 bg-green-50">
          <ChartCard
            title="Candidates Processed Over Time"
            ChartComponent={Bar}
            data={barChartData}
          />
        </div>

        {/* Interview Breakdown */}
        <div className="border border-gray-300 rounded-lg shadow-lg p-4 bg-yellow-50">
          <ChartCard
            title="Interview Breakdown"
            ChartComponent={Pie}
            data={pieChartData}
          />
        </div>

        {/* Interview Results */}
        <div className="border border-gray-300 rounded-lg shadow-lg p-4 bg-red-50">
          <ChartCard
            title="Interview Results Distribution"
            ChartComponent={Doughnut}
            data={doughnutChartData}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewerHome;
