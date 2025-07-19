import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ViewProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profile/user/${userId}`);
        if (!response.ok) throw new Error('Profile not found');
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError('Profile not found');
      }
      setLoading(false);
    };
    fetchProfile();
  }, [userId]);

  if (loading) return <div className="text-center mt-12">Loading...</div>;
  if (error) return <div className="text-center mt-12 text-red-500">{error}</div>;
  if (!profile) return null;

  return (
    <div className="max-w-2xl mx-auto mt-8 card">
      <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
      <p className="text-gray-600 mb-4">{profile.bio}</p>
      <div className="mb-4">
        <span className="font-semibold">Skills:</span>
        <div className="flex flex-wrap gap-2 mt-1">
          {profile.skills.map((skill, idx) => (
            <span key={idx} className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs">{skill}</span>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Projects:</span>
        <div className="space-y-2 mt-1">
          {profile.projects.map((proj, idx) => (
            <div key={idx} className="border rounded-lg p-3 bg-gray-50">
              <div className="font-semibold">{proj.title}</div>
              <div className="text-gray-600 text-sm mb-1">{proj.description}</div>
              {proj.link && <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-primary-600 text-xs underline">{proj.link}</a>}
              <div className="flex flex-wrap gap-1 mt-1">
                {proj.techUsed.map((tech, i) => (
                  <span key={i} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {profile.experience && (
        <div className="mb-4">
          <span className="font-semibold">Experience:</span>
          <div className="text-gray-700 mt-1">{profile.experience}</div>
        </div>
      )}
      <div className="mb-4">
        <span className="font-semibold">Social Links:</span>
        <div className="flex gap-4 mt-1">
          {profile.socialLinks?.github && <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">GitHub</a>}
          {profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">LinkedIn</a>}
        </div>
      </div>
      {profile.hobbies && profile.hobbies.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold">Hobbies:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {profile.hobbies.map((hobby, idx) => (
              <span key={idx} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">{hobby}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile; 