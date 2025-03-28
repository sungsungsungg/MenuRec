import axios from "axios";

/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

let geocoder;

/**
 * Initializes the Google Maps API if not already loaded.
 * @param {string} apiKey - Your Google Maps API Key
 * @returns {Promise<void>}
 */
export function loadGoogleMapsScript(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = resolve;
    script.defer = true; // Defer the execution of the script until the document is fully parsed
    script.onerror = () => reject("Google Maps script failed to load.");
    document.body.appendChild(script);
  });
}

/**
 * Geocodes an address and returns its latitude & longitude.
 * @param {string} address - Address to geocode.
 * @returns {Promise<{lat: number, lng: number}>}
 */
export function getCoordinates(address) {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      reject("Google Maps API not loaded.");
      return;
    }

    if (!geocoder) {
      geocoder = new window.google.maps.Geocoder();
    }

    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results.length > 0) {
        const location = results[0].geometry.location;
        resolve({ lat: location.lat(), lng: location.lng() });
      } else {
        reject("Geocode failed: " + status);
      }
    });
  });
}


/***
 * 
 * @params coord1 => Coordinate of current location
 * @params coord2 => Coordinate of the restaurant
 */
export function getDistance(coord1, coord2) {

    if(!coord1) return;

    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRadians(coord2.latitude - coord1.lat);
    const dLng = toRadians(coord2.longitude - coord1.lng);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(coord1.lat)) * Math.cos(toRadians(coord2.latitude)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c *0.621371; // Distance in kilometers
  }
  
/**
 * Converts degrees to radians.
 * @param {number} degrees - Value in degrees.
 * @returns {number} - Value in radians.
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

