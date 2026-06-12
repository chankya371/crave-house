import axios from "axios";

const locationAPI = axios.create({
  baseURL: "http://localhost:5000/api/location",
});

export default locationAPI;