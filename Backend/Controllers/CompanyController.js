const moment = require('moment'); // ✅ Add this at top
const Company = require("../Models/Company");
const mongoose = require("mongoose");


// Create a new company
const createCompany = async (req, res) => {
    const { userId } = req.user;
    const { companyName, companyDescription, companyEmail, companyContact, companyService, companyAddress } = req.body;
    try {
      let requireDocumentUrl = null;
      if (req.file) {
        requireDocumentUrl = req.file.path; // Uploaded file URL
      } else {
        return res.status(400).json({ message: "Require Document (file) is missing" });
      }
  
      //Create the Exhibitor Company/Org
      const NewCompany = await Company.create({
        companyName,
        companyDescription,
        companyEmail,
        companyContact,
        companyService,
        companyAddress,
        requireDocument: requireDocumentUrl,
        userId
      });
  
      await NewCompany.save();
  
      return res.status(201).json({
        message: "Company Created Successfully",
        company: NewCompany,
      });
    } catch (error) {
      console.error("Error creating company:", error);
      return res.status(500).json({
        message: "An error occurred while creating the company",
        error: error.message,
      });
    }
};

// Get all companies
const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find({});
        res.status(200).send(companies);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a company by ID
const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.companyId);
        if (!company) {
            return res.status(404).send();
        }
        res.status(200).send(company);
    } catch (error) {
        res.status(500).send(error);
    }
};

const GetCompanyByExhibitor = async (req, res) => {
    const { userId } = req.user;
    try {
      const GetCompanyByExhibitor = await Company.find({ userId: userId});
      return res.status(200).json(GetCompanyByExhibitor);}
    catch (error) {
      console.error("Error fetching company:", error);
      return res.status(500).json({ message: "An error occurred while fetching the company", error: error.message });
    }
  }

// Update a company by ID
const updateCompanyById = async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(req.params.companyId, req.body, { new: true, runValidators: true });
        if (!company) {
            return res.status(404).send();
        }
        res.status(200).send(company);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a company by ID
const deleteCompanyById = async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.companyId);
        if (!company) {
            return res.status(404).send();
        }
        res.status(200).send(company);
    } catch (error) {
        res.status(500).send(error);
    }
};
const getRecentCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 }).limit(5).populate("userId", "name email");
    const recentCompanies = companies.map(company => ({
      companyName: company.companyName,
      owner: company.userId?.name || null,
      createdAt: company.createdAt,
      timeAgo: moment(company.createdAt).fromNow()
    }));
    res.status(200).json(recentCompanies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    createCompany,
    getAllCompanies,
    getCompanyById,
    updateCompanyById,
    deleteCompanyById,
    GetCompanyByExhibitor,
    getRecentCompanies
  };