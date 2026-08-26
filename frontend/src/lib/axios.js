import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:
        import.meta.env.VITE_API_BASE_URL ||
        (import.meta.env.DEV
            ? "http://localhost:4000/api/v1"
            : "/api/v1"),
    withCredentials: true,
});