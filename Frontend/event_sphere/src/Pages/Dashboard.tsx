import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/Card";

const Dashboard = () => {
  const [stats, setStats] = useState({
    attendees: 0,
    exhibitors: 0,
    companies: 0,
    booths: 0,
    expos: 0,
    recentUsers: [],
    recentExpos: [],
    recentBooths: []
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('/api/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    })();
  }, []);

  const totalUsers = stats.attendees + stats.exhibitors;

  const cards = [
    { title: "Attendees", value: stats.attendees, gradient: "bg-gradient-to-r from-purple-500 to-purple-700" },
    { title: "Exhibitors", value: stats.exhibitors, gradient: "bg-gradient-to-r from-pink-500 to-purple-600" },
    { title: "Companies", value: stats.companies, gradient: "bg-gradient-to-r from-indigo-500 to-purple-600" },
    { title: "Booths", value: stats.booths, gradient: "bg-gradient-to-r from-blue-500 to-purple-700" },
    { title: "Expos", value: stats.expos, gradient: "bg-gradient-to-r from-green-400 to-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-900 to-black p-8 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center text-purple-300 drop-shadow-lg">Admin Dashboard</h1>

      {/* ---------------- Recent Items ---------------- */}
      <h2 className="text-3xl font-semibold mb-4 text-gray-300">Recently Activation</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Users */}
        <Card className="bg-black/80 backdrop-blur-md text-white shadow-xl rounded-2xl p-4 border border-purple-700 hover:scale-105 hover:shadow-2xl transition-transform duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-purple-400">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-gray-300">
              {stats.recentUsers.map(user => (
                <li key={user._id} className="hover:text-purple-300 transition-colors duration-200">
                  {user.name} ({user.role})
                  <span className="text-gray-500 text-sm"> - Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recent Expos */}
        <Card className="bg-black/80 backdrop-blur-md text-white shadow-xl rounded-2xl p-4 border border-purple-700 hover:scale-105 hover:shadow-2xl transition-transform duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-green-400">Recent Expos</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-gray-300">
              {stats.recentExpos.map(expo => (
                <li key={expo._id} className="hover:text-purple-300 transition-colors duration-200">
                  <span className="font-semibold">{expo.name}</span> - {new Date(expo.startDate).toLocaleDateString()} to {new Date(expo.endDate).toLocaleDateString()}
                  <span className="text-gray-500 text-sm"> (Created: {new Date(expo.createdAt).toLocaleDateString()})</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recent Booths */}
        <Card className="bg-black/80 backdrop-blur-md text-white shadow-xl rounded-2xl p-4 border border-purple-700 hover:scale-105 hover:shadow-2xl transition-transform duration-300">
          <CardHeader>
            <CardTitle className="text-xl text-blue-400">Recent Booths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-gray-300">
              {stats.recentBooths.map(booth => (
                <li key={booth._id} className="hover:text-purple-300 transition-colors duration-200">
                  <span className="font-semibold">{booth.boothNumber}</span> - Floor: {booth.floor} - Expo: {booth.expoId?.name || 'N/A'}
                  <span className="text-gray-500 text-sm"> (Created: {new Date(booth.createdAt).toLocaleDateString()})</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* ---------------- Total Users Summary ---------------- */}
      <Card className="bg-black/80 backdrop-blur-md text-white shadow-2xl rounded-2xl mb-8 border border-purple-700 hover:scale-105 hover:shadow-3xl transition-transform duration-300">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-300">Total Users</CardTitle>
          <CardDescription className="text-gray-400">
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

      {/* ---------------- Individual Stats ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <Card
            key={idx}
            className={`${card.gradient} bg-opacity-20 backdrop-blur-md text-white shadow-lg rounded-2xl hover:scale-105 hover:shadow-2xl transition-transform duration-300 border border-purple-700`}
          >
            <CardHeader>
              <CardTitle className="text-xl">{card.title}</CardTitle>
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
  );
};

export default Dashboard;
