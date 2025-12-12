import axios from "axios";

// Determine API base URL based on environment
const isDev = import.meta.env.MODE === "development";
let API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
	? import.meta.env.VITE_API_BASE_URL 
	: (isDev ? "http://localhost:5000" : "https://mern-ecommerce-5sci.onrender.com");

// Remove trailing /api if it exists (we'll add it below)
API_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

// Set baseURL to include /api prefix
const FULL_API_URL = `${API_BASE_URL}/api`;

console.log("🔧 API Base URL:", FULL_API_URL);
console.log("🔧 Environment:", isDev ? "Development" : "Production");

const axiosInstance = axios.create({
	baseURL: FULL_API_URL,
	withCredentials: true, // Important: send cookies with every request
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config || {};
        const status = error.response?.status;
        const url = originalRequest.url || "";

        if (status !== 401) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        if (
            url.includes("/auth/refresh-token") ||
            url.includes("/auth/login") ||
            url.includes("/auth/signup")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            await axiosInstance.post("/auth/refresh-token");
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            return Promise.reject(
                refreshError?.response?.data?.message ? new Error(refreshError.response.data.message) : refreshError
            );
        }
    }
);

export default axiosInstance;
