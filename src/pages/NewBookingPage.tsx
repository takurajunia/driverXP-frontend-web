import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import BookingForm from "../components/BookingForm";

const NewBookingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/bookings");
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <BookingForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    </Layout>
  );
};

export default NewBookingPage;
