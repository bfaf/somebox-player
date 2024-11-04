import axios from "axios";

export const baseURL = "http://192.168.1.9:8080/api/v1";

const instance = axios.create({
  timeout: 5 * 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
