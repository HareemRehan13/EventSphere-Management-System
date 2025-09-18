const moment = require('moment'); // ✅ Add this at top
const User = require('../Models/User');
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, phone, organization } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use" });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long and contain both letters and numbers." });
        }

        if (role === 'ORGANIZER' && (!organization || organization.trim() === '')) {
            return res.status(400).json({ message: "Organization is required for the 'Organizer' role" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            organization,
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                phone: newUser.phone,
                organization: newUser.organization,
                profilePicture: newUser.profilePicture,
                createdAt: newUser.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ MISSING FUNCTION added
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            organization: user.organization,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, phone, profilePicture, organization } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (profilePicture) user.profilePicture = profilePicture;
        if (organization && user.role === 'Organizer') user.organization = organization;

        user.updatedAt = Date.now();
        await user.save();

        res.json({
            message: "User updated successfully",
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                organization: user.organization,
                profilePicture: user.profilePicture,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.remove();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const forgetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999);

        // You can save OTP in user record or in a separate collection
        user.resetOTP = otp;
        user.otpExpiry = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
        await user.save();

        // TODO: Send OTP via email using your email service
        console.log(`OTP for ${email}: ${otp}`);

        res.status(200).json({ token: otp, message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { forgetPassword };
const getUserCount = async (req, res) => {
    try {
        const userCount = await User.aggregate([
            { $match: { role: { $in: ["ATTENDEE", "EXHIBITOR"] } } },
            { $group: { _id: "$role", count: { $sum: 1 } } }
        ]);

        const attendeesCount = userCount.find(item => item._id === "ATTENDEE")?.count || 0;
        const exhibitorsCount = userCount.find(item => item._id === "EXHIBITOR")?.count || 0;

        res.status(200).json({ userCount: { ATTENDEES: attendeesCount, EXHIBITORS: exhibitorsCount } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getRecentUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentUsers = users.map(user => ({
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      timeAgo: moment(user.createdAt).fromNow()
    }));
    res.status(200).json(recentUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.resetOTP || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: "OTP expired. Please request a new one." });
        }

        if (parseInt(otp) !== user.resetOTP) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // OTP verified, generate JWT for password reset
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Remove OTP from DB
        user.resetOTP = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ message: "OTP verified", token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// ✅ Final exports
module.exports = {
    createUser,
    loginUser,
    getProfile,
    updateUser,
    getAllUsers,
    deleteUser,
    forgetPassword,
    getUserCount,
    getRecentUsers,
    verifyOTP
};
