import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Users,
  Calendar,
  Activity,
  TrendingUp,
  Clock,
  Target,
  Bell,
  Settings,
  LogOut,
  UserCheck,
  BarChart3,
  Dumbbell,
  CheckCircle,
} from "lucide-react";
import { logout } from "../../../store/auth/auth-slice";

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login");
  };

  // Sample data - would come from API in real implementation
  const stats = {
    totalClients: 24,
    todaySessions: 8,
    completedSessions: 6,
    upcomingSessions: 2,
  };

  const todaySchedule = [
    {
      id: 1,
      time: "09:00",
      client: "John Doe",
      type: "Personal Training",
      status: "completed",
    },
    {
      id: 2,
      time: "10:30",
      client: "Jane Smith",
      type: "Fitness Assessment",
      status: "completed",
    },
    {
      id: 3,
      time: "14:00",
      client: "Mike Johnson",
      type: "Strength Training",
      status: "upcoming",
    },
    {
      id: 4,
      time: "15:30",
      client: "Sarah Wilson",
      type: "Cardio Session",
      status: "upcoming",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Completed session with John Doe",
      time: "2 hours ago",
      type: "session",
    },
    {
      id: 2,
      action: "Updated workout plan for Jane Smith",
      time: "4 hours ago",
      type: "update",
    },
    {
      id: 3,
      action: "New client assessment scheduled",
      time: "1 day ago",
      type: "schedule",
    },
    {
      id: 4,
      action: "Completed monthly progress review",
      time: "2 days ago",
      type: "review",
    },
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Trainer Dashboard</h1>
            <p className="text-gray-400 text-sm">{formatDate(currentTime)}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-semibold">
                {user?.fullName || "Trainer"}
              </p>
              <p className="text-gray-400 text-sm capitalize">
                {user?.role || "trainer"}
              </p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Good{" "}
                  {currentTime.getHours() < 12
                    ? "Morning"
                    : currentTime.getHours() < 18
                    ? "Afternoon"
                    : "Evening"}
                  , {user?.fullName?.split(" ")[0] || "Trainer"}!
                </h2>
                <p className="text-blue-100">
                  You have {stats.upcomingSessions} sessions scheduled for today
                  • Current time: {formatTime(currentTime)}
                </p>
              </div>
              <div className="hidden md:block">
                <Dumbbell className="w-16 h-16 text-blue-200" />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Clients</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.totalClients}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Today's Sessions</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.todaySessions}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Completed</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.completedSessions}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Upcoming</p>
                  <p className="text-3xl font-bold text-white">
                    {stats.upcomingSessions}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Schedule */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Today's Schedule
                  </h3>
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>

                <div className="space-y-4">
                  {todaySchedule.map((session) => (
                    <div
                      key={session.id}
                      className={`p-4 rounded-lg border ${
                        session.status === "completed"
                          ? "bg-green-600/10 border-green-500/30"
                          : "bg-gray-700/50 border-gray-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              session.status === "completed"
                                ? "bg-green-600"
                                : "bg-blue-600"
                            }`}
                          >
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              {session.client}
                            </p>
                            <p className="text-sm text-gray-400">
                              {session.type}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-white">
                            {session.time}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              session.status === "completed"
                                ? "bg-green-600/20 text-green-400"
                                : "bg-orange-600/20 text-orange-400"
                            }`}
                          >
                            {session.status === "completed" ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Completed
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" />
                                Upcoming
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {todaySchedule.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No sessions scheduled for today</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Recent Activities
                  </h3>
                  <Activity className="w-5 h-5 text-gray-400" />
                </div>

                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === "session"
                            ? "bg-green-500"
                            : activity.type === "update"
                            ? "bg-blue-500"
                            : activity.type === "schedule"
                            ? "bg-orange-500"
                            : "bg-purple-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm">{activity.action}</p>
                        <p className="text-gray-400 text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mt-6">
                <h3 className="text-xl font-semibold text-white mb-6">
                  Quick Actions
                </h3>

                <div className="space-y-3">
                  <button className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    View My Clients
                  </button>

                  <button className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    Schedule Session
                  </button>

                  <button className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-3">
                    <BarChart3 className="w-5 h-5" />
                    Progress Reports
                  </button>

                  <button className="w-full p-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors flex items-center gap-3">
                    <Settings className="w-5 h-5" />
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
