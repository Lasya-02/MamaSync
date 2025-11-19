import React, { useEffect, useState } from "react";
export default function Hospitals() {
   const [hospitals, setHospitals] = useState([]);
  const [map, setMap] = useState(null);
  const [error, setError] = useState("");

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  const loadMapsScript = (callback) => {
    if (document.getElementById("google-maps-script")) {
      callback();
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = callback;
    document.body.appendChild(script);
  };

  //blocked keywords
  const blockedWords = ["psychiatry", "psychiatric", "psych", "mental"];

  const isBlocked = (name) => {
    if (!name) return false;
    const lower = name.toLowerCase();
    return blockedWords.some((word) => lower.includes(word));
  };

  //get hospital details
  const getHospitalDetails = (placeId, mapObj, callback) => {
    const service = new window.google.maps.places.PlacesService(mapObj);

    service.getDetails(
      {
        placeId: placeId,
        fields: ["name", "vicinity", "formatted_phone_number"],
      },
      (result, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          callback(result);
        } else {
          callback(null);
        }
      }
    );
  };

  //find nearby hospitals
  const findNearbyHospitals = async (mapObj, location) => {
    const service = new window.google.maps.places.PlacesService(mapObj);

    const request = {
      location,
      radius: "5000",
      type: "hospital",
    };

    service.nearbySearch(request, async (results, status) => {
      if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
        setError("No hospitals found nearby.");
        return;
      }

      const selected = [];
      let index = 0;

      //3 valid hospitals
      while (selected.length < 3 && index < results.length) {
        const place = results[index];

        if (isBlocked(place.name)) {
          index++;
          continue;
        }

        await new Promise((resolve) => {
          getHospitalDetails(place.place_id, mapObj, (details) => {
            if (details) {
              selected.push({
                name: details.name,
                address: details.vicinity,
                phone: details.formatted_phone_number || "Phone not listed",
                place_id: place.place_id,
              });
            }
            resolve();
          });
        });

        // Add map marker
        new window.google.maps.Marker({
          map: mapObj,
          position: place.geometry.location,
          title: place.name,
        });

        index++;
      }

      setHospitals(selected);
    });
  };

  useEffect(() => {
    loadMapsScript(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userLocation = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };

            const mapObj = new window.google.maps.Map(
              document.getElementById("map"),
              {
                center: userLocation,
                zoom: 14,
              }
            );

            setMap(mapObj);
            findNearbyHospitals(mapObj, userLocation);
          },
          () => setError("Please allow location access.")
        );
      } else {
        setError("Geolocation not supported.");
      }
    });
  }, []);
  return (
    <div className="page-container">
      <h2>🏥 Nearby Hospitals</h2>
      <p>Find trusted hospitals and clinics near your location.</p>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        id="map"
        style={{
          width: "100%",
          height: "350px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      ></div>
      <h3>Top Nearby Hospitals</h3>
      <ul>
        {hospitals.map((h, i) => (
          <li key={i} style={{ marginBottom: "15px" }}>
            <strong>{h.name}</strong>
            <br />
            📍 {h.address}
            <br />
            📞 {h.phone}
            <br />
            <a
              href={`https://www.google.com/maps/place/?q=place_id:${h.place_id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#3478f6" }}
            >
              🔗 View on Google Maps
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
