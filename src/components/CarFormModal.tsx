import React, { useState, useEffect } from "react";
import {
  FaCar,
  FaTimes,
  FaSave,
  FaGasPump,
  FaCogs,
  FaCalendar,
  FaIdCard,
  FaPalette,
  FaExclamationCircle,
} from "react-icons/fa";
import { carsAPI } from "../services/api";
import type { Car } from "../types";

interface CarFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingCar?: Car | null;
}

const CarFormModal: React.FC<CarFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingCar,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    licensePlate: "", // Changed from registration to licensePlate
    transmission: "manual" as "manual" | "automatic",
    fuelType: "petrol" as "petrol" | "diesel" | "hybrid" | "electric",
    color: "",
    status: "available" as
      | "available"
      | "in_use"
      | "maintenance"
      | "out_of_service", // Added in_use
  });

  useEffect(() => {
    if (editingCar) {
      setFormData({
        make: editingCar.make,
        model: editingCar.model,
        year: editingCar.year,
        licensePlate: editingCar.registration || "", // Handle field mapping
        transmission: editingCar.transmission,
        fuelType: editingCar.fuelType as
          | "petrol"
          | "diesel"
          | "hybrid"
          | "electric",
        color: editingCar.color,
        status: editingCar.status,
      });
    } else {
      // Reset form for new car
      setFormData({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        licensePlate: "", // Changed from registration
        transmission: "manual",
        fuelType: "petrol",
        color: "",
        status: "available",
      });
    }
    setError("");
  }, [editingCar, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "year" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Transform formData to match backend expectations
      const carData = {
        ...formData,
        registration: formData.licensePlate, // Map licensePlate to registration for backend
      };

      if (editingCar) {
        await carsAPI.updateCar(editingCar.id, carData);
      } else {
        await carsAPI.createCar(carData);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Car save error:", err);
      setError(err.response?.data?.message || "Failed to save car");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 transform -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FaCar className="mr-3" />
              {editingCar ? "Edit Vehicle" : "Add New Vehicle"}
            </h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
              <FaExclamationCircle className="mr-2" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Make */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCar className="inline mr-2 text-gray-400" />
                Make *
              </label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                placeholder="e.g., Toyota"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCar className="inline mr-2 text-gray-400" />
                Model *
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="e.g., Corolla"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendar className="inline mr-2 text-gray-400" />
                Year *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* License Plate - Updated field name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaIdCard className="inline mr-2 text-gray-400" />
                License Plate *
              </label>
              <input
                type="text"
                name="licensePlate" // Changed from registration
                value={formData.licensePlate} // Changed from registration
                onChange={handleInputChange}
                placeholder="e.g., ABC-123"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCogs className="inline mr-2 text-gray-400" />
                Transmission *
              </label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaGasPump className="inline mr-2 text-gray-400" />
                Fuel Type *
              </label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaPalette className="inline mr-2 text-gray-400" />
                Color *
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="e.g., White"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="available">Available</option>
                <option value="in_use">In Use</option> {/* Added this option */}
                <option value="maintenance">Under Maintenance</option>
                <option value="out_of_service">Out of Service</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  {editingCar ? "Update Vehicle" : "Add Vehicle"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CarFormModal;
