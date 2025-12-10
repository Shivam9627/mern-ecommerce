import axios from "axios";

const axiosInstance = axios.create({
    baseURL:
        import.meta.env.MODE === "development"
            ? "http://localhost:5000/api"
            : "https://mern-ecommerce-5sci.onrender.com/api",
    withCredentials: true, // allow cookies (auth)
});

export default axiosInstance;
