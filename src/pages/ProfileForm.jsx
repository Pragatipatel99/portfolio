import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const emptyProject = { title: '', description: '', link: '', techUsed: '' };

const ProfileForm = () => {
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: '',
    bio: '',
    skills: '',
    projects: [emptyProject],
    experience: '',
    socialLinks: { github: '', linkedin: '' },
    hobbies: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current profile if exists
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setForm({
          name: data.name || '',
          bio: data.bio || '',
          skills: data.skills ? data.skills.join(', ') : '',
          projects: data.projects && data.projects.length > 0 ? data.projects.map(p => ({ ...p, techUsed: p.techUsed ? p.techUsed.join(', ') : '' })) : [emptyProject],
          experience: data.experience || '',
          socialLinks: data.socialLinks || { github: '', linkedin: '' },
          hobbies: data.hobbies ? data.hobbies.join(', ') : ''
        });
      } catch (err) {
        // No profile yet, ignore
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProjectChange = (idx, e) => {
    const newProjects = form.projects.map((proj, i) =>
      i === idx ? { ...proj, [e.target.name]: e.target.value } : proj
    );
    setForm({ ...form, projects: newProjects });
  };

  const addProject = () => {
    setForm({ ...form, projects: [...form.projects, emptyProject] });
  };

  const removeProject = (idx) => {
    setForm({ ...form, projects: form.projects.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        hobbies: form.hobbies.split(',').map(h => h.trim()).filter(Boolean),
        projects: form.projects.map(p => ({ ...p, techUsed: p.techUsed.split(',').map(t => t.trim()).filter(Boolean) }))
      };
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save profile');
      }
      setSuccess('Profile saved!');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Your Portfolio</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg">{success}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input name="name" className="input-field mt-1" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea name="bio" className="input-field mt-1" value={form.bio} onChange={handleChange} required rows={3} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
          <input name="skills" className="input-field mt-1" value={form.skills} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Projects</label>
          {form.projects.map((project, idx) => (
            <div key={idx} className="mb-4 border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Project {idx + 1}</span>
                {form.projects.length > 1 && (
                  <button type="button" onClick={() => removeProject(idx)} className="text-red-500 text-xs">Remove</button>
                )}
              </div>
              <input name="title" className="input-field mb-2" placeholder="Title" value={project.title} onChange={e => handleProjectChange(idx, e)} />
              <textarea name="description" className="input-field mb-2" placeholder="Description" value={project.description} onChange={e => handleProjectChange(idx, e)} rows={2} />
              <input name="link" className="input-field mb-2" placeholder="Project Link" value={project.link} onChange={e => handleProjectChange(idx, e)} />
              <input name="techUsed" className="input-field" placeholder="Tech Used (comma separated)" value={project.techUsed} onChange={e => handleProjectChange(idx, e)} />
            </div>
          ))}
          <button type="button" onClick={addProject} className="btn-secondary mt-2">Add Project</button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Experience</label>
          <textarea name="experience" className="input-field mt-1" value={form.experience} onChange={handleChange} rows={2} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Social Links</label>
          <input name="github" className="input-field mt-1 mb-2" placeholder="GitHub URL" value={form.socialLinks.github} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, github: e.target.value } })} />
          <input name="linkedin" className="input-field" placeholder="LinkedIn URL" value={form.socialLinks.linkedin} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value } })} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Hobbies (comma separated)</label>
          <input name="hobbies" className="input-field mt-1" value={form.hobbies} onChange={handleChange} />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Saving...' : 'Save Portfolio'}</button>
      </form>
    </div>
  );
};

export default ProfileForm; 