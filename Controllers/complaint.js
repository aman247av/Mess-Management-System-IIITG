const User = require("../Models/usersModel");
const Complaint = require("../Models/complaintModel")
const mongoose = require("mongoose");
const sendEmail = require('./../Utils/email')
const uploadOnCloudinary = require('./../Utils/cloudinary')


exports.createComplaint = async (req, res) => {
    try {

        const { type, description} = req.body;

        const complaint = new Complaint({
            user : req.userData._id,
            type,
            description
        });

        await complaint.save();

        if(req.file) {
            uploadOnCloudinary(req.file.path, complaint._id);
        }
        
        res.status(201).json({ message: 'Complaint created successfully', complaint: complaint});
    } catch (error) {
        console.error('Error creating complaint:', error);
        res.status(500).json({ error: 'Failed to create complaint' });
    }
};


exports.showComplaint = async (req, res) => {
    try {
        let query = {};
  
        if (req.userData.role === "student") {
          // If user is a student, only show complaints created by the student
          query = { user: req.userData._id };
        }
  
        const complaints = await Complaint.find(query).populate('user');
  
        res.status(200).json({ complaints });
      } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ error: 'Failed to fetch complaints' });
      }
};


exports.updateComplaint = async (req, res) => {
  const { status, severity, assignedTo } = req.body;
  const { id: complaintId } = req.params;

  try {
      const complaint = await Complaint.findById(complaintId).populate('user');

      if (!complaint) {
          return res.status(404).json({ error: 'Complaint not found' });
      }

      // Update complaint fields if provided
      if (status) {
          complaint.status = status;
      }

      if (severity) {
          complaint.severity = severity;
          
      }

      if (assignedTo) {
          complaint.assignedTo = assignedTo;
          
      }

      await complaint.save();

      // res.redirect('adminDash', {anonymous:false});
      res.status(200).json({ message: 'Complaint updated successfully', complaint });
  } catch (error) {
      console.error('Error updating complaint:', error);
      res.status(500).json({ error: 'Failed to update complaint' });
  }
};

exports.deleteComplaint = async (req, res) => {
  const complaintId= req.params.id;

  try {
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Check if user has permission to delete complaint
    if (req.userData.role === 'student' && req.userData._id.toString() !== complaint.user.toString()) {
      return res.status(403).json({ error: 'Permission denied' });
    }

    // Delete the complaint
    await complaint.deleteOne();

    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    res.status(500).json({ error: 'Failed to delete complaint' });
  }
};

