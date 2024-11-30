import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import DashboardLayout from '../../components/Interviewer/DashboardLayout';

// Registering Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const InterviewerHome: React.FC = () => {
  // Bar Chart Data
  const barChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Response Mails Sent',
        data: [10, 12, 5, 8],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Non-Technical Interviews',
        data: [7, 9, 3, 6],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Technical Interviews',
        data: [4, 6, 2, 5],
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Pie Chart Data
  const pieChartData = {
    labels: ['Technical', 'Non-Technical', 'Pending'],
    datasets: [
      {
        data: [15, 10, 5],  // Example data for pie chart
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 159, 64, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)'],
        borderWidth: 1,
      },
    ],
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen">
        {/* Upper half for Bar Chart */}
        <div className="flex-1 p-4 flex justify-center">
          <h2 className="text-2xl font-bold mb-4 text-center">Interview Statistics (Bar Chart)</h2>
          <div style={{ width: '80%', height: '50%' }}>
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        {/* Lower half for Pie Chart */}
        <div className="flex-1 p-4 flex justify-center">
          <h2 className="text-2xl font-bold mb-4 text-center">Interview Breakdown (Pie Chart)</h2>
          <div style={{ width: '50%', height: '50%' }}>
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewerHome;
