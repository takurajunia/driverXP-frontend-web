import React from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";
import StudentDashboard from "../components/StudentDashboard";
import InstructorDashboard from "../components/InstructorDashboard";
import AdminDashboard from "../components/AdminDashboard";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case "student":
        return <StudentDashboard />;
      case "instructor":
        return <InstructorDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return <Layout>{renderDashboard()}</Layout>;
};

export default DashboardPage;
