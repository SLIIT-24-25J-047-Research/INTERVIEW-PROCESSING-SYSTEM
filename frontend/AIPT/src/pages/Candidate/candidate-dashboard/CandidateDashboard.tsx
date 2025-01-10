'use client'

// import { DashboardHeader } from './dashboard-header'
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

    const { user } = useAuth(); 


  return (
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
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Your Only Place to Apply for the jobs</h2>
                <p className="text-purple-100">APT 2.9 is online interview platform, we make recruiting more easy.</p>
                {/* <Button variant="secondary" className="mt-4">
                  Learn More
                </Button> */}
              </div>
              <div className="hidden md:block">
                {/* Add your 3D graphics here */}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl font-bold">7</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Applications</p>
                <h3 className="text-xl font-semibold">7</h3>
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
  
  )
}

