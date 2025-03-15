import React, { useEffect, useRef } from "react";


const AddressSelection = ({ selectedAddress, onAddressSelect }) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_API;
  // const API_KEY = "AIzaSyAPFVx-HAzLMMsUFGMo0qXq46GfZWjaXdI";
  const addressInputRef = useRef(null); // Reference for the address input field

  useEffect( () => {
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

        // Extract address components
        const updatedAddress = {
          location: extractComponent(place, "street_number") + " " + extractComponent(place, "route"),
          locality: extractComponent(place, "locality"),
          state: extractComponent(place, "administrative_area_level_1"),
          postalCode: extractComponent(place, "postal_code"),
          country: extractComponent(place, "country"),
        };

        // Update parent state
        onAddressSelect(updatedAddress);
      });
    });
  }, [onAddressSelect]);

  function extractComponent(place, type) {
    for (const component of place.address_components || []) {
      if (component.types.includes(type)) {
        return component.long_name;
      }
    }
    return "";
  }

  return (
    <div>
      <gmpx-api-loader key={API_KEY} solution-channel="GMP_QB_addressselection_v4_cAC">
      </gmpx-api-loader>

      <div className="card-container">
        <div className="panel">
          <div>
            <img
              className="sb-title-icon"
              src="https://fonts.gstatic.com/s/i/googlematerialicons/location_pin/v5/24px.svg"
              alt="Location Icon"
            />
            <span className="sb-title">Address Selection</span>
          </div>

          {/* Attach ref to make Autocomplete work */}
          <input
            type="text"
            placeholder="Address"
            ref={addressInputRef}
            value={selectedAddress.location}
            onChange={(e) => onAddressSelect({ ...selectedAddress, location: e.target.value })}
          />

          <input type="text" placeholder="Apt, Suite, etc (optional)" />

          <input
            type="text"
            placeholder="City"
            value={selectedAddress.locality}
            onChange={(e) => onAddressSelect({ ...selectedAddress, locality: e.target.value })}
          />

          <div className="half-input-container">
            <input
              type="text"
              className="half-input"
              placeholder="State/Province"
              value={selectedAddress.state}
              onChange={(e) => onAddressSelect({ ...selectedAddress, state: e.target.value })}
            />
            <input
              type="text"
              className="half-input"
              placeholder="Zip/Postal code"
              value={selectedAddress.postalCode}
              onChange={(e) => onAddressSelect({ ...selectedAddress, postalCode: e.target.value })}
            />
          </div>

          <input
            type="text"
            placeholder="Country"
            value={selectedAddress.country}
            onChange={(e) => onAddressSelect({ ...selectedAddress, country: e.target.value })}
          />

        </div>
      </div>
    </div>
  );
};

export default AddressSelection;
