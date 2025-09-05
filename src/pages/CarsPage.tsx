import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import CarFormModal from "../components/CarFormModal";
import { carsAPI } from "../services/api";
import type { Car } from "../types";
import {
  FaCar,
  FaPlus,
  FaEdit,
  FaTrash,
  FaGasPump,
  FaCogs,
  FaCheckCircle,
  FaTools,
  FaTimesCircle,
  FaSearch,
  FaFilter,
  FaIdCard,
} from "react-icons/fa";

const CarsPage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "available" | "maintenance" | "out_of_service"
  >("all");
  const [transmissionFilter, setTransmissionFilter] = useState<
    "all" | "manual" | "automatic"
  >("all");

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    filterCars();
  }, [cars, searchTerm, statusFilter, transmissionFilter]);

  const fetchCars = async () => {
    try {
      setIsLoading(true);
      const response = await carsAPI.getAllCars();
      setCars(response.data.data?.cars || []);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCars = () => {
    let filtered = [...cars];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((car) => car.status === statusFilter);
    }

    // Apply transmission filter
    if (transmissionFilter !== "all") {
      filtered = filtered.filter(
        (car) => car.transmission === transmissionFilter
      );
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (car) =>
          car.make.toLowerCase().includes(search) ||
          car.model.toLowerCase().includes(search) ||
          (car.licensePlate || car.registration || "")
            .toLowerCase()
            .includes(search) || // Handle both fields
          car.color.toLowerCase().includes(search)
      );
    }

    setFilteredCars(filtered);
  };

  const handleAddCar = () => {
    setEditingCar(null);
    setIsCarModalOpen(true);
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setIsCarModalOpen(true);
  };

  const handleDeleteCar = async (carId: string) => {
    if (!window.confirm("Are you sure you want to remove this vehicle?"))
      return;

    try {
      await carsAPI.deleteCar(carId);
      await fetchCars();
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Failed to delete vehicle");
    }
  };

  const handleCarModalSuccess = async () => {
    setIsCarModalOpen(false);
    setEditingCar(null);
    await fetchCars();
  };

  const getStatusBadge = (status: string) => {
    const config = {
      available: { color: "bg-green-100 text-green-800", icon: FaCheckCircle },
      maintenance: { color: "bg-yellow-100 text-yellow-800", icon: FaTools },
      out_of_service: { color: "bg-red-100 text-red-800", icon: FaTimesCircle },
    };

    const statusConfig =
      config[status as keyof typeof config] || config.available;
    const Icon = statusConfig.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
      >
        <Icon className="mr-1" />
        {status.replace("_", " ")}
      </span>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const stats = {
    total: cars.length,
    available: cars.filter((c) => c.status === "available").length,
    maintenance: cars.filter((c) => c.status === "maintenance").length,
    outOfService: cars.filter((c) => c.status === "out_of_service").length,
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Vehicle Management
              </h1>
              <p className="text-gray-600">Manage your driving school fleet</p>
            </div>
            <button
              onClick={handleAddCar}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center"
            >
              <FaPlus className="mr-2" />
              Add Vehicle
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaCar className="text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.available}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FaCheckCircle className="text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.maintenance}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FaTools className="text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Service</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.outOfService}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <FaTimesCircle className="text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
                <option value="out_of_service">Out of Service</option>
              </select>
              <select
                value={transmissionFilter}
                onChange={(e) => setTransmissionFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Transmissions</option>
                <option value="manual">Manual</option>
                <option value="automatic">Automatic</option>
              </select>
            </div>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by make, model, or registration..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
              <FaCar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No vehicles found</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm ||
                statusFilter !== "all" ||
                transmissionFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Add your first vehicle to get started"}
              </p>
            </div>
          ) : (
            filteredCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-sm text-gray-500">Year: {car.year}</p>
                  </div>
                  {getStatusBadge(car.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaIdCard className="mr-2 text-gray-400" />
                    License Plate: {car.licensePlate || car.registration}{" "}
                    {/* Handle both fields */}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCogs className="mr-2 text-gray-400" />
                    {car.transmission} transmission
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FaGasPump className="mr-2 text-gray-400" />
                    {car.fuelType}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: car.color.toLowerCase() }}
                    ></div>
                    {car.color}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <button
                    onClick={() => handleEditCar(car)}
                    className="px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCar(car.id)}
                    className="px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center"
                  >
                    <FaTrash className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Car Form Modal */}
        <CarFormModal
          isOpen={isCarModalOpen}
          onClose={() => setIsCarModalOpen(false)}
          onSuccess={handleCarModalSuccess}
          editingCar={editingCar}
        />
      </div>
    </Layout>
  );
};

export default CarsPage;
