import React, { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "./Map.scss";
import { getCityCoordinates } from './coordinates.js';

const Map = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        const data = await response.json();
        console.log('Fetched events:', data);
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([25, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
    }

    if (mapInstanceRef.current) {
      // Clear existing markers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      const markers = [];

      // Add new markers for each event
      events.forEach(event => {
        const coordinates = getCityCoordinates(event.city);
        if (coordinates) {
          const eventMarker = L.marker([coordinates.lat, coordinates.lon]).addTo(mapInstanceRef.current);
          eventMarker.bindPopup(`${event.city}: ${event.description} on ${event.date}`);
          markers.push(eventMarker);
        } else {
          console.warn(`Coordinates not found for city: ${event.city}`);
        }
      });

      // Fit map bounds to show all markers
      if (markers.length > 0) {
        const group = L.featureGroup(markers);
        mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [50, 50] });
      }
    }

    console.log('Events updated:', events);
  }, [events]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>;
};

export default Map;