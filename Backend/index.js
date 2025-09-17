require('dotenv').config();
const express = require('express');
const app = express();
const cors = require("cors");

// Controllers
const userController = require('./Controllers/UserController');
const expoController = require('./Controllers/ExpoController');
const exhibitorController = require('./Controllers/ExhibitorController');
const AttendeeController = require('./Controllers/AttendeeController');
const BoothController = require('./Controllers/BoothController');
const CompanyController = require('./Controllers/CompanyController');

// Middlewares
const { uploadImageHandler } = require("./Middlewares/UploadImageHandler");
const protect = require('./Middlewares/token_decode');
const connectDB = require('./Configuration/db_config');
const upload = uploadImageHandler();

// Models for stats
const User = require('./Models/User');
const Company = require('./Models/Company');
const Booth = require('./Models/Booth');
const Expo = require('./Models/Expo');

// CORS options
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------- USER ROUTES ----------------
app.post('/api/users', userController.createUser);
app.get('/api/allusers', userController.getAllUsers);
app.get('/api/user_count', userController.getUserCount);
app.delete('/api/users/:userId', userController.deleteUser);
app.post('/api/users/login', userController.loginUser);
app.get('/api/users/profile', protect, userController.getProfile);
app.put('/api/users/:userId', userController.updateUser);

// Verify routes
app.post('/api/reset-password', userController.forgetPassword);

// ---------------- EXPO ROUTES ----------------
app.post('/api/expos', expoController.createExpo);
app.get('/api/expos', expoController.getAllExpos);
app.get('/api/expos/:expoId', expoController.getExpoById);
app.delete('/api/expos/:expoId', expoController.deleteExpo);
app.put('/api/expos/:expoId', expoController.updateExpo);

// ---------------- BOOTH ROUTES ----------------
app.post('/api/booths', BoothController.addBooth);
app.get('/api/booths', BoothController.getAllBooths);
app.get('/api/booths/:expoId', BoothController.getBoothsByExpo);
app.put('/api/booths/:boothId', BoothController.updateBooth);
app.put('/api/boothBooked/:boothId', BoothController.BoothIsBooked);
app.delete('/api/booths/:boothId', BoothController.deleteBooth);

// ---------------- ATTENDEE ROUTES ----------------
app.post('/api/register-for-expo/:expoId', protect, AttendeeController.registerForExpo);
app.post('/api/register-for-session/:sessionId', protect, AttendeeController.registerForSession);
app.put('/api/bookmark-session/:sessionId', protect, AttendeeController.bookmarkSession);
app.put('/api/update-notification-preferences', protect, AttendeeController.updateNotificationPreferences);
app.get('/api/user-schedule', protect, AttendeeController.getUserSchedule);
app.get('/api/get-all-sessions', protect, AttendeeController.getAllSessions);
app.get('/api/get-registered-expo-sessions', protect, AttendeeController.getRegisteredExpoSessions);
app.post('/api/attendee-login', protect, AttendeeController.attendeeLogin);

// ---------------- COMPANY ROUTES ----------------
app.post('/api/register-company', protect, upload.single('requireDocument'), CompanyController.createCompany);
app.get('/api/get-company/:companyId', protect, CompanyController.getCompanyById);
app.get('/api/get-companies-by-exhibitor', protect, CompanyController.GetCompanyByExhibitor);
app.delete('/api/delete-company/:companyId', protect, CompanyController.deleteCompanyById);
app.put('/api/update-company/:companyId', protect, CompanyController.updateCompanyById);

// ---------------- EXHIBITOR ROUTES ----------------
app.post('/api/exhibitor', protect, exhibitorController.createExhibitor);
app.get('/api/exhibitor', protect, exhibitorController.getAllExhibitorsCompany);
app.put('/api/exhibitor/:ExhibitorId', protect, exhibitorController.ExhibitorIsAccepted);
app.get('/api/exhibitor/contact-info-exchange/:ExhibitorId', protect, exhibitorController.ContactInfoExchange);
app.get('/api/all-exhibitor', protect, exhibitorController.allExhibitors);

// ---------------- STATS ROUTE ----------------
app.get('/api/stats', async (req, res) => {
    try {
        const attendees = await User.countDocuments({ role: "ATTENDEE" });
        const exhibitors = await User.countDocuments({ role: "EXHIBITOR" });
        const companies = await Company.countDocuments();
        const booths = await Booth.countDocuments();
        const expos = await Expo.countDocuments();

        res.json({
            attendees,
            exhibitors,
            companies,
            booths,
            expos,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching stats", error: err.message });
    }
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    await connectDB();
});
