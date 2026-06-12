import {
  Marker,
  TileLayer,
  MapContainer,
  useMapEvents,
  useMap,
} from "react-leaflet";
import {
  useState,
  useEffect,
} from "react";

import locationAPI from "../api/locationApi";
import { toast } from "react-toastify";
import "../styles/locationPicker.css";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/* Fix Leaflet Marker */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function ChangeMapView({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);

  return null;
}

function LocationMarker({
  setAddress,
  position,
  setPosition,
}) {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

      setPosition([lat, lng]);

      try {
        const res =
          await locationAPI.post(
            "/reverse-geocode",
            {
              lat,
              lng,
            }
          );

        toast.success(
          "Location selected"
        );

        setAddress((prev) => ({
          ...prev,
          fullAddress:
            res.data.fullAddress ||
            res.data.address ||
            "",
          city:
            res.data.city || "",
          pincode:
            res.data.pincode || "",
        }));
      } catch (error) {
        console.log(error);
        toast.error(
          "Failed to fetch location data"
        );
      }
    },
  });

  return position ? (
    <Marker position={position} />
  ) : null;
}

export default function LocationPicker({
  setAddress,
  position,
  setPosition,
}) {
  const [search, setSearch] =
    useState("");

  const [results, setResults] =
    useState([]);

  const [mapCenter, setMapCenter] =
    useState(
      position || [
        28.6139,
        77.2090,
      ]
    );

  useEffect(() => {
    if (position) {
      setMapCenter(position);
    }
  }, [position]);

  const handleSearch =
    async () => {
      if (!search.trim())
        return;

      try {
        const res =
          await locationAPI.get(
            `/search?q=${search}`
          );

        setResults(
          res.data
        );
      } catch (error) {
        console.log(error);

        toast.error(
          "Failed to search location"
        );
      }
    };

  const selectLocation = (
    location
  ) => {
    const lat = Number(
      location.lat
    );

    const lng = Number(
      location.lon
    );

    setMapCenter([
      lat,
      lng,
    ]);

    setPosition([
      lat,
      lng,
    ]);

    setAddress((prev) => ({
      ...prev,
      fullAddress:
        location.display_name,
    }));

    setSearch(
      location.display_name
    );

    setResults([]);

    toast.success(
      "Location selected"
    );
  };

  return (
    <div className="location-picker">
      <div className="location-search">
        <input
          type="text"
          placeholder="Search location..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <button
          type="button"
          className="search-btn"
          onClick={
            handleSearch
          }
        >
          Search
        </button>
      </div>

      {results.length >
        0 && (
        <div className="search-results">
          {results.map(
            (item) => (
              <div
                key={
                  item.place_id
                }
                className="search-item"
                onClick={() =>
                  selectLocation(
                    item
                  )
                }
              >
                {
                  item.display_name
                }
              </div>
            )
          )}
        </div>
      )}

      <div className="location-map">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{
            height:
              "450px",
            width:
              "100%",
          }}
        >
          <ChangeMapView
            center={
              mapCenter
            }
          />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationMarker
            setAddress={
              setAddress
            }
            position={
              position
            }
            setPosition={
              setPosition
            }
          />
        </MapContainer>
      </div>
    </div>
  );
}