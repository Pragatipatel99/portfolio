const { validationResult } = require('express-validator');
const Profile = require('../models/Profile');
const User = require('../models/User');

// @desc    Create or update profile
// @route   POST /api/profile
// @access  Private
const createOrUpdateProfile = async (req, res) => {
  try {
    console.log('=== Profile Create/Update Request ===');
    console.log('User ID:', req.user?.id);
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      title,
      bio,
      profilePhoto,
      location,
      phone,
      email,
      skills,
      projects,
      experience,
      education,
      socialLinks,
      hobbies,
      theme,
      isPublic
    } = req.body;

    // Build profile object
    const profileFields = {
      user: req.user.id,
      name,
      title,
      bio,
      profilePhoto,
      location,
      phone,
      email,
      skills: Array.isArray(skills) ? 
        skills.filter(skill => skill && (skill.name || skill.trim?.())).map(skill => 
          typeof skill === 'string' ? 
            { name: skill.trim(), level: 'Intermediate', category: 'Technical' } : 
            skill
        ) : 
        (typeof skills === 'string' ? 
          skills.split(',').map(skill => skill.trim()).filter(Boolean).map(skill => ({ name: skill, level: 'Intermediate', category: 'Technical' })) : 
          []
        ),
      projects: Array.isArray(projects) ? 
        projects.filter(project => project && project.title && project.description) : 
        [],
      experience: Array.isArray(experience) ? 
        experience.filter(exp => exp && exp.title && exp.company && exp.duration) : 
        [],
      education: Array.isArray(education) ? 
        education.filter(edu => edu && edu.degree && edu.institution && edu.year) : 
        [],
      socialLinks: socialLinks || {},
      hobbies: Array.isArray(hobbies) ? hobbies : (typeof hobbies === 'string' ? hobbies.split(',').map(hobby => hobby.trim()).filter(Boolean) : []),
      theme: theme || 'modern',
      isPublic: isPublic !== undefined ? isPublic : true
    };

    // Check if profile exists
    console.log('Looking for existing profile for user:', req.user.id);
    let profile = await Profile.findOne({ user: req.user.id });
    console.log('Existing profile found:', !!profile);

    if (profile) {
      // Update
      console.log('Updating existing profile...');
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      console.log('Profile updated successfully');
    } else {
      // Create
      console.log('Creating new profile...');
      profile = new Profile(profileFields);
      await profile.save();
      console.log('Profile created successfully');
    }

    console.log('Returning profile response');
    res.json(profile);

  } catch (error) {
    console.error('=== Profile Create/Update Error ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.error('Validation errors:', errors);
      return res.status(400).json({ message: 'Validation Error', errors });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      console.error('Duplicate key error');
      return res.status(400).json({ message: 'Profile already exists for this user' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user's profile
// @route   GET /api/profile
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['username', 'email']);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get profile by user ID
// @route   GET /api/profile/user/:userId
// @access  Public
const getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate('user', ['username', 'email']);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);

  } catch (error) {
    console.error('Get profile by user ID error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all profiles
// @route   GET /api/profile/all
// @access  Public
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['username', 'email']);
    res.json(profiles);

  } catch (error) {
    console.error('Get all profiles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete profile
// @route   DELETE /api/profile
// @access  Private
const deleteProfile = async (req, res) => {
  try {
    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    res.json({ message: 'Profile deleted' });

  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrUpdateProfile,
  getMyProfile,
  getProfileByUserId,
  getAllProfiles,
  deleteProfile
}; 