import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import CarFormModal from "./CarFormModal";
import {
  FaUsers,
  FaCar,
  FaCalendarAlt,
  FaChartLine,
  FaChartBar,
  FaUserGraduate,
  FaUserTie,
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaChevronRight,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import { bookingsAPI, usersAPI, carsAPI } from "../services/api";
import type { Booking, User, Car } from "../types";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalBookings: 0,
    completedBookings: 0,
    upcomingBookings: 0,
    totalCars: 0,
    availableCars: 0,
    revenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "users" | "bookings" | "cars"
  >("overview");
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch all data in parallel
      const [bookingsRes, usersRes, carsRes] = await Promise.all([
        bookingsAPI.getMyBookings(),
        usersAPI.getAllUsers(),
        carsAPI.getAllCars(),
      ]);

      const bookings = bookingsRes.data.data?.bookings || [];
      const allUsers = usersRes.data.data?.users || [];
      const allCars = carsRes.data.data?.cars || [];

      // Calculate stats
      const students = allUsers.filter((u) => u.role === "student");
      const instructors = allUsers.filter((u) => u.role === "instructor");
      const completed = bookings.filter((b) => b.status === "completed");
      const upcoming = bookings.filter(
        (b) =>
          (b.status === "pending" || b.status === "confirmed") &&
          new Date(b.lessonDate) >= new Date()
      );
      const available = allCars.filter((c) => c.status === "available");

      setStats({
        totalUsers: allUsers.length,
        totalStudents: students.length,
        totalInstructors: instructors.length,
        totalBookings: bookings.length,
        completedBookings: completed.length,
        upcomingBookings: upcoming.length,
        totalCars: allCars.length,
        availableCars: available.length,
        revenue: completed.length * 50, // Assuming $50 per lesson for demo
      });

      setRecentBookings(bookings.slice(0, 10));
      setUsers(allUsers);
      setCars(allCars);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to deactivate this user?"))
      return;

    try {
      await usersAPI.deactivateUser(userId);
      await fetchDashboardData();
    } catch (error) {
      console.error("Error deactivating user:", error);
      alert("Failed to deactivate user");
    }
  };

  const handleDeleteCar = async (carId: string) => {
    if (!window.confirm("Are you sure you want to remove this car?")) return;

    try {
      await carsAPI.deleteCar(carId);
      await fetchDashboardData();
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Failed to delete car");
    }
  };

  const handleAddCar = () => {
    setEditingCar(null);
    setIsCarModalOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setIsCarModalOpen(true);
  };

  const handleCarModalSuccess = async () => {
    setIsCarModalOpen(false);
    setEditingCar(null);
    await fetchDashboardData();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          System overview and management tools
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          {[
            { id: "overview", label: "Overview", icon: FaChartLine },
            { id: "users", label: "Users", icon: FaUsers },
            { id: "bookings", label: "Bookings", icon: FaCalendarAlt },
            { id: "cars", label: "Vehicles", icon: FaCar },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedTab === tab.id
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="text-sm md:text-base" />
                <span className="text-sm md:text-base">{tab.label}</span>
              </button>
            );
          })}
          {/* Add Analytics as a separate button */}
          <button
            onClick={() => (window.location.href = "/analytics")}
            className="flex items-center justify-center space-x-2 px-3 py-3 rounded-lg font-medium transition-all bg-purple-100 text-purple-700 hover:bg-purple-200 whitespace-nowrap"
          >
            <FaChartBar className="text-sm md:text-base" />
            <span className="text-sm md:text-base">Analytics</span>
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {selectedTab === "overview" && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
                  <FaUsers className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-gray-900">
                  {stats.totalUsers}
                </h3>
                <p className="text-sm text-gray-600">Total Users</p>
                <div className="mt-2 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Students:</span>
                    <span className="font-medium">{stats.totalStudents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Instructors:</span>
                    <span className="font-medium">
                      {stats.totalInstructors}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl">
                  <FaCalendarAlt className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-gray-900">
                  {stats.totalBookings}
                </h3>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <div className="mt-2 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Completed:</span>
                    <span className="font-medium text-green-600">
                      {stats.completedBookings}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Upcoming:</span>
                    <span className="font-medium text-blue-600">
                      {stats.upcomingBookings}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl">
                  <FaCar className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-gray-900">
                  {stats.totalCars}
                </h3>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                <div className="mt-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Available:</span>
                    <span className="font-medium text-green-600">
                      {stats.availableCars}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl">
                  <FaChartLine className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-gray-900">
                  ${stats.revenue}
                </h3>
                <p className="text-sm text-gray-600">Est. Revenue</p>
                <p className="text-xs text-gray-500 mt-2">This month</p>
              </div>
            </div>
          </div>

          {/* Analytics Button - Add this after the stats grid */}
          <div className="mb-8">
            <button
              onClick={() => (window.location.href = "/analytics")}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all flex items-center justify-between group"
            >
              <div className="flex items-center">
                <div className="p-3 bg-white bg-opacity-20 rounded-xl mr-4">
                  <FaChartBar className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold">
                    View Analytics Dashboard
                  </h3>
                  <p className="text-purple-100 text-sm">
                    Detailed insights and performance metrics
                  </p>
                </div>
              </div>
              <FaChevronRight className="text-2xl group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Bookings
              </h2>
              <button
                onClick={() => setSelectedTab("bookings")}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                View All
                <FaChevronRight className="ml-1 text-xs" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Instructor</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentBookings.slice(0, 5).map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="py-3">
                        <p className="text-sm font-medium text-gray-900">
                          {booking.student?.firstName}{" "}
                          {booking.student?.lastName}
                        </p>
                      </td>
                      <td className="py-3">
                        <p className="text-sm text-gray-600">
                          {booking.instructor?.firstName}{" "}
                          {booking.instructor?.lastName}
                        </p>
                      </td>
                      <td className="py-3">
                        <p className="text-sm text-gray-600">
                          {formatDate(booking.lessonDate)}
                        </p>
                      </td>
                      <td className="py-3">
                        <p className="text-sm text-gray-600 capitalize">
                          {booking.lessonType.replace("_", " ")}
                        </p>
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            booking.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : booking.status === "no_show"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {booking.status === "no_show"
                            ? "Lesson Missed"
                            : booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Bookings Tab */}
      {selectedTab === "bookings" && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">All Bookings</h2>
            <button
              onClick={() => (window.location.href = "/bookings")}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              View Full Calendar
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Instructor</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Car</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {booking.student?.firstName} {booking.student?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.student?.email}
                      </p>
                    </td>
                    <td className="py-3">
                      <p className="text-sm text-gray-600">
                        {booking.instructor?.firstName}{" "}
                        {booking.instructor?.lastName}
                      </p>
                    </td>
                    <td className="py-3">
                      <p className="text-sm text-gray-600">
                        {formatDate(booking.lessonDate)}
                      </p>
                    </td>
                    <td className="py-3">
                      <p className="text-sm text-gray-600">
                        {booking.startTime} - {booking.endTime}
                      </p>
                    </td>
                    <td className="py-3">
                      <p className="text-sm text-gray-600 capitalize">
                        {booking.lessonType.replace("_", " ")}
                      </p>
                    </td>
                    <td className="py-3">
                      <p className="text-sm text-gray-600">
                        {booking.car
                          ? `${booking.car.make} ${booking.car.model}`
                          : "N/A"}
                      </p>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : booking.status === "no_show"
                            ? "bg-gray-100 text-gray-800"
                            : booking.status === "confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status === "no_show"
                          ? "Lesson Missed"
                          : booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {selectedTab === "users" && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">User Management</h2>
            <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <FaPlus className="mr-2" />
              Add User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-3">
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                    </td>
                    <td className="py-3">
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "instructor"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role === "admin" && (
                          <FaUserShield className="mr-1" />
                        )}
                        {user.role === "instructor" && (
                          <FaUserTie className="mr-1" />
                        )}
                        {user.role === "student" && (
                          <FaUserGraduate className="mr-1" />
                        )}
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <p className="text-sm text-gray-600">{user.phone}</p>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeactivateUser(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cars Tab */}
      {selectedTab === "cars" && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Vehicle Management
            </h2>
            <button
              onClick={handleAddCar}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Vehicle
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cars.map((car) => (
              <div
                key={car.id}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900">
                    {car.make} {car.model}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      car.status === "available"
                        ? "bg-green-100 text-green-800"
                        : car.status === "maintenance"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {car.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Year: {car.year}</p>
                  <p>Registration: {car.registration}</p>
                  <p>Transmission: {car.transmission}</p>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => handleEditCar(car)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteCar(car.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Car Form Modal */}
      <CarFormModal
        isOpen={isCarModalOpen}
        onClose={() => setIsCarModalOpen(false)}
        onSuccess={handleCarModalSuccess}
        editingCar={editingCar}
      />
    </div>
  );
};

export default AdminDashboard;
