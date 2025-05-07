import React, { useEffect, useRef, useState } from "react";
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import './DispNearUtility.css';

const MapComponent = () => {
  const mapRef = useRef(null);
  const routeRef = useRef(null);
  const userLocation = useRef(null);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const map = L.map(mapRef.current).setView([20.7141, 70.9876], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const iconUrl = "https://img.favpng.com/18/5/15/public-toilet-icon-png-favpng-JBDLZqNXHRjuC2gDzkVZhAMU0.jpg";
    const customIcon = L.icon({
      iconUrl,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });

    const getDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371e3;
      const toRad = deg => deg * Math.PI / 180;
      const φ1 = toRad(lat1), φ2 = toRad(lat2);
      const Δφ = toRad(lat2 - lat1);
      const Δλ = toRad(lng2 - lng1);
      const a = Math.sin(Δφ/2)**2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2)**2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    const findNearestPlace = (userLat, userLng, allPlaces) => {
      let nearest = null, minDist = Infinity;
      for (const place of allPlaces) {
        const dist = getDistance(userLat, userLng, place.lat, place.lng);
        if (dist < minDist) {
          minDist = dist;
          nearest = place;
        }
      }
      return nearest;
    };

    const drawRoute = (start, end) => {
      if (routeRef.current) {
        routeRef.current.setWaypoints([ 
          L.latLng(start.lat, start.lng),
          L.latLng(end.lat, end.lng)
        ]);
      } else {
        routeRef.current = L.Routing.control({
          waypoints: [
            L.latLng(start.lat, start.lng),
            L.latLng(end.lat, end.lng)
          ],
          routeWhileDragging: false
        }).addTo(map);
      }
    };

    // 🟢 Fetch dynamic places from backend
    fetch("http://localhost:5000/admin_activity/publicToilets") // Adjust to your backend endpoint
      .then(res => res.json())
      .then(data => {
        setPlaces(data); // Update state with fetched places

        data.forEach(place => {
          const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);
          marker.bindTooltip(place.name, { permanent: false, direction: "top" });

          marker.on("click", () => {
            if (!userLocation.current) {
              alert("User location not available yet.");
              return;
            }
            drawRoute(userLocation.current, place);
            marker.openPopup();
          });
        });

        // Get user location after data is loaded
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            userLocation.current = { lat, lng };

            map.setView([lat, lng], 15);
            L.marker([lat, lng]).addTo(map).bindPopup("You are here").openPopup();

            const nearest = findNearestPlace(lat, lng, data);
            drawRoute(userLocation.current, nearest);
            alert(`Routing to nearest place: ${nearest.name}`);
          }, err => {
            alert("Location error: " + err.message);
          });
        } else {
          alert("Geolocation not supported.");
        }
      })
      .catch(err => {
        console.error("Error fetching places:", err);
        // alert("Failed to load places.");
      });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="map-container">
      {/* <Navbar /> */}
      <div id="map" ref={mapRef} style={{ height: "80vh" }} />
      {/* <Footer /> */}
    </div>
  );
};

export default MapComponent;


// import React, { useEffect, useRef } from "react";
// import Navbar from '../Navbar/Navbar';
// import Footer from '../Footer/Footer';
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
// import "leaflet-routing-machine";
// import './DispNearUtility.css'; // Import custom CSS for styling

// const places = [
//   { name: "Diu Bus Stand", lat: 20.71846, lng: 70.98108, iconUrl: "https://img.favpng.com/18/5/15/public-toilet-icon-png-favpng-JBDLZqNXHRjuC2gDzkVZhAMU0.jpg" },
//   { name: "Public Toilet", lat: 20.7095, lng: 70.98534, iconUrl: "https://img.favpng.com/18/5/15/public-toilet-icon-png-favpng-JBDLZqNXHRjuC2gDzkVZhAMU0.jpg" },
//   { name: "Public Toilet", lat: 20.7058, lng: 70.927, iconUrl: "https://img.favpng.com/18/5/15/public-toilet-icon-png-favpng-JBDLZqNXHRjuC2gDzkVZhAMU0.jpg" },
//   { name: "Public Toilet", lat: 20.713, lng: 70.9812, iconUrl: "https://img.favpng.com/18/5/15/public-toilet-icon-png-favpng-JBDLZqNXHRjuC2gDzkVZhAMU0.jpg" },
//   { name: "Public Toilet", lat: 20.7175, lng: 70.98, iconUrl: "https://img.favpng.com/18/5/15/public-toilet-icon-png-favpng-JBDLZqNXHRjuC2gDzkVZhAMU0.jpg" },
//   { name: "Public Toilet", lat: 20.7043, lng: 70.9847, iconUrl: "https://img.favpng.com/18/5/15/public-toilet-icon-png-favpng-JBDLZqNXHRjuC2gDzkVZhAMU0.jpg" }
// ];

// const MapComponent = () => {
//   const mapRef = useRef(null);
//   const routeRef = useRef(null);
//   const userLocation = useRef(null);

//   useEffect(() => {
//     const map = L.map(mapRef.current).setView([20.7141, 70.9876], 13);

//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: "&copy; OpenStreetMap contributors"
//     }).addTo(map);

//     const createCustomIcon = (iconUrl) => {
//       return L.icon({
//         iconUrl,
//         iconSize: [30, 30],
//         iconAnchor: [15, 30],
//         popupAnchor: [0, -30],
//       });
//     };

//     const getDistance = (lat1, lng1, lat2, lng2) => {
//       const R = 6371e3;
//       const toRad = deg => deg * Math.PI / 180;
//       const φ1 = toRad(lat1), φ2 = toRad(lat2);
//       const Δφ = toRad(lat2 - lat1);
//       const Δλ = toRad(lng2 - lng1);
//       const a = Math.sin(Δφ/2)**2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2)**2;
//       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//       return R * c;
//     };

//     const findNearestPlace = (userLat, userLng) => {
//       let nearest = null, minDist = Infinity;
//       for (const place of places) {
//         const dist = getDistance(userLat, userLng, place.lat, place.lng);
//         if (dist < minDist) {
//           minDist = dist;
//           nearest = place;
//         }
//       }
//       return nearest;
//     };

//     const drawRoute = (start, end) => {
//       if (routeRef.current) {
//         routeRef.current.setWaypoints([ 
//           L.latLng(start.lat, start.lng),
//           L.latLng(end.lat, end.lng)
//         ]);
//       } else {
//         routeRef.current = L.Routing.control({
//           waypoints: [
//             L.latLng(start.lat, start.lng),
//             L.latLng(end.lat, end.lng)
//           ],
//           routeWhileDragging: false
//         }).addTo(map);
//       }
//     };

//     places.forEach(place => {
//       const marker = L.marker([place.lat, place.lng], {
//         icon: createCustomIcon(place.iconUrl)
//       }).addTo(map);

//       marker.bindTooltip(place.name, { permanent: false, direction: "top" });

//       marker.on("click", () => {
//         if (!userLocation.current) {
//           alert("User location not available yet.");
//           return;
//         }
//         drawRoute(userLocation.current, place);
//         marker.openPopup();
//       });
//     });

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(position => {
//         const lat = position.coords.latitude;
//         const lng = position.coords.longitude;
//         userLocation.current = { lat, lng };

//         map.setView([lat, lng], 15);
//         L.marker([lat, lng]).addTo(map).bindPopup("You are here").openPopup();

//         const nearest = findNearestPlace(lat, lng);
//         drawRoute(userLocation.current, nearest);
//         alert(`Routing to nearest place: ${nearest.name}`);
//       }, err => {
//         alert("Location error: " + err.message);
//       });
//     } else {
//       alert("Geolocation not supported.");
//     }

//     return () => {
//       map.remove();
//     };
//   }, []);

//   return (
//     <div className="map-container">
//       <Navbar />
//       <div id="map" ref={mapRef} style={{ height: "80vh" }} />
//       <Footer />
//     </div>
//   );
// };

// export default MapComponent;

