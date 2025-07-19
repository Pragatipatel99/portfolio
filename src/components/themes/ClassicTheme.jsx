import React from 'react';

const ClassicTheme = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-lg">
        {/* Header */}
        <div className="bg-gray-800 text-white p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              {profile.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              {profile.title && <p className="text-xl text-gray-300 mb-3">{profile.title}</p>}
              <div className="text-gray-300 space-y-1">
                {profile.location && <p>📍 {profile.location}</p>}
                {profile.email && <p>✉️ {profile.email}</p>}
                {profile.phone && <p>📞 {profile.phone}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* About */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">About Me</h2>
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">Skills</h2>
                  <div className="space-y-3">
                    {profile.skills.map((skill, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="font-medium text-gray-700">{skill.name}</span>
                        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {profile.education && profile.education.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">Education</h2>
                  <div className="space-y-4">
                    {profile.education.map((edu, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded">
                        <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
                        <p className="text-gray-600">{edu.institution}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-500">{edu.year}</span>
                          {edu.grade && <span className="text-sm text-gray-600">{edu.grade}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact & Social */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">Contact</h2>
                <div className="space-y-3">
                  {profile.socialLinks.github && (
                    <a
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-gray-900 p-2 bg-gray-50 rounded"
                    >
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  )}
                  {profile.socialLinks.linkedin && (
                    <a
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-gray-900 p-2 bg-gray-50 rounded"
                    >
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {profile.socialLinks.website && (
                    <a
                      href={profile.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-gray-900 p-2 bg-gray-50 rounded"
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9 3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Experience */}
              {profile.experience && profile.experience.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">Experience</h2>
                  <div className="space-y-6">
                    {profile.experience.map((exp, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded">
                        <h3 className="text-lg font-semibold text-gray-800">{exp.title}</h3>
                        <p className="text-gray-600 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
                        {exp.description && <p className="text-gray-700 text-sm">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {profile.projects && profile.projects.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">Projects</h2>
                  <div className="space-y-6">
                    {profile.projects.map((project, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                        {project.imageUrl && (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-32 object-cover rounded mb-3"
                          />
                        )}
                        <p className="text-gray-700 text-sm mb-3">{project.description}</p>
                        {project.techUsed && project.techUsed.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.techUsed.map((tech, techIdx) => (
                              <span key={techIdx} className="px-2 py-1 bg-white text-gray-600 rounded text-xs border">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hobbies */}
          {profile.hobbies && profile.hobbies.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.hobbies.map((hobby, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassicTheme;
