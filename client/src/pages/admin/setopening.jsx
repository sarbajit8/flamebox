import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Save,
  Plus,
  Trash2,
  Edit,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

const GymScheduleManagement = () => {
  const [weeklySchedule, setWeeklySchedule] = useState([
    {
      day: "Monday",
      open: true,
      is24Hours: false,
      startTime: "06:00",
      endTime: "22:00",
      special: false,
    },
    {
      day: "Tuesday",
      open: true,
      is24Hours: false,
      startTime: "06:00",
      endTime: "22:00",
      special: false,
    },
    {
      day: "Wednesday",
      open: true,
      is24Hours: false,
      startTime: "06:00",
      endTime: "22:00",
      special: false,
    },
    {
      day: "Thursday",
      open: true,
      is24Hours: false,
      startTime: "06:00",
      endTime: "22:00",
      special: false,
    },
    {
      day: "Friday",
      open: true,
      is24Hours: false,
      startTime: "06:00",
      endTime: "22:00",
      special: false,
    },
    {
      day: "Saturday",
      open: true,
      is24Hours: false,
      startTime: "08:00",
      endTime: "20:00",
      special: false,
    },
    {
      day: "Sunday",
      open: false,
      is24Hours: false,
      startTime: "09:00",
      endTime: "18:00",
      special: false,
    },
  ]);

  const [specialDates, setSpecialDates] = useState([]);

  const [newSpecialDate, setNewSpecialDate] = useState({
    date: "",
    open: true,
    is24Hours: false,
    startTime: "06:00",
    endTime: "22:00",
    reason: "",
    eventType: "holiday",
    customizedMsg: "",
  });

  const [isAddingSpecialDate, setIsAddingSpecialDate] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Fetch schedule from backend
  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/admin/schedule`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success && data.schedule) {
        if (
          data.schedule.weeklySchedule &&
          data.schedule.weeklySchedule.length > 0
        ) {
          setWeeklySchedule(data.schedule.weeklySchedule);
        }
        if (data.schedule.specialDates) {
          setSpecialDates(
            data.schedule.specialDates.map((sd) => ({
              ...sd,
              id: sd._id,
              date: new Date(sd.date).toISOString().split("T")[0],
            }))
          );
        }
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  // Get current schedule status
  const getCurrentStatus = () => {
    const now = new Date();
    const today = now.toLocaleDateString("en-US", { weekday: "long" });
    const currentTime = now.toTimeString().slice(0, 5);

    const todaySchedule = weeklySchedule.find((day) => day.day === today);
    if (!todaySchedule || !todaySchedule.open) {
      return { isOpen: false, message: "Closed today" };
    }

    if (todaySchedule.is24Hours) {
      return { isOpen: true, message: "Open 24 hours" };
    }

    const isOpen =
      currentTime >= todaySchedule.startTime &&
      currentTime <= todaySchedule.endTime;
    const nextOpenTime =
      !isOpen && currentTime < todaySchedule.startTime
        ? todaySchedule.startTime
        : null;
    const nextCloseTime = isOpen ? todaySchedule.endTime : null;

    return {
      isOpen,
      message: isOpen
        ? `Open until ${todaySchedule.endTime}`
        : `Opens at ${todaySchedule.startTime}`,
      nextOpenTime,
      nextCloseTime,
    };
  };

  const currentStatus = getCurrentStatus();

  const handleWeeklyScheduleChange = (index, field, value) => {
    const updatedSchedule = [...weeklySchedule];

    if (field === "open" && !value) {
      // If closing the day, reset 24 hours flag
      updatedSchedule[index].is24Hours = false;
    }

    if (field === "is24Hours" && value) {
      // If setting to 24 hours, clear specific times
      updatedSchedule[index].startTime = "";
      updatedSchedule[index].endTime = "";
    }

    updatedSchedule[index][field] = value;
    setWeeklySchedule(updatedSchedule);
  };

  const handleSaveSchedule = async () => {
    try {
      setSaved(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/admin/schedule`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            weeklySchedule,
            specialDates: specialDates.map((sd) => ({
              ...sd,
              date: new Date(sd.date),
            })),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Schedule saved successfully!");
        await fetchSchedule();
      } else {
        toast.error(data.error || "Failed to save schedule");
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Failed to save schedule");
    } finally {
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleAddSpecialDate = async () => {
    if (!newSpecialDate.date || !newSpecialDate.reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/admin/schedule/special-date`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSpecialDate),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Special date added successfully!");
        await fetchSchedule();
        setNewSpecialDate({
          date: "",
          open: true,
          is24Hours: false,
          startTime: "06:00",
          endTime: "22:00",
          reason: "",
          eventType: "holiday",
          customizedMsg: "",
        });
        setIsAddingSpecialDate(false);
      } else {
        toast.error(data.error || "Failed to add special date");
      }
    } catch (error) {
      console.error("Error adding special date:", error);
      toast.error("Failed to add special date");
    }
  };

  const deleteSpecialDate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this special date?")) {
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }/api/admin/schedule/special-date/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Special date deleted successfully!");
        await fetchSchedule();
      } else {
        toast.error(data.error || "Failed to delete special date");
      }
    } catch (error) {
      console.error("Error deleting special date:", error);
      toast.error("Failed to delete special date");
    }
  };

  const getDayStatus = (dayName) => {
    const daySchedule = weeklySchedule.find((day) => day.day === dayName);
    if (!daySchedule.open) return "closed";
    if (daySchedule.is24Hours) return "24hours";
    return "open";
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    const calendarDays = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      calendarDays.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      const specialDate = specialDates.find((sd) => sd.date === dateStr);
      const dayOfWeek = new Date(year, month, day).toLocaleDateString("en-US", {
        weekday: "long",
      });
      const weekly = weeklySchedule.find((ws) => ws.day === dayOfWeek);

      calendarDays.push({
        date: dateStr,
        day,
        isToday: dateStr === new Date().toISOString().split("T")[0],
        specialDate,
        weeklySchedule: weekly,
      });
    }

    return calendarDays;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Gym Schedule Management
            </h1>
            <p className="text-gray-400">
              Set opening hours, special dates, and manage gym availability
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={() => setIsAddingSpecialDate(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Special Date
            </button>
            <button
              onClick={handleSaveSchedule}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Schedule
            </button>
          </div>
        </div>

        {/* Current Status Banner */}
        <div
          className={`p-6 rounded-xl mb-8 ${
            currentStatus.isOpen
              ? "bg-gradient-to-r from-green-600 to-green-700"
              : "bg-gradient-to-r from-red-600 to-red-700"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                {currentStatus.isOpen ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <XCircle className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {currentStatus.isOpen ? "Gym is OPEN" : "Gym is CLOSED"}
                </h2>
                <p className="text-white/90">{currentStatus.message}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Current Time</p>
              <p className="text-white font-bold text-xl">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Schedule */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Weekly Schedule
              </h2>
              <p className="text-gray-400 text-sm">
                Set regular opening hours for each day
              </p>
            </div>

            <div className="p-6 space-y-4">
              {weeklySchedule.map((day, index) => (
                <div
                  key={day.day}
                  className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={day.open}
                        onChange={(e) =>
                          handleWeeklyScheduleChange(
                            index,
                            "open",
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2"
                      />
                      <span className="text-white font-semibold text-lg">
                        {day.day}
                      </span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        day.open
                          ? day.is24Hours
                            ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                            : "bg-green-600/20 text-green-400 border border-green-500/30"
                          : "bg-red-600/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {day.open
                        ? day.is24Hours
                          ? "24 Hours"
                          : "Open"
                        : "Closed"}
                    </div>
                  </div>

                  {day.open && (
                    <div className="space-y-3 pl-7">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={day.is24Hours}
                          onChange={(e) =>
                            handleWeeklyScheduleChange(
                              index,
                              "is24Hours",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                        />
                        <span className="text-gray-300">Open 24 hours</span>
                      </div>

                      {!day.is24Hours && (
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <input
                              type="time"
                              value={day.startTime}
                              onChange={(e) =>
                                handleWeeklyScheduleChange(
                                  index,
                                  "startTime",
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <span className="text-gray-400">to</span>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <input
                              type="time"
                              value={day.endTime}
                              onChange={(e) =>
                                handleWeeklyScheduleChange(
                                  index,
                                  "endTime",
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Special Dates & Calendar */}
          <div className="space-y-8">
            {/* Special Dates */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Special Dates & Holidays
                </h2>
                <p className="text-gray-400 text-sm">
                  Set exceptions to regular schedule
                </p>
              </div>

              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {specialDates.map((specialDate) => (
                  <div
                    key={specialDate.id}
                    className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-white font-semibold">
                          {specialDate.reason}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(specialDate.date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            specialDate.open
                              ? specialDate.is24Hours
                                ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                                : "bg-green-600/20 text-green-400 border border-green-500/30"
                              : "bg-red-600/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {specialDate.open
                            ? specialDate.is24Hours
                              ? "24 Hours"
                              : "Special Hours"
                            : "Closed"}
                        </span>
                        <button
                          onClick={() => deleteSpecialDate(specialDate.id)}
                          className="p-1 hover:bg-red-900/30 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>

                    {specialDate.open &&
                      !specialDate.is24Hours &&
                      specialDate.startTime && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Clock className="w-4 h-4" />
                          <span>
                            {specialDate.startTime} - {specialDate.endTime}
                          </span>
                        </div>
                      )}
                  </div>
                ))}

                {specialDates.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No special dates configured</p>
                    <p className="text-sm">
                      Add holidays or special opening hours
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Calendar Overview */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Schedule Calendar
                </h2>
                <p className="text-gray-400 text-sm">
                  Monthly overview of gym schedule
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">
                    {currentMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() - 1
                          )
                        )
                      }
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => setCurrentMonth(new Date())}
                      className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={() =>
                        setCurrentMonth(
                          new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth() + 1
                          )
                        )
                      }
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-gray-400 text-sm font-semibold py-2"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-16 p-1 border rounded-lg ${
                        !day
                          ? "border-transparent"
                          : day.isToday
                          ? "border-blue-500 bg-blue-500/10"
                          : day.specialDate
                          ? day.specialDate.open
                            ? "border-green-500/50 bg-green-500/10"
                            : "border-red-500/50 bg-red-500/10"
                          : day.weeklySchedule.open
                          ? "border-gray-600 bg-gray-700/50"
                          : "border-gray-700 bg-gray-800/50"
                      }`}
                    >
                      {day && (
                        <>
                          <div className="text-right">
                            <span
                              className={`inline-block w-6 h-6 text-center text-sm rounded-full ${
                                day.isToday
                                  ? "bg-blue-500 text-white"
                                  : "text-gray-300"
                              }`}
                            >
                              {day.day}
                            </span>
                          </div>
                          {day.specialDate && (
                            <div className="text-xs mt-1 truncate">
                              <div
                                className={`w-2 h-2 rounded-full inline-block mr-1 ${
                                  day.specialDate.open
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              />
                              {day.specialDate.reason}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500/20 border border-green-500/50 rounded" />
                    <span>Open</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500/20 border border-red-500/50 rounded" />
                    <span>Closed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500/20 border border-blue-500 rounded" />
                    <span>Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Special Date Modal */}
      {isAddingSpecialDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  Add Special Date
                </h2>
                <button
                  onClick={() => setIsAddingSpecialDate(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={newSpecialDate.date}
                  onChange={(e) =>
                    setNewSpecialDate((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Reason *
                </label>
                <input
                  type="text"
                  value={newSpecialDate.reason}
                  onChange={(e) =>
                    setNewSpecialDate((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Christmas Holiday, Maintenance Day"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Customized Message{" "}
                  <span className="text-xs text-gray-400 font-normal">
                    (optional)
                  </span>
                </label>
                <textarea
                  value={newSpecialDate.customizedMsg}
                  onChange={(e) =>
                    setNewSpecialDate((prev) => ({
                      ...prev,
                      customizedMsg: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-shadow"
                  placeholder="This message will be sent in the email if provided. Leave blank for default message."
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-400 mt-1">
                  You can add a custom message for this special date. This will
                  be included in the email notification if provided.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Event Type
                </label>
                <select
                  value={newSpecialDate.eventType}
                  onChange={(e) =>
                    setNewSpecialDate((prev) => ({
                      ...prev,
                      eventType: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="holiday">Holiday</option>
                  <option value="special_hours">Special Hours</option>
                  <option value="closed">Closed</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={newSpecialDate.open}
                  onChange={(e) =>
                    setNewSpecialDate((prev) => ({
                      ...prev,
                      open: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-gray-300">Gym is open on this date</span>
              </div>

              {newSpecialDate.open && (
                <>
                  <div className="flex items-center gap-3 pl-7">
                    <input
                      type="checkbox"
                      checked={newSpecialDate.is24Hours}
                      onChange={(e) =>
                        setNewSpecialDate((prev) => ({
                          ...prev,
                          is24Hours: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span className="text-gray-300">Open 24 hours</span>
                  </div>

                  {!newSpecialDate.is24Hours && (
                    <div className="flex items-center gap-4 pl-7">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <input
                          type="time"
                          value={newSpecialDate.startTime}
                          onChange={(e) =>
                            setNewSpecialDate((prev) => ({
                              ...prev,
                              startTime: e.target.value,
                            }))
                          }
                          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <span className="text-gray-400">to</span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <input
                          type="time"
                          value={newSpecialDate.endTime}
                          onChange={(e) =>
                            setNewSpecialDate((prev) => ({
                              ...prev,
                              endTime: e.target.value,
                            }))
                          }
                          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-6 border-t border-gray-700 bg-gray-800/80 backdrop-blur-sm">
              <div className="flex gap-3">
                <button
                  onClick={() => setIsAddingSpecialDate(false)}
                  className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSpecialDate}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                >
                  Add Date
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation */}
      {saved && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right">
            <CheckCircle className="w-5 h-5" />
            Schedule saved successfully!
          </div>
        </div>
      )}
    </div>
  );
};

// Add missing import for ChevronLeft and ChevronRight
const ChevronLeft = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);
const ChevronRight = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export default GymScheduleManagement;
