import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Users, Calendar, TrendingUp, UserCheck } from "lucide-react";
import { fetchAllMembers } from "../../store/admin/members-slice";

const TrainerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { members, isLoading, error } = useSelector(
    (state) => state.members || {}
  );

  useEffect(() => {
    console.log("🏋️ TrainerDashboard mounted");
    console.log("👤 User:", {
      id: user?._id || user?.id,
      role: user?.role,
      email: user?.email,
    });
    console.log("📋 Members state:", members);
    console.log("⏳ Loading:", isLoading);
    console.log("❌ Error:", error);

    // Fetch members assigned to this trainer
    // Backend automatically filters by assignedTrainer for trainers
    if (user && (user._id || user.id)) {
      console.log("🔄 Fetching members for trainer:", user._id || user.id);
      dispatch(fetchAllMembers({ page: 1, limit: 100 }));
    } else {
      console.error("⚠️ User ID not found, cannot fetch members");
    }
  }, [dispatch, user]);

  // Backend already filters members for trainers, so no need for client-side filtering
  const myMembers = members || [];

  const activeMembers = myMembers.filter(
    (member) => member.memberStatus === "Active"
  );
  const totalMembers = myMembers.length;

  console.log("✅ Rendering dashboard with:", {
    totalMembers,
    activeMembers: activeMembers.length,
    userId: user?._id || user?.id,
    userRole: user?.role,
    membersData: myMembers.map((m) => ({
      id: m._id,
      name: m.fullName,
      status: m.memberStatus,
      assignedTrainer: m.assignedTrainer,
    })),
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.fullName || "Trainer"}
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your assigned members
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Members</p>
              <h3 className="text-3xl font-bold mt-2">{totalMembers}</h3>
            </div>
            <Users className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Members</p>
              <h3 className="text-3xl font-bold mt-2">
                {activeMembers.length}
              </h3>
            </div>
            <UserCheck className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Inactive Members</p>
              <h3 className="text-3xl font-bold mt-2">
                {totalMembers - activeMembers.length}
              </h3>
            </div>
            <Calendar className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Active Rate</p>
              <h3 className="text-3xl font-bold mt-2">
                {totalMembers > 0
                  ? Math.round((activeMembers.length / totalMembers) * 100)
                  : 0}
                %
              </h3>
            </div>
            <TrendingUp className="w-12 h-12 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          My Assigned Members
        </h2>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading members...</p>
          </div>
        ) : myMembers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No members assigned to you yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {member.fullName?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.fullName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {member.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {member.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          member.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.packageName || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboard;
