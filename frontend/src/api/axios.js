// src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api", // otomatis pakai proxy dari vite.config.js
  withCredentials: true, // untuk kirim cookie kalau pakai session/token
});

export default instance;
