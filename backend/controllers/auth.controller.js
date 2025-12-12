import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Generate access and refresh tokens
const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};

// Store refresh token in Redis
const storeRefreshToken = async (userId, refreshToken) => {
	const seconds = 7 * 24 * 60 * 60; // 7 days
	try {
		await redis.set(`refresh_token:${userId}`, refreshToken, { ex: seconds });
	} catch (err) {
		console.error("Failed to store refresh token in Redis:", err?.message || err);
	}
};

// Set cookies properly for dev and production
const setCookies = (res, accessToken, refreshToken) => {
	const isProd = process.env.NODE_ENV === "production";

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: isProd, // true only in production
		sameSite: isProd ? "none" : "lax", // "none" for cross-domain, "lax" for localhost
		maxAge: 15 * 60 * 1000, // 15 minutes
		path: "/", // important for all routes
	});

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: isProd,
		sameSite: isProd ? "none" : "lax",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		path: "/",
	});
};

// Signup user
export const signup = async (req, res) => {
	const { email, password, name } = req.body;
	try {
		const userExists = await User.findOne({ email });

		if (userExists) return res.status(400).json({ message: "User already exists" });

		const user = await User.create({ name, email, password });

		const { accessToken, refreshToken } = generateTokens(user._id);
		await storeRefreshToken(user._id, refreshToken);
		setCookies(res, accessToken, refreshToken);

		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		});
	} catch (error) {
		console.error("Error in signup controller", error?.message || error);
		res.status(500).json({ message: "Server error", error: error?.message || error });
	}
};

// Login user
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user || !(await user.comparePassword(password))) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		const { accessToken, refreshToken } = generateTokens(user._id);
		await storeRefreshToken(user._id, refreshToken);
		setCookies(res, accessToken, refreshToken);

		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		});
	} catch (error) {
		console.error("Error in login controller", error?.message || error);
		res.status(500).json({ message: "Server error", error: error?.message || error });
	}
};

// Logout user
export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			await redis.del(`refresh_token:${decoded.userId}`);
		}

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.error("Error in logout controller", error?.message || error);
		res.status(500).json({ message: "Server error", error: error?.message || error });
	}
};

// Refresh access token
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        let storedToken = null;
        try {
            storedToken = await redis.get(`refresh_token:${decoded.userId}`);
        } catch (e) {
            console.warn("Refresh token store unavailable, proceeding without Redis validation");
        }

        if (storedToken && storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

		const isProd = process.env.NODE_ENV === "production";
		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: isProd ? "none" : "lax",
			maxAge: 15 * 60 * 1000,
			path: "/",
		});

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		console.error("Error in refreshToken controller", error?.message || error);
		res.status(500).json({ message: "Server error", error: error?.message || error });
	}
};

// Get user profile
export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error?.message || error });
	}
};
