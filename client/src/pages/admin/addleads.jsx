import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, User, Mail, Phone, Calendar, MessageSquare, Tag, AlertCircle, Clock, CheckCircle, XCircle, Edit, Trash2, Plus, PhoneCall, Send, Eye, History } from 'lucide-react';
import {
  fetchAllLeads,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStatus,
  addFollowUp,
  fetchLeadStatistics,
  clearError,
  clearSuccess,
} from '../../store/admin/leads-slice';

const GymLeadsTracking = () => {
  const dispatch = useDispatch();
  const { leads, statistics, isLoading, error, success, message, pagination } = useSelector((state) => state.leads);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentLeadId, setCurrentLeadId] = useState(null);
  const [followUpNote, setFollowUpNote] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpMethod, setFollowUpMethod] = useState('Phone');
  const [followUpOutcome, setFollowUpOutcome] = useState('No Response');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    leadSource: 'Walk-in',
    interestedPackage: 'Not Decided',
    budgetRange: 'Not Disclosed',
    contactMethod: 'Phone',
    notes: '',
    leadStatus: 'New',
    nextFollowUpDate: '',
    leadPriority: 'Medium',
  });

  // Fetch leads and statistics on component mount
  useEffect(() => {
    dispatch(fetchAllLeads({ page: 1, limit: 50 }));
    dispatch(fetchLeadStatistics());
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      alert(message || 'Operation successful!');
      dispatch(clearSuccess());
      setIsDrawerOpen(false);
      setIsFollowUpOpen(false);
      resetForm();
      dispatch(fetchAllLeads({ page: 1, limit: 50 }));
      dispatch(fetchLeadStatistics());
    }
  }, [success, message, dispatch]);

  useEffect(() => {
    if (error) {
      alert(`Error: ${error}`);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      leadSource: 'Walk-in',
      interestedPackage: 'Not Decided',
      budgetRange: 'Not Disclosed',
      contactMethod: 'Phone',
      notes: '',
      leadStatus: 'New',
      nextFollowUpDate: '',
      leadPriority: 'Medium',
    });
    setEditMode(false);
    setCurrentLeadId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.phoneNumber || !formData.email) {
      alert('Please fill in required fields: Name, Email, and Phone');
      return;
    }

    // ✅ Don't send addedDate - let the server handle it
    const leadData = {
      ...formData,
      // Remove this line: addedDate: new Date().toISOString(),
    };

    if (editMode && currentLeadId) {
      dispatch(updateLead({ id: currentLeadId, updateData: leadData }));
    } else {
      dispatch(createLead(leadData));
    }
  };

  const handleEdit = (lead) => {
    setEditMode(true);
    setCurrentLeadId(lead._id);
    setFormData({
      fullName: lead.fullName,
      email: lead.email,
      phoneNumber: lead.phoneNumber,
      leadSource: lead.leadSource,
      interestedPackage: lead.interestedPackage,
      budgetRange: lead.budgetRange,
      contactMethod: lead.contactMethod,
      notes: lead.notes || '',
      leadStatus: lead.leadStatus,
      nextFollowUpDate: lead.nextFollowUpDate ? new Date(lead.nextFollowUpDate).toISOString().split('T')[0] : '',
      leadPriority: lead.leadPriority,
    });
    setIsDrawerOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      dispatch(deleteLead(id));
    }
  };

  const openFollowUp = (lead) => {
    setSelectedLead(lead);
    setIsFollowUpOpen(true);
    setFollowUpNote('');
    setFollowUpDate(new Date().toISOString().split('T')[0]);
    setFollowUpMethod('Phone');
    setFollowUpOutcome('No Response');
    setNextFollowUpDate('');
  };

  const openDetail = (lead) => {
    setSelectedLead(lead);
    setIsDetailOpen(true);
  };

  const handleAddFollowUp = () => {
    if (!followUpNote.trim() || !selectedLead) {
      alert('Please enter follow-up notes');
      return;
    }

    const followUpData = {
      date: new Date(followUpDate),
      method: followUpMethod,
      notes: followUpNote,
      outcome: followUpOutcome,
      nextFollowUpDate: nextFollowUpDate ? new Date(nextFollowUpDate) : null,
    };

    dispatch(addFollowUp({ id: selectedLead._id, followUpData }));
  };

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateLeadStatus({ id, status: newStatus }));
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (filter === 'all') {
      dispatch(fetchAllLeads({ page: 1, limit: 50 }));
    } else if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      dispatch(fetchAllLeads({ 
        page: 1, 
        limit: 50,
        // Filter will be handled on backend for today's follow-ups
      }));
    } else {
      dispatch(fetchAllLeads({ 
        page: 1, 
        limit: 50, 
        status: filter 
      }));
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Hot': return 'bg-red-600/20 text-red-400 border-red-500/30';
      case 'Warm': return 'bg-orange-600/20 text-orange-400 border-orange-500/30';
      case 'Cold': return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      case 'Converted': return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'Lost': return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
      case 'New': return 'bg-purple-600/20 text-purple-400 border-purple-500/30';
      default: return 'bg-purple-600/20 text-purple-400 border-purple-500/30';
    }
  };

  const getSourceIcon = (source) => {
    switch(source) {
      case 'Walk-in': return '🚶';
      case 'Instagram': return '📸';
      case 'Facebook': return '👥';
      case 'Google': return '🔍';
      case 'Google Ads': return '🔍';
      case 'Referral': return '🤝';
      case 'Website': return '🌐';
      case 'WhatsApp': return '💬';
      default: return '📱';
    }
  };

  const getFollowUpIcon = (method) => {
    switch(method) {
      case 'Phone': return <PhoneCall className="w-4 h-4" />;
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'In-Person': return <Calendar className="w-4 h-4" />;
      case 'WhatsApp': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const filteredLeads = activeFilter === 'today' 
    ? leads.filter(lead => {
        if (!lead.nextFollowUpDate) return false;
        const followUpDate = new Date(lead.nextFollowUpDate).toISOString().split('T')[0];
        const today = new Date().toISOString().split('T')[0];
        return followUpDate === today;
      })
    : leads;

  const stats = [
    { label: 'Total Leads', value: statistics.totalLeads || leads.length, color: 'from-red-600 to-red-700' },
    { label: 'Hot Leads', value: statistics.hotLeads || leads.filter(l => l.leadStatus === 'Hot').length, color: 'from-orange-600 to-red-600' },
    { label: 'Converted', value: statistics.convertedLeads || leads.filter(l => l.leadStatus === 'Converted').length, color: 'from-green-600 to-green-700' },
    { label: 'Follow-ups Today', value: statistics.todaysFollowUps || 0, color: 'from-blue-600 to-blue-700' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Lead Tracking</h1>
            <p className="text-gray-400 text-sm">Manage potential members and follow-ups</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsDrawerOpen(true);
            }}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Lead
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
              <div className={`inline-block px-3 py-1 rounded-lg bg-gradient-to-r ${stat.color} text-white text-sm font-semibold mb-3`}>
                {stat.label}
              </div>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeFilter === 'all' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All Leads
            </button>
            <button 
              onClick={() => handleFilterChange('New')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeFilter === 'New' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              New
            </button>
            <button 
              onClick={() => handleFilterChange('Hot')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeFilter === 'Hot' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Hot
            </button>
            <button 
              onClick={() => handleFilterChange('Warm')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeFilter === 'Warm' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Warm
            </button>
            <button 
              onClick={() => handleFilterChange('Cold')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeFilter === 'Cold' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Cold
            </button>
            <button 
              onClick={() => handleFilterChange('today')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeFilter === 'today' 
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Follow-up Today
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">
              {activeFilter === 'all' ? 'All Leads' : 
               activeFilter === 'today' ? 'Follow-ups Today' : 
               `${activeFilter} Leads`}
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
              <p className="text-gray-400 mt-4">Loading leads...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No leads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Lead Info</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Interest</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Budget</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Follow-up</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-semibold">
                            {lead.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{lead.fullName}</div>
                            <div className="text-xs text-gray-500">
                              Added: {new Date(lead.addedDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-300">{lead.email}</div>
                        <div className="text-xs text-gray-500">{lead.phoneNumber}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-700 text-gray-300">
                            {lead.contactMethod}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getSourceIcon(lead.leadSource)}</span>
                          <span className="text-sm text-gray-300">{lead.leadSource}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          lead.interestedPackage === 'VIP' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' :
                          lead.interestedPackage === 'Premium' ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' :
                          'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
                        }`}>
                          {lead.interestedPackage}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-white">{lead.budgetRange}</div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.leadStatus}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(lead.leadStatus)} bg-transparent cursor-pointer`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Hot">Hot</option>
                          <option value="Warm">Warm</option>
                          <option value="Cold">Cold</option>
                          <option value="Converted">Converted</option>
                          <option value="Lost">Lost</option>
                        </select>
                        <div className="text-xs text-gray-500 mt-1">
                          {lead.totalFollowUps || 0} follow-ups
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {lead.nextFollowUpDate ? (
                          <div className={`text-sm ${
                            new Date(lead.nextFollowUpDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                              ? 'text-red-400 font-semibold' 
                              : new Date(lead.nextFollowUpDate) < new Date()
                              ? 'text-orange-400'
                              : 'text-gray-300'
                          }`}>
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {new Date(lead.nextFollowUpDate).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">No follow-up</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openFollowUp(lead)}
                            className="p-2 hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Add Follow-up"
                          >
                            <MessageSquare className="w-4 h-4 text-blue-400 hover:text-blue-300" />
                          </button>
                          <button 
                            onClick={() => openDetail(lead)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors" 
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-gray-400 hover:text-white" />
                          </button>
                          <button 
                            onClick={() => handleEdit(lead)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-gray-400 hover:text-white" />
                          </button>
                          <button 
                            onClick={() => handleDelete(lead._id)}
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
          )}
        </div>
      </div>

      {/* Add/Edit Lead Drawer */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsDrawerOpen(false)}
        />
        
        <div className={`absolute right-0 top-0 h-full w-full sm:w-[500px] bg-gray-800 border-l border-gray-700 shadow-2xl transition-transform duration-300 overflow-y-auto ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-red-600 to-red-700 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editMode ? 'Edit Lead' : 'Add New Lead'}
                </h2>
                <button 
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter lead's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="lead@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="+1 234-567-8900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Lead Source
                </label>
                <select
                  name="leadSource"
                  value={formData.leadSource}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Walk-in">Walk-in</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Referral">Referral</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Website">Website</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Email">Email</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Interested In
                </label>
                <select
                  name="interestedPackage"
                  value={formData.interestedPackage}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Not Decided">Not Decided</option>
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="VIP">VIP</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Budget Range
                </label>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Not Disclosed">Not Disclosed</option>
                  <option value="Under $500">Under $500</option>
                  <option value="$500-$800">$500-$800</option>
                  <option value="$800-$1000">$800-$1000</option>
                  <option value="$1000-$1500">$1000-$1500</option>
                  <option value="$1500-$2000">$1500-$2000</option>
                  <option value="$2000+">$2000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Preferred Contact Method
                </label>
                <select
                  name="contactMethod"
                  value={formData.contactMethod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Phone">Phone</option>
                  <option value="Email">Email</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="SMS">SMS</option>
                  <option value="In-Person">In-Person</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Lead Status
                </label>
                <select
                  name="leadStatus"
                  value={formData.leadStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Lead Priority
                </label>
                <select
                  name="leadPriority"
                  value={formData.leadPriority}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Next Follow-up Date
                </label>
                <input
                  type="date"
                  name="nextFollowUpDate"
                  value={formData.nextFollowUpDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Any additional notes about this lead..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 bg-gray-800/80 backdrop-blur-sm sticky bottom-0">
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : editMode ? 'Update Lead' : 'Add Lead'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up Drawer */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isFollowUpOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsFollowUpOpen(false)}
        />
        
        <div className={`absolute right-0 top-0 h-full w-full sm:w-[500px] bg-gray-800 border-l border-gray-700 shadow-2xl transition-transform duration-300 overflow-y-auto ${isFollowUpOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Add Follow-up</h2>
                <button 
                  onClick={() => setIsFollowUpOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              {selectedLead && (
                <div className="mt-3 text-blue-100">
                  <p className="font-semibold">{selectedLead.fullName}</p>
                  <p className="text-sm">{selectedLead.phoneNumber} • {selectedLead.email}</p>
                </div>
              )}
            </div>

            <div className="flex-1 p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Tag className="w-4 h-4 inline mr-2" />
                  Follow-up Method
                </label>
                <select
                  value={followUpMethod}
                  onChange={(e) => setFollowUpMethod(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Phone">Phone</option>
                  <option value="Email">Email</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="SMS">SMS</option>
                  <option value="In-Person">In-Person</option>
                  <option value="Video Call">Video Call</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Outcome
                </label>
                <select
                  value={followUpOutcome}
                  onChange={(e) => setFollowUpOutcome(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Interested">Interested</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Callback">Callback</option>
                  <option value="Converted">Converted</option>
                  <option value="No Response">No Response</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Next Follow-up Date
                </label>
                <input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={(e) => setNextFollowUpDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Follow-up Notes *
                </label>
                <textarea
                  value={followUpNote}
                  onChange={(e) => setFollowUpNote(e.target.value)}
                  rows="5"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter details about this follow-up interaction..."
                />
              </div>

              {selectedLead && selectedLead.followUps && selectedLead.followUps.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    <History className="w-4 h-4 inline mr-2" />
                    Previous Follow-ups ({selectedLead.followUps.length})
                  </label>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedLead.followUps.slice().reverse().map((followUp, index) => (
                      <div key={index} className="bg-gray-700/50 rounded-lg p-3 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-white">
                            {new Date(followUp.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-blue-400">
                            {getFollowUpIcon(followUp.method)}
                            {followUp.method}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{followUp.notes}</p>
                        <p className="text-xs text-gray-400 mt-1">Outcome: {followUp.outcome}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-700 bg-gray-800/80 backdrop-blur-sm sticky bottom-0">
              <div className="flex gap-3">
                <button
                  onClick={() => setIsFollowUpOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFollowUp}
                  disabled={!followUpNote.trim() || isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isLoading ? 'Adding...' : 'Add Follow-up'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Detail Drawer */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${isDetailOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsDetailOpen(false)}
        />
        
        <div className={`absolute right-0 top-0 h-full w-full sm:w-[600px] bg-gray-800 border-l border-gray-700 shadow-2xl transition-transform duration-300 overflow-y-auto ${isDetailOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedLead && (
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-purple-600 to-purple-700 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Lead Details</h2>
                  <button 
                    onClick={() => setIsDetailOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6 space-y-6">
                {/* Lead Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white font-bold text-xl">
                    {selectedLead.fullName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{selectedLead.fullName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedLead.leadStatus)}`}>
                        {selectedLead.leadStatus}
                      </span>
                      <span className="text-sm text-gray-400">
                        Added: {new Date(selectedLead.addedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Mail className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-semibold text-gray-300">Email</span>
                    </div>
                    <p className="text-white">{selectedLead.email}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Phone className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-semibold text-gray-300">Phone</span>
                    </div>
                    <p className="text-white">{selectedLead.phoneNumber}</p>
                  </div>
                </div>

                {/* Lead Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-semibold text-gray-300">Source</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getSourceIcon(selectedLead.leadSource)}</span>
                      <span className="text-white">{selectedLead.leadSource}</span>
                    </div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-gray-300">Interested In</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedLead.interestedPackage === 'VIP' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' :
                      selectedLead.interestedPackage === 'Premium' ? 'bg-gradient-to-r from-red-600 to-red-700 text-white' :
                      'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
                    }`}>
                      {selectedLead.interestedPackage}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-gray-300">Budget</span>
                    </div>
                    <p className="text-white font-semibold">{selectedLead.budgetRange}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-semibold text-gray-300">Preferred Contact</span>
                    </div>
                    <p className="text-white">{selectedLead.contactMethod}</p>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-gray-300">Lead Score</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full transition-all"
                        style={{ width: `${selectedLead.leadScore || 0}%` }}
                      />
                    </div>
                    <span className="text-white font-semibold">{selectedLead.leadScore || 0}/100</span>
                  </div>
                </div>

                {/* Next Follow-up */}
                {selectedLead.nextFollowUpDate && (
                  <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-white" />
                      <span className="text-sm font-semibold text-white">Next Follow-up</span>
                    </div>
                    <p className="text-white font-semibold text-lg">
                      {new Date(selectedLead.nextFollowUpDate).toLocaleDateString()}
                    </p>
                    <p className="text-orange-100 text-sm mt-1">
                      {new Date(selectedLead.nextFollowUpDate).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
                        ? 'Due today!' 
                        : new Date(selectedLead.nextFollowUpDate) < new Date()
                        ? 'Overdue!'
                        : 'Upcoming'}
                    </p>
                  </div>
                )}

                {/* Notes */}
                {selectedLead.notes && (
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-semibold text-gray-300">Notes</span>
                    </div>
                    <p className="text-white">{selectedLead.notes}</p>
                  </div>
                )}

                {/* Follow-up History */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-semibold text-gray-300">Follow-up History</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {selectedLead.followUps?.length || 0} entries
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedLead.followUps && selectedLead.followUps.length > 0 ? (
                      selectedLead.followUps.slice().reverse().map((followUp, index) => (
                        <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-white">
                              {new Date(followUp.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-purple-400">
                              {getFollowUpIcon(followUp.method)}
                              {followUp.method}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300">{followUp.notes}</p>
                          <p className="text-xs text-gray-400 mt-1">Outcome: {followUp.outcome}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-4">No follow-ups recorded yet</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-700 bg-gray-800/80 backdrop-blur-sm sticky bottom-0">
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDetailOpen(false)}
                    className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setIsDetailOpen(false);
                      openFollowUp(selectedLead);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Add Follow-up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GymLeadsTracking;