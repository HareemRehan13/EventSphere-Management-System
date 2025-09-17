const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    companyDescription: {
        type: String,
        required: true,
    },
    companyAddress: {
        type: String,
        required: true,
    },
    companyEmail: {
        type: String,
        required: true,
    },
    companyContact: {
        type: String,
        required: true,
    },
    companyService: {
        type: String,
        required: true,
    },
    requireDocument: {
        type: String,
        required: true,
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
}, { timestamps: true }); // ✅ automatically adds createdAt and updatedAt

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
