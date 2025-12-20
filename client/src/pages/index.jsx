import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ThumbsUp,
  Download,
  Users,
  Calendar,
  Umbrella,
  DollarSign,
  FileText,
  MessageSquare,
  BarChart3,
  Layers,
  Shield,
  FileCheck,
  User,
  Image,
  Menu,
  X,
  IndianRupee,
} from "lucide-react";
import logo from "../assets/flogo.jpg";
const Index = () => {
  const [selectedYear, setSelectedYear] = useState("2014");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    {
      value: "348",
      label: "Users",
      icon: Users,
      color: "from-orange-400 to-red-400",
      rotation: 45,
    },
    {
      value: "128",
      label: "Events",
      icon: Calendar,
      color: "from-blue-400 to-blue-500",
      rotation: -45,
    },
    {
      value: "10",
      label: "Holidays",
      icon: Umbrella,
      color: "from-yellow-400 to-orange-400",
      rotation: 45,
    },
    {
      value: "3458",
      label: "Payrolls",
      icon: IndianRupee,
      color: "from-green-400 to-emerald-400",
      rotation: -45,
    },
    {
      value: "3488",
      label: "Reports",
      icon: FileText,
      color: "from-purple-400 to-pink-400",
      rotation: 45,
    },
  ];

  const sidebarIcons = [
    { icon: MessageSquare, color: "from-blue-400 to-blue-500" },
    { icon: BarChart3, color: "from-purple-400 to-purple-500" },
    { icon: Users, color: "from-pink-400 to-pink-500" },
    { icon: Shield, color: "from-indigo-400 to-indigo-500" },
    { icon: Layers, color: "from-blue-400 to-cyan-500" },
    { icon: FileCheck, color: "from-purple-400 to-purple-500" },
    { icon: Image, color: "from-pink-400 to-rose-500" },
    { icon: User, color: "from-gray-400 to-gray-500" },
  ];

  const performanceData = [
    { team: "Developer Team", percentage: 85, color: "bg-orange-500" },
    { team: "Design Team", percentage: 84, color: "bg-cyan-500" },
    { team: "Marketing Team", percentage: 28, color: "bg-purple-500" },
    { team: "Management Team", percentage: 16, color: "bg-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 sm:p-6">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700"
      >
        {sidebarOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-20 bg-gray-900 shadow-2xl flex flex-col items-center py-6 space-y-6 border-r border-gray-800 z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg"> */}
        <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />

        {/* </div> */}

        {sidebarIcons.map((item, i) => {
          const IconComponent = item.icon;
          return (
            <div
              key={i}
              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                i === 0
                  ? "from-red-600 to-red-700"
                  : "from-gray-700 to-gray-800"
              } flex items-center justify-center hover:scale-110 cursor-pointer transition-transform shadow-md`}
            >
              <IconComponent className="w-5 h-5 text-white" />
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="lg:ml-24 lg:mr-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6 sm:mb-8 space-y-4 lg:space-y-0 pt-16 lg:pt-0">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
              Hello Admin!
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">
              Measure How Fast You're Growing Monthly Recurring
              <br className="hidden sm:block" />
              performance management.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-2 lg:space-x-4">
            <select className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 text-sm">
              <option>Year</option>
            </select>
            <input
              type="text"
              placeholder="Search..."
              className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gray-800 text-white placeholder-gray-500 rounded-lg border border-gray-700 sm:w-48 lg:w-64 text-sm focus:border-red-500 focus:outline-none"
            />
            <div className="flex items-center space-x-3 self-end sm:self-auto">
              <span className="text-xs sm:text-sm text-gray-400 flex items-center hidden sm:flex">
                🇺🇸 English ▼
              </span>
              <div className="relative">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-700 rounded-full"></div>
                <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-full text-white text-xs flex items-center justify-center">
                  2
                </span>
              </div>
              <div className="relative">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-700 rounded-full"></div>
                <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-full text-white text-xs flex items-center justify-center">
                  2
                </span>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-red-600 to-red-700"></div>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Overview
            </h2>
            <button className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow">
              + Create Notice
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-gray-800 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  {/* Circular Progress Indicator */}
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="5"
                        className="sm:hidden"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="#374151"
                        strokeWidth="6"
                        className="hidden sm:block"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        fill="none"
                        stroke={idx === 0 ? "#dc2626" : "#ef4444"}
                        strokeWidth="5"
                        strokeDasharray="125"
                        strokeDashoffset="31"
                        strokeLinecap="round"
                        className="sm:hidden"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke={idx === 0 ? "#dc2626" : "#ef4444"}
                        strokeWidth="6"
                        strokeDasharray="176"
                        strokeDashoffset="44"
                        strokeLinecap="round"
                        className="hidden sm:block"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                    </div>
                  </div>

                  {/* Stats Text */}
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Salary Statistics */}
          <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Salary Statistics
                </h3>
                <select className="px-2 sm:px-3 py-1 bg-gray-700 text-white rounded-lg border border-gray-600 text-xs sm:text-sm">
                  <option>▼</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6">
                <div className="text-xs hidden lg:block">
                  <div className="font-semibold text-white">2014</div>
                  <div className="text-gray-400">
                    Marketing: 2437 Design: 7689
                  </div>
                  <div className="text-gray-400">
                    Development: 7689 Others: 7688
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-gray-400">
                    Sort by
                  </span>
                  <select className="px-2 sm:px-3 py-1 bg-gray-700 text-white rounded-lg border border-gray-600 text-xs sm:text-sm">
                    <option>Years ▼</option>
                  </select>
                </div>
                <button className="p-2 hover:bg-gray-700 rounded-lg self-start sm:self-auto">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="h-48 sm:h-56 lg:h-64 relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>

              <svg
                className="w-full h-full pl-8"
                viewBox="0 0 800 250"
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                <line
                  x1="50"
                  y1="50"
                  x2="750"
                  y2="50"
                  stroke="#374151"
                  strokeWidth="1"
                />
                <line
                  x1="50"
                  y1="100"
                  x2="750"
                  y2="100"
                  stroke="#374151"
                  strokeWidth="1"
                />
                <line
                  x1="50"
                  y1="150"
                  x2="750"
                  y2="150"
                  stroke="#374151"
                  strokeWidth="1"
                />
                <line
                  x1="50"
                  y1="200"
                  x2="750"
                  y2="200"
                  stroke="#374151"
                  strokeWidth="1"
                />

                {/* Gray line (Others) */}
                <path
                  d="M 50 150 Q 100 170, 150 160 Q 200 145, 250 155 Q 300 165, 350 145 Q 400 130, 450 140 Q 500 155, 550 135 Q 600 120, 650 130 Q 700 145, 750 140"
                  fill="none"
                  stroke="#6b7280"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* White line (Development) */}
                <path
                  d="M 50 120 Q 100 110, 150 125 Q 200 135, 250 120 Q 300 105, 350 115 Q 400 125, 450 110 Q 500 100, 550 115 Q 600 130, 650 120 Q 700 110, 750 125"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Red line (Marketing) with highlighted point */}
                <path
                  d="M 50 170 Q 100 160, 150 145 Q 200 130, 250 115 Q 300 95, 350 80 Q 400 70, 450 85 Q 500 105, 550 95 Q 600 85, 650 100 Q 700 115, 750 105"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Highlighted point on red line */}
                <circle cx="350" cy="80" r="8" fill="#ef4444" />
                <circle cx="350" cy="80" r="4" fill="white" />
              </svg>

              <div className="absolute bottom-0 left-8 right-0 flex justify-between px-4 text-xs text-gray-500">
                <span>2010</span>
                <span>2011</span>
                <span>2012</span>
                <span>2013</span>
                <span>2014</span>
                <span>2015</span>
                <span>2016</span>
                <span>2017</span>
              </div>
            </div>
          </div>

          {/* Employee Satisfaction */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Employee Satisfaction
              </h3>
              <button className="p-2 hover:bg-gray-700 rounded-lg">
                <Download className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center justify-center h-48 sm:h-56 lg:h-64">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="65"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="16"
                    className="sm:hidden"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="65"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="16"
                    strokeDasharray="408"
                    strokeDashoffset="106"
                    strokeLinecap="round"
                    className="sm:hidden"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="20"
                    className="hidden sm:block"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="20"
                    strokeDasharray="502"
                    strokeDashoffset="130"
                    strokeLinecap="round"
                    className="hidden sm:block"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <ThumbsUp className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 mb-2" />
                  <div className="text-3xl sm:text-4xl font-bold text-white">
                    74%
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 text-xs text-gray-500">
                  0%
                </div>
                <div className="absolute bottom-0 right-0 text-xs text-gray-500">
                  100%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Performance Statistics */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Performance Statistics
              </h3>
              <button className="p-2 hover:bg-gray-700 rounded-lg">
                <Download className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-4 sm:space-y-5">
              {performanceData.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm text-gray-400">
                      {item.team}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        idx === 0
                          ? "bg-red-500"
                          : idx === 1
                          ? "bg-red-400"
                          : "bg-gray-600"
                      } rounded-full`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Employees */}
          <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <select className="px-3 sm:px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 text-xs sm:text-sm font-semibold">
                  <option>New Employees ▼</option>
                </select>
                <div className="text-xs">
                  <div className="font-semibold text-white">2014</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Male: 248</span>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white text-xs font-bold">
                      28%
                    </div>
                  </div>
                  <div className="text-gray-400">Female: 184</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-400">
                  Sort by
                </span>
                <select className="px-2 sm:px-3 py-1 bg-gray-700 text-white rounded-lg border border-gray-600 text-xs sm:text-sm">
                  <option>Years ▼</option>
                </select>
                <button className="p-2 hover:bg-gray-700 rounded-lg">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="h-40 sm:h-44 lg:h-48 relative">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>

              <svg className="w-full h-full pl-6" viewBox="0 0 900 200">
                {/* Grid lines */}
                <line
                  x1="50"
                  y1="40"
                  x2="850"
                  y2="40"
                  stroke="#374151"
                  strokeWidth="1"
                />
                <line
                  x1="50"
                  y1="90"
                  x2="850"
                  y2="90"
                  stroke="#374151"
                  strokeWidth="1"
                />
                <line
                  x1="50"
                  y1="140"
                  x2="850"
                  y2="140"
                  stroke="#374151"
                  strokeWidth="1"
                />

                {/* Year data - Male (Red) and Female (Gray) bars with gradients */}
                {[
                  { year: "2010", x: 60, male: 60, female: 80 },
                  { year: "", x: 110, male: 100, female: 50 },
                  { year: "2011", x: 160, male: 40, female: 100 },
                  { year: "", x: 210, male: 120, female: 40 },
                  { year: "2012", x: 260, male: 70, female: 90 },
                  { year: "", x: 310, male: 50, female: 110 },
                  { year: "2013", x: 360, male: 90, female: 70 },
                  { year: "", x: 410, male: 130, female: 100 },
                  {
                    year: "2014",
                    x: 460,
                    male: 110,
                    female: 60,
                    highlight: true,
                  },
                  { year: "", x: 510, male: 80, female: 120 },
                  {
                    year: "2015",
                    x: 560,
                    male: 120,
                    female: 80,
                    highlight: true,
                  },
                  { year: "", x: 610, male: 60, female: 100 },
                  {
                    year: "2016",
                    x: 660,
                    male: 100,
                    female: 90,
                    highlight: true,
                  },
                  { year: "", x: 710, male: 70, female: 50 },
                  { year: "2017", x: 760, male: 50, female: 110 },
                  { year: "", x: 810, male: 80, female: 60 },
                ].map((data, i) => (
                  <g key={i}>
                    {/* Male bars with gradient */}
                    <defs>
                      <linearGradient
                        id={`maleGrad${i}`}
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor={data.highlight ? "#ef4444" : "#4b5563"}
                          stopOpacity="0.9"
                        />
                        <stop
                          offset="100%"
                          stopColor={data.highlight ? "#dc2626" : "#374151"}
                          stopOpacity="0.6"
                        />
                      </linearGradient>
                      <linearGradient
                        id={`femaleGrad${i}`}
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#6b7280"
                          stopOpacity="0.7"
                        />
                        <stop
                          offset="100%"
                          stopColor="#4b5563"
                          stopOpacity="0.4"
                        />
                      </linearGradient>
                    </defs>
                    <rect
                      x={data.x}
                      y={180 - data.male}
                      width="18"
                      height={data.male}
                      fill={`url(#maleGrad${i})`}
                      rx="9"
                    />
                    <rect
                      x={data.x + 22}
                      y={180 - data.female}
                      width="18"
                      height={data.female}
                      fill={`url(#femaleGrad${i})`}
                      rx="9"
                    />
                  </g>
                ))}

                {/* Dotted trend line */}
                <path
                  d="M 70 110 L 170 95 L 270 105 L 370 90 L 470 70 L 570 85 L 670 80 L 770 100"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4,4"
                />

                {/* Highlighted points on trend line */}
                <circle cx="470" cy="70" r="6" fill="#ef4444" />
                <circle cx="470" cy="70" r="3" fill="white" />
                <circle cx="570" cy="85" r="6" fill="#ef4444" />
                <circle cx="570" cy="85" r="3" fill="white" />
              </svg>

              <div className="absolute bottom-0 left-6 right-0 flex justify-between px-8 text-xs text-gray-500">
                <span>2010</span>
                <span>2011</span>
                <span>2012</span>
                <span>2013</span>
                <span>2014</span>
                <span>2015</span>
                <span>2016</span>
                <span>2017</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
