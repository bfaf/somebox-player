import axios from 'axios';

const instance = axios.create({
  timeout: 5 * 1000,
  headers: {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*"
  },
});

export default instance;
