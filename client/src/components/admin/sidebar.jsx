import React, { useState } from "react";
import {
  BarChart,
  Users,
  User2,
  Calendar,
  Layers,
  FileCheck,
  Image,
  UsersRoundIcon,
  User,
  Menu,
  X,
  IndianRupee,
} from "lucide-react";
import logo from "../../assets/flogo.jpg";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import { useSelector } from "react-redux";

const AdminSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); // gets current route
  const { user } = useSelector((state) => state.auth);

  // All menu items with role-based access control
  const allMenuItems = [
    {
      path: "/admin/dashboard",
      icon: BarChart,
      label: "Dashboard",
      description: "View gym statistics and overview",
      roles: ["admin", "trainer"],
    },
    {
      path: "/admin/addmember",
      icon: Users,
      label: "Members",
      description:
        user?.role === "trainer"
          ? "Manage your assigned members"
          : "Manage gym members and memberships",
      roles: ["admin", "trainer"],
    },
    {
      path: "/admin/addleads",
      icon: User2,
      label: "Leads",
      description: "Track potential customers and leads",
      roles: ["admin"], // Admin only
    },
    {
      path: "/admin/addattendance",
      icon: Calendar,
      label: "Attendance",
      description:
        user?.role === "trainer"
          ? "Track attendance for your members"
          : "Monitor member attendance records",
      roles: ["admin", "trainer"],
    },
    {
      path: "/admin/addemployee",
      icon: UsersRoundIcon,
      label: "Employees",
      description: "Manage staff and employee details",
      roles: ["admin"], // Admin only
    },
    {
      path: "/admin/addpackages",
      icon: Layers,
      label: "Packages",
      description: "Create and manage membership packages",
      roles: ["admin"], // Admin only
    },
    {
      path: "/admin/paymenthistory",
      icon: IndianRupee,
      label: "Payments",
      description: "View payment history and transactions",
      roles: ["admin"], // Admin only
    },
    {
      path: "/admin/files",
      icon: FileCheck,
      label: "Files",
      description: "Document management and files",
      roles: ["admin"], // Admin only
    },
    {
      path: "/admin/images",
      icon: Image,
      label: "Gallery",
      description: "Manage gym photos and images",
      roles: ["admin"], // Admin only
    },
    {
      path: "/admin/profile",
      icon: User,
      label: "Profile",
      description: "Your account settings and profile",
      roles: ["admin", "trainer"],
    },
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <>
      {/* Mobile toggle button */}
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

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-20 bg-gray-900 shadow-xl flex flex-col items-center py-6 space-y-6 border-r border-gray-800 z-40 transition-transform duration-300 
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />

        {/* Menu Items */}
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Link to={item.path}>
                  <div
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center shadow-md transition-all cursor-pointer
                      ${
                        isActive
                          ? "bg-gradient-to-br from-red-600 to-red-700 scale-110"
                          : "bg-gradient-to-br from-gray-700 to-gray-800 hover:from-red-600 hover:to-red-700 hover:scale-110"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-gray-800 text-white border border-gray-700"
              >
                <div className="text-center">
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-gray-300 mt-1">
                    {item.description}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </>
  );
};

export default AdminSidebar;
