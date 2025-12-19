import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  Download,
  Plus,
  User,
  Phone,
  Mail,
  X,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Activity
} from 'lucide-react';

const GymAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'monthly'

  // Mock members data
  useEffect(() => {
    const mockMembers = [
      {
        id: 1,
        name: 'Alex Thompson',
        email: 'alex@example.com',
        phone: '+1 234-567-8900',
        membershipType: 'Premium',
        joinDate: '2024-01-15',
        status: 'Active',
        photo: null
      },
      {
        id: 2,
        name: 'Jessica Brown',
        email: 'jessica@example.com',
        phone: '+1 234-567-8901',
        membershipType: 'VIP',
        joinDate: '2024-02-20',
        status: 'Active',
        photo: null
      },
      {
        id: 3,
        name: 'David Martinez',
        email: 'david@example.com',
        phone: '+1 234-567-8902',
        membershipType: 'Basic',
        joinDate: '2024-03-10',
        status: 'Active',
        photo: null
      },
      {
        id: 4,
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+1 234-567-8903',
        membershipType: 'Premium',
        joinDate: '2024-01-08',
        status: 'Active',
        photo: null
      },
      {
        id: 5,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+1 234-567-8904',
        membershipType: 'Basic',
        joinDate: '2024-04-05',
        status: 'Active',
        photo: null
      },
      {
        id: 6,
        name: 'Emily Davis',
        email: 'emily@example.com',
        phone: '+1 234-567-8905',
        membershipType: 'VIP',
        joinDate: '2024-02-28',
        status: 'Active',
        photo: null
      }
    ];
    setMembers(mockMembers);
  }, []);

  // Mock attendance data
  useEffect(() => {
    const mockAttendance = members.map(member => ({
      id: member.id,
      memberId: member.id,
      name: member.name,
      membershipType: member.membershipType,
      checkInTime: Math.random() > 0.3 ? `08:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : null,
      checkOutTime: Math.random() > 0.4 ? `18:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : null,
      status: Math.random() > 0.2 ? 'present' : Math.random() > 0.5 ? 'absent' : 'late',
      notes: Math.random() > 0.8 ? 'Personal training session' : ''
    }));
    setAttendance(mockAttendance);
  }, [members]);

  // Filter members based on search and status
  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.membershipType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    late: attendance.filter(a => a.status === 'late').length,
    checkedIn: attendance.filter(a => a.checkInTime).length,
    checkedOut: attendance.filter(a => a.checkOutTime).length
  };

  const handleCheckIn = (memberId) => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setAttendance(prev => prev.map(record => 
      record.memberId === memberId 
        ? { ...record, checkInTime: timeString, status: 'present' }
        : record
    ));
  };

  const handleCheckOut = (memberId) => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    setAttendance(prev => prev.map(record => 
      record.memberId === memberId 
        ? { ...record, checkOutTime: timeString }
        : record
    ));
  };

  const handleStatusChange = (memberId, newStatus) => {
    setAttendance(prev => prev.map(record => 
      record.memberId === memberId 
        ? { ...record, status: newStatus }
        : record
    ));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'absent': return 'bg-red-600/20 text-red-400 border-red-500/30';
      case 'late': return 'bg-orange-600/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    }
  };

  const getMembershipColor = (type) => {
    switch(type) {
      case 'VIP': return 'bg-purple-600/20 text-purple-400 border-purple-500/30';
      case 'Premium': return 'bg-red-600/20 text-red-400 border-red-500/30';
      case 'Basic': return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Attendance Tracking</h1>
            <p className="text-gray-400">Manage member check-ins and attendance records</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={() => setIsStatsOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              View Stats
            </button>
            <button
              onClick={() => setIsMemberModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Member
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold mb-2">Total Members</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>All active members</span>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold mb-2">Present Today</p>
                <p className="text-3xl font-bold text-white">{stats.present}</p>
              </div>
              <div className="p-3 bg-green-600/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-400">
              <Activity className="w-4 h-4 mr-1" />
              <span>{Math.round((stats.present / stats.total) * 100)}% attendance rate</span>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold mb-2">Checked In</p>
                <p className="text-3xl font-bold text-white">{stats.checkedIn}</p>
              </div>
              <div className="p-3 bg-orange-600/20 rounded-lg">
                <Clock className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              {stats.checkedOut} members checked out
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold mb-2">Absent</p>
                <p className="text-3xl font-bold text-white">{stats.absent}</p>
              </div>
              <div className="p-3 bg-red-600/20 rounded-lg">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              {stats.late} members arrived late
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            {/* Date Selection */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-4 py-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-white font-semibold focus:outline-none"
                />
              </div>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <div className="text-white font-semibold hidden sm:block">
                {formatDate(selectedDate)}
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
              </select>

              <button className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Today's Attendance</h2>
            <div className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Membership</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Check-in</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Check-out</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredAttendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold">
                          {record.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{record.name}</div>
                          <div className="text-xs text-gray-500">ID: {record.memberId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getMembershipColor(record.membershipType)}`}>
                        {record.membershipType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {record.checkInTime ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-semibold">{record.checkInTime}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleCheckIn(record.memberId)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors"
                        >
                          Check In
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {record.checkOutTime ? (
                        <div className="flex items-center gap-2 text-blue-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-semibold">{record.checkOutTime}</span>
                        </div>
                      ) : record.checkInTime ? (
                        <button
                          onClick={() => handleCheckOut(record.memberId)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                        >
                          Check Out
                        </button>
                      ) : (
                        <span className="text-gray-500 text-sm">Not checked in</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={record.status}
                        onChange={(e) => handleStatusChange(record.memberId, e.target.value)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(record.status)} bg-transparent cursor-pointer`}
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="excused">Excused</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedMember(record)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
                        </button>
                        <button 
                          className="p-2 hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4 text-gray-400 hover:text-blue-400" />
                        </button>
                        <button 
                          className="p-2 hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAttendance.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No members found</p>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Modal */}
      {isStatsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Attendance Statistics</h2>
                <button 
                  onClick={() => setIsStatsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Attendance Chart Placeholder */}
                <div className="bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Attendance Overview</h3>
                  <div className="h-64 bg-gray-600/30 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                      <p>Attendance chart visualization</p>
                    </div>
                  </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Status Distribution</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Present', value: stats.present, color: 'bg-green-500', percentage: Math.round((stats.present / stats.total) * 100) },
                      { label: 'Absent', value: stats.absent, color: 'bg-red-500', percentage: Math.round((stats.absent / stats.total) * 100) },
                      { label: 'Late', value: stats.late, color: 'bg-orange-500', percentage: Math.round((stats.late / stats.total) * 100) },
                      { label: 'Not Checked In', value: stats.total - stats.checkedIn, color: 'bg-gray-500', percentage: Math.round(((stats.total - stats.checkedIn) / stats.total) * 100) }
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm text-gray-300 mb-1">
                          <span>{item.label}</span>
                          <span>{item.value} ({item.percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div 
                            className={`${item.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Peak Hours */}
                <div className="bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Peak Hours</h3>
                  <div className="space-y-3">
                    {['06:00-08:00', '08:00-10:00', '17:00-19:00', '19:00-21:00'].map((time, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-600/30 rounded-lg">
                        <span className="text-white font-medium">{time}</span>
                        <span className="text-green-400 font-semibold">
                          {Math.floor(Math.random() * 20) + 10} members
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Membership Type Stats */}
                <div className="bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Attendance by Membership</h3>
                  <div className="space-y-4">
                    {[
                      { type: 'VIP', count: Math.floor(Math.random() * 10) + 5, total: 15 },
                      { type: 'Premium', count: Math.floor(Math.random() * 20) + 10, total: 25 },
                      { type: 'Basic', count: Math.floor(Math.random() * 30) + 15, total: 40 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-600/30 rounded-lg">
                        <div>
                          <span className="text-white font-medium">{item.type}</span>
                          <div className="text-sm text-gray-400">
                            {item.count} of {item.total} members present
                          </div>
                        </div>
                        <span className="text-lg font-bold text-green-400">
                          {Math.round((item.count / item.total) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-red-600 to-red-700 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Add New Member</h2>
                <button 
                  onClick={() => setIsMemberModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter member's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="member@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="+1 234-567-8900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Membership Type
                </label>
                <select className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="Basic">Basic</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsMemberModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GymAttendance;