import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { usersAPI } from "../services/api";
import UserFormModal from "../components/UserFormModal";
import Layout from "../components/layout/Layout";
import type { User } from "../types";
import {
  FaUsers,
  FaUserGraduate,
  FaUserTie,
  FaUserShield,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalAdmins: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, filterRole, filterStatus]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersAPI.getAllUsers();
      const allUsers = response.data.data?.users || [];
      setUsers(allUsers);

      // Calculate stats
      const students = allUsers.filter((u) => u.role === "student");
      const instructors = allUsers.filter((u) => u.role === "instructor");
      const admins = allUsers.filter((u) => u.role === "admin");
      const active = allUsers.filter((u) => u.isActive);
      const inactive = allUsers.filter((u) => !u.isActive);

      setStats({
        totalUsers: allUsers.length,
        totalStudents: students.length,
        totalInstructors: instructors.length,
        totalAdmins: admins.length,
        activeUsers: active.length,
        inactiveUsers: inactive.length,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm)
      );
    }

    // Apply role filter
    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((user) =>
        filterStatus === "active" ? user.isActive : !user.isActive
      );
    }

    setFilteredUsers(filtered);
  };

  const handleDeactivateUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to deactivate this user?"))
      return;

    try {
      await usersAPI.deactivateUser(userId);
      await fetchUsers();
    } catch (error) {
      console.error("Error deactivating user:", error);
      alert("Failed to deactivate user");
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleUserModalSuccess = async () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
    await fetchUsers();
  };

  const isAdmin = currentUser?.role === "admin";

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            User Management
          </h1>
          <p className="text-gray-600 text-lg">
            Manage students, instructors, and administrators
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
                <p className="text-xs text-gray-600">Total Users</p>
              </div>
              <FaUsers className="text-blue-500 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalStudents}
                </p>
                <p className="text-xs text-gray-600">Students</p>
              </div>
              <FaUserGraduate className="text-green-500 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalInstructors}
                </p>
                <p className="text-xs text-gray-600">Instructors</p>
              </div>
              <FaUserTie className="text-blue-500 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalAdmins}
                </p>
                <p className="text-xs text-gray-600">Admins</p>
              </div>
              <FaUserShield className="text-purple-500 text-2xl" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeUsers}
                </p>
                <p className="text-xs text-gray-600">Active</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.inactiveUsers}
                </p>
                <p className="text-xs text-gray-600">Inactive</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="w-full lg:w-48">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="student">Students</option>
                <option value="instructor">Instructors</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Add User Button */}
            {isAdmin && (
              <button
                onClick={handleAddUser}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FaPlus className="mr-2" />
                Add User
              </button>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Status</th>
                  {isAdmin && <th className="pb-3">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isAdmin ? 6 : 5}
                      className="py-8 text-center text-gray-500"
                    >
                      No users found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
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
                      {isAdmin && (
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-blue-600 hover:text-blue-800"
                            >
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
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Form Modal */}
        <UserFormModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          onSuccess={handleUserModalSuccess}
          editingUser={editingUser}
        />
      </div>
    </Layout>
  );
};

export default UsersPage;
