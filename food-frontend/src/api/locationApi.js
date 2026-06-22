import axios from "axios";

const locationAPI = axios.create({
  baseURL: process.env.REACT_APP_LOCATION_API_URL,
});

export default locationAPI;