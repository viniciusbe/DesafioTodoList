import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API_URL,
});

console.log(process.env.NEXT_PUBLIC_APP_API_URL);

export default api;
