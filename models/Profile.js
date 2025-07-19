const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  techUsed: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    trim: true
  }
});

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
});

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true,
    trim: true
  },
  institution: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true,
    trim: true
  },
  grade: {
    type: String,
    trim: true
  }
});

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate'
  },
  category: {
    type: String,
    enum: ['Technical', 'Soft Skills', 'Languages', 'Tools', 'Other'],
    default: 'Technical'
  }
});

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100
  },
  bio: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  profilePhoto: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  skills: [skillSchema],
  projects: [projectSchema],
  experience: [experienceSchema],
  education: [educationSchema],
  socialLinks: {
    github: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  hobbies: [{
    type: String,
    trim: true
  }],
  theme: {
    type: String,
    enum: ['modern', 'classic', 'creative'],
    default: 'modern'
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema); 