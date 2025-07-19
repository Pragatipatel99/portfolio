const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createOrUpdateProfile,
  getMyProfile,
  getProfileByUserId,
  getAllProfiles,
  deleteProfile
} = require('../controllers/profileController');

// @route   POST /api/profile
// @desc    Create or update profile
// @access  Private
router.post('/', [
  auth,
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  body('bio')
    .notEmpty()
    .withMessage('Bio is required')
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('experience')
    .optional()
    .isArray()
    .withMessage('Experience must be an array'),
  body('hobbies')
    .optional()
    .isArray()
    .withMessage('Hobbies must be an array')
], createOrUpdateProfile);

// @route   GET /api/profile
// @desc    Get current user's profile
// @access  Private
router.get('/', auth, getMyProfile);

// @route   GET /api/profile/user/:userId
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:userId', getProfileByUserId);

// @route   GET /api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all', getAllProfiles);

// @route   DELETE /api/profile
// @desc    Delete profile
// @access  Private
router.delete('/', auth, deleteProfile);

module.exports = router; 