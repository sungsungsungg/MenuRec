import React, { useEffect, useRef } from "react";

const AddressSelection = ({ selectedAddress, onAddressSelect }) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_API; // Use your actual API key
  const addressInputRef = useRef(null); // Reference for the address input field

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve(); // Google Maps API already loaded
          return;
        }
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    loadGoogleMapsScript().then(() => {
      if (!window.google || !window.google.maps) {
        console.error("Google Maps JavaScript API not loaded.");
        return;
      }

      // Attach Autocomplete once script is loaded
      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ["address"],
        fields: ["address_components", "geometry", "name"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          alert(`No details available for input: '${place.name}'`);
          return;
        }

        // console.log(place);

        // Extract address components and create the full address
        const fullAddress = [
          extractComponent(place, "route"),
          extractComponent(place, "locality"),
          extractComponent(place, "administrative_area_level_1")
        ]
          .filter(Boolean) // Remove any empty components
          .join(", ");

        // Update the selectedAddress state with the full address
        onAddressSelect({
          ...selectedAddress,
          location: fullAddress, // Store the full address in location
          locality: place.address_components[0].short_name,
        });
      });
    }).catch((error) => {
      console.error("Error loading Google Maps API:", error);
    });

    // Helper function to extract address components
    function extractComponent(place, type) {
      for (const component of place.address_components || []) {
        if (component.types.includes(type)) {
          return component.long_name;
        }
      }
      return "";
    }
  }, [onAddressSelect]);

  return (
    <div>
      <div>
        <div>

          {/* Single input bar for the entire address */}
          <input
            type="text"
            className ="homeInput"
            placeholder="Enter Address"
            ref={addressInputRef}
            value={selectedAddress?.location || ""} // Ensure it's always a string
            onChange={(e) => onAddressSelect({ ...selectedAddress, location: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressSelection;
