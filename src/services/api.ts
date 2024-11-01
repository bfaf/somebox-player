import axios from "axios";

export const baseURL = "http://192.168.1.9:8080/api/v1";

const instance = axios.create({
//   baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
