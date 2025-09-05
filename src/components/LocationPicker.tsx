import React, { useState, useEffect, useRef } from "react";
import { FaMapMarkerAlt, FaTimes, FaSearch } from "react-icons/fa";

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  initialLocation?: { address: string; lat: number; lng: number };
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
  initialLocation,
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || null
  );
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  useEffect(() => {
    if (isOpen && mapRef.current && !mapInstanceRef.current) {
      // Initialize map
      const defaultCenter = initialLocation || { lat: -17.8292, lng: 31.0522 }; // Harare center

      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 14,
        mapTypeControl: false,
        streetViewControl: false,
      });

      // Add marker
      markerRef.current = new google.maps.Marker({
        position: defaultCenter,
        map: mapInstanceRef.current,
        draggable: true,
      });

      // Initialize search box
      const input = document.getElementById(
        "location-search"
      ) as HTMLInputElement;
      searchBoxRef.current = new google.maps.places.SearchBox(input);

      // Bias search box to map bounds
      mapInstanceRef.current.addListener("bounds_changed", () => {
        searchBoxRef.current?.setBounds(mapInstanceRef.current!.getBounds()!);
      });

      // Listen for search selection
      searchBoxRef.current.addListener("places_changed", () => {
        const places = searchBoxRef.current!.getPlaces();
        if (!places || places.length === 0) return;

        const place = places[0];
        if (!place.geometry || !place.geometry.location) return;

        // Update map and marker
        mapInstanceRef.current!.setCenter(place.geometry.location);
        mapInstanceRef.current!.setZoom(16);
        markerRef.current!.setPosition(place.geometry.location);

        // Update selected location
        setSelectedLocation({
          address: place.formatted_address || place.name || "",
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      });

      // Handle marker drag
      markerRef.current.addListener("dragend", async () => {
        const position = markerRef.current!.getPosition();
        if (!position) return;

        // Reverse geocode to get address
        const geocoder = new google.maps.Geocoder();
        const response = await geocoder.geocode({ location: position });

        if (response.results[0]) {
          setSelectedLocation({
            address: response.results[0].formatted_address,
            lat: position.lat(),
            lng: position.lng(),
          });
        }
      });

      // Handle map click
      mapInstanceRef.current.addListener(
        "click",
        async (event: google.maps.MapMouseEvent) => {
          if (!event.latLng) return;

          markerRef.current!.setPosition(event.latLng);

          // Reverse geocode
          const geocoder = new google.maps.Geocoder();
          const response = await geocoder.geocode({ location: event.latLng });

          if (response.results[0]) {
            setSelectedLocation({
              address: response.results[0].formatted_address,
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            });
          }
        }
      );
    }
  }, [isOpen, initialLocation]);

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  if (!isOpen) return null;

  // Check if Google Maps is loaded
  const mapsLoaded =
    typeof window !== "undefined" && window.google && window.google.maps;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Select Pickup Location
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="location-search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for a location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {mapsLoaded ? (
            <div ref={mapRef} className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <FaMapMarkerAlt className="text-6xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Google Maps not loaded</p>
                <p className="text-sm text-gray-500">
                  Map functionality requires Google Maps API
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Selected Location Display */}
        {selectedLocation && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-red-500 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">
                    Selected Location:
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedLocation.address}
                  </p>
                </div>
              </div>
              <button
                onClick={handleConfirm}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm Location
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
