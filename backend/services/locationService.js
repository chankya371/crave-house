import axios from "axios";

export const getAddressFromCoords = async (
  lat,
  lng
) => {
  const response = await axios.get(
    process.env.OSM_REVERSE_GEOCODE_URL,
    {
      params: {
        lat,
        lon: lng,
        format: "json",
        addressdetails: 1,
      },
      headers: {
        "User-Agent": "CraveHouse/1.0",
      },
    }
  );

  return {
    fullAddress:
      response.data.display_name,
    city:
      response.data.address?.city ||
      response.data.address?.town ||
      response.data.address?.village ||
      "",
    pincode:
      response.data.address?.postcode ||
      "",
  };
};

export const searchLocation = async (query) => {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: query,
        format: "json",
        limit: 5,
      },
      headers: {
        "User-Agent": "CraveHouse/1.0",
      },
    }
  );

  return response.data;
};