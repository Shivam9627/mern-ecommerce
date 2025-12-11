import axios from "axios";

// Determine API base URL based on environment
const isDev = import.meta.env.MODE === "development";
let API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
	? import.meta.env.VITE_API_BASE_URL 
	: (isDev ? "http://localhost:5000" : "https://mern-ecommerce-5sci.onrender.com");

// Remove trailing /api if it exists (routes already have /api prefix)
API_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");

console.log("🔧 API Base URL:", API_BASE_URL);
console.log("🔧 Environment:", isDev ? "Development" : "Production");

const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true, // Important: send cookies with every request
	headers: {
		"Content-Type": "application/json",
	},
});

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// If 401 and not already retried
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Try to refresh token
				await axiosInstance.post("/api/auth/refresh-token");
				// Retry original request
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				console.error("Token refresh failed:", refreshError);
				// Token refresh failed, user needs to login again
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
