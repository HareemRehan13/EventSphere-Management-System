import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { TrendingUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/Card"

const Dashboard = () => {
  const [stats, setStats] = useState({
    attendees: 0,
    exhibitors: 0,
    companies: 0,
    booths: 0,
    expos: 0
  })

  useEffect(() => {
    ;(async () => {
      try {
        const response = await axios.get('/api/stats')
        setStats(response.data)
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    })()
  }, [])

  const totalUsers = stats.attendees + stats.exhibitors

  const cards = [
    { title: "Attendees", value: stats.attendees, color: "text-purple-400" },
    { title: "Exhibitors", value: stats.exhibitors, color: "text-pink-400" },
    { title: "Companies", value: stats.companies, color: "text-indigo-400" },
    { title: "Booths", value: stats.booths, color: "text-blue-400" },
    { title: "Expos", value: stats.expos, color: "text-green-400" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 p-8 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Total Users Summary */}
      <Card className="bg-white/10 backdrop-blur-md text-white shadow-2xl rounded-2xl mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Total Users</CardTitle>
          <CardDescription className="text-gray-300">
            Combined number of attendees & exhibitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold">{totalUsers}</p>
        </CardContent>
        <CardFooter className="flex items-center gap-2 text-sm text-pink-400">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </CardFooter>
      </Card>

      {/* Individual Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <Card
            key={idx}
            className="bg-white/10 backdrop-blur-md text-white shadow-lg rounded-2xl hover:scale-105 transition-transform"
          >
            <CardHeader>
              <CardTitle className={`text-xl ${card.color}`}>{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{card.value}</p>
            </CardContent>
            <CardFooter className="text-gray-300 text-sm">
              Showing live count from database
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
