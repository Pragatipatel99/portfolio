import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const emptyProject = { title: '', description: '', link: '', techUsed: '', imageUrl: '' };
const emptyExperience = { title: '', company: '', duration: '', description: '' };
const emptyEducation = { degree: '', institution: '', year: '', grade: '' };
const emptySkill = { name: '', level: 'Intermediate', category: 'Technical' };

const ProfileForm = () => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: '',
    title: '',
    bio: '',
    profilePhoto: '',
    location: '',
    phone: '',
    email: '',
    skills: [emptySkill],
    projects: [emptyProject],
    experience: [emptyExperience],
    education: [emptyEducation],
    socialLinks: { github: '', linkedin: '', twitter: '', website: '' },
    hobbies: '',
    theme: 'modern',
    isPublic: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file (JPG, PNG, GIF)' });
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size should be less than 2MB' });
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      setMessage({ type: 'info', text: 'Uploading image...' });
      
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      setForm(prev => ({ ...prev, profilePhoto: data.imageUrl }));
      setMessage({ type: 'success', text: 'Profile photo uploaded successfully!' });
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      
    } catch (err) {
      console.error('Upload error:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to upload image' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/profile`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch profile');
        }
        
        const data = await response.json();
        setForm({
          name: data.name || '',
          title: data.title || '',
          bio: data.bio || '',
          profilePhoto: data.profilePhoto || '',
          location: data.location || '',
          phone: data.phone || '',
          email: data.email || '',
          skills: data.skills?.length ? data.skills : [emptySkill],
          projects: data.projects?.length ? data.projects : [emptyProject],
          experience: data.experience?.length ? data.experience : [emptyExperience],
          education: data.education?.length ? data.education : [emptyEducation],
          socialLinks: data.socialLinks || { github: '', linkedin: '', twitter: '', website: '' },
          hobbies: data.hobbies ? data.hobbies.join(', ') : '',
          theme: data.theme || 'modern',
          isPublic: data.isPublic ?? true
        });
      } catch (err) {
        // No profile yet, ignore
      }
    };
    
    if (token) fetchProfile();
  }, [token]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Handle array field changes
  const handleArrayChange = (arrayName, idx, field, value) => {
    setForm(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => 
        i === idx ? { ...item, [field]: value } : item
      )
    }));
  };

  // Add new item to an array field
  const addArrayItem = (arrayName, emptyItem) => {
    setForm(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], { ...emptyItem }]
    }));
  };

  // Remove item from an array field
  const removeArrayItem = (arrayName, idx) => {
    setForm(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== idx)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      console.log('=== Frontend Profile Submit ===');
      console.log('Token:', token ? 'Present' : 'Missing');
      console.log('Form data:', form);
      
      const response = await fetch(`${API_URL}/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          hobbies: form.hobbies.split(',').map(h => h.trim()).filter(Boolean)
        })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to save profile');
      }

      const data = await response.json();
      console.log('Success response:', data);
      setMessage({ type: 'success', text: 'Profile saved successfully!' });
      setTimeout(() => navigate(`/user/${data.user || data._id}`), 1000);
    } catch (err) {
      console.error('Frontend submit error:', err);
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Edit Your Portfolio</h2>
            <p className="text-gray-600">Create a professional portfolio that showcases your skills and achievements</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {message.text && (
              <div className={`${message.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'} border px-4 py-3 rounded-lg`}>
                {message.text}
              </div>
            )}

            {/* Personal Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    name="name"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                  <input
                    name="title"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Full Stack Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      {form.profilePhoto ? (
                        <img 
                          src={form.profilePhoto} 
                          alt="Profile" 
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <svg className="mr-2 h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {form.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                          </>
                        )}
                        <input 
                          type="file" 
                          className="sr-only" 
                          onChange={handleFileUpload}
                          accept="image/*"
                          disabled={loading}
                        />
                      </label>
                      <p className="mt-2 text-xs text-gray-500">JPG, PNG, GIF up to 2MB</p>
                      {form.profilePhoto && (
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, profilePhoto: '' }))}
                          className="mt-2 text-sm text-red-600 hover:text-red-800"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    name="location"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
                <textarea
                  name="bio"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.bio}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Skills */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills</h3>
              {form.skills.map((skill, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg bg-white">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={skill.name}
                      onChange={(e) => handleArrayChange('skills', idx, 'name', e.target.value)}
                      placeholder="e.g., JavaScript"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={skill.level}
                      onChange={(e) => handleArrayChange('skills', idx, 'level', e.target.value)}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={skill.category}
                      onChange={(e) => handleArrayChange('skills', idx, 'category', e.target.value)}
                    >
                      <option value="Technical">Technical</option>
                      <option value="Soft Skills">Soft Skills</option>
                      <option value="Languages">Languages</option>
                      <option value="Tools">Tools</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    {form.skills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('skills', idx)}
                        className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('skills', emptySkill)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Skill
              </button>
            </div>

            {/* Projects */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Projects</h3>
              {form.projects.map((project, idx) => (
                <div key={idx} className="mb-4 p-4 border rounded-lg bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-900">Project {idx + 1}</h4>
                    {form.projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('projects', idx)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={project.title}
                        onChange={(e) => handleArrayChange('projects', idx, 'title', e.target.value)}
                        placeholder="Project title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={project.link}
                        onChange={(e) => handleArrayChange('projects', idx, 'link', e.target.value)}
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={project.imageUrl}
                        onChange={(e) => handleArrayChange('projects', idx, 'imageUrl', e.target.value)}
                        placeholder="https://example.com/project-image.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tech Used (comma separated)</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={project.techUsed}
                        onChange={(e) => handleArrayChange('projects', idx, 'techUsed', e.target.value)}
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={project.description}
                      onChange={(e) => handleArrayChange('projects', idx, 'description', e.target.value)}
                      rows={2}
                      placeholder="Project description"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('projects', emptyProject)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Project
              </button>
            </div>

            {/* Experience */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Experience</h3>
              {form.experience.map((exp, idx) => (
                <div key={idx} className="mb-4 p-4 border rounded-lg bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-900">Experience {idx + 1}</h4>
                    {form.experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('experience', idx)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={exp.title}
                        onChange={(e) => handleArrayChange('experience', idx, 'title', e.target.value)}
                        placeholder="e.g., Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={exp.company}
                        onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)}
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={exp.duration}
                        onChange={(e) => handleArrayChange('experience', idx, 'duration', e.target.value)}
                        placeholder="e.g., Jan 2020 - Present"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={exp.description}
                      onChange={(e) => handleArrayChange('experience', idx, 'description', e.target.value)}
                      rows={2}
                      placeholder="Describe your role and achievements"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('experience', emptyExperience)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Experience
              </button>
            </div>

            {/* Education */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Education</h3>
              {form.education.map((edu, idx) => (
                <div key={idx} className="mb-4 p-4 border rounded-lg bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-900">Education {idx + 1}</h4>
                    {form.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('education', idx)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={edu.degree}
                        onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)}
                        placeholder="e.g., Bachelor of Science in Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={edu.institution}
                        onChange={(e) => handleArrayChange('education', idx, 'institution', e.target.value)}
                        placeholder="University name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={edu.year}
                        onChange={(e) => handleArrayChange('education', idx, 'year', e.target.value)}
                        placeholder="e.g., 2020-2024"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grade (optional)</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={edu.grade}
                        onChange={(e) => handleArrayChange('education', idx, 'grade', e.target.value)}
                        placeholder="e.g., 3.8 GPA"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('education', emptyEducation)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Education
              </button>
            </div>

            {/* Social Links */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.socialLinks.github}
                    onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, github: e.target.value } })}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.socialLinks.linkedin}
                    onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value } })}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.socialLinks.twitter}
                    onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, twitter: e.target.value } })}
                    placeholder="https://twitter.com/username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.socialLinks.website}
                    onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, website: e.target.value } })}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hobbies (comma separated)</label>
                  <input
                    name="hobbies"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.hobbies}
                    onChange={handleChange}
                    placeholder="Reading, Photography, Hiking"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Theme</label>
                  <select
                    name="theme"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={form.theme}
                    onChange={handleChange}
                  >
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    name="isPublic"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={form.isPublic}
                    onChange={handleChange}
                  />
                  <span className="ml-2 text-sm text-gray-700">Make my portfolio public</span>
                </label>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Portfolio...
                  </span>
                ) : (
                  'Save Portfolio'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
