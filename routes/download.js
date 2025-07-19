const express = require('express');
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');

const router = express.Router();

// @route   GET /api/download/portfolio/:userId
// @desc    Download portfolio as HTML
// @access  Public
router.get('/portfolio/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get profile data
    const profile = await Profile.findOne({ user: userId }).populate('user', ['username', 'email']);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Generate HTML for the portfolio
    const html = generatePortfolioHTML(profile);
    
    // Set headers for HTML file download
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="${profile.name.replace(/\s+/g, '_')}_portfolio.html"`);
    
    // Send the HTML
    res.send(html);
    
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Failed to generate portfolio download' });
  }
});

// @route   GET /api/download/portfolio/:userId/json
// @desc    Download portfolio data as JSON
// @access  Public
router.get('/portfolio/:userId/json', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const profile = await Profile.findOne({ user: userId }).populate('user', ['username', 'email']);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${profile.name.replace(/\s+/g, '_')}_portfolio.json"`);
    
    // Send the portfolio data
    res.json({
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      location: profile.location,
      email: profile.email,
      phone: profile.phone,
      skills: profile.skills,
      projects: profile.projects,
      experience: profile.experience,
      education: profile.education,
      socialLinks: profile.socialLinks,
      hobbies: profile.hobbies,
      theme: profile.theme,
      exportedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('JSON download error:', error);
    res.status(500).json({ message: 'Failed to download portfolio data' });
  }
});

// Helper function to generate HTML for portfolio
function generatePortfolioHTML(profile) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>${profile.name} - Portfolio</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                margin: 0; 
                padding: 20px; 
                line-height: 1.6; 
                color: #333;
                background: #f8f9fa;
            }
            .container { 
                max-width: 800px; 
                margin: 0 auto; 
                background: white; 
                padding: 40px; 
                border-radius: 10px; 
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header { 
                text-align: center; 
                margin-bottom: 40px; 
                border-bottom: 2px solid #e9ecef;
                padding-bottom: 30px;
            }
            .header h1 { 
                color: #2c3e50; 
                margin: 0; 
                font-size: 2.5em;
            }
            .header h2 { 
                color: #3498db; 
                margin: 10px 0; 
                font-weight: 400;
            }
            .header p { 
                color: #7f8c8d; 
                font-size: 1.1em;
                margin: 15px 0;
            }
            .section { 
                margin-bottom: 35px; 
            }
            .section h3 { 
                color: #2c3e50; 
                border-bottom: 2px solid #3498db; 
                padding-bottom: 8px; 
                margin-bottom: 20px;
                font-size: 1.4em;
            }
            .skills-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
                gap: 15px; 
                margin-bottom: 20px;
            }
            .skill { 
                background: #ecf0f1; 
                padding: 10px 15px; 
                border-radius: 8px; 
                text-align: center;
                border-left: 4px solid #3498db;
            }
            .skill-name { 
                font-weight: bold; 
                color: #2c3e50;
            }
            .skill-level { 
                font-size: 0.9em; 
                color: #7f8c8d;
                margin-top: 5px;
            }
            .project { 
                margin-bottom: 25px; 
                padding: 20px; 
                border-left: 4px solid #e74c3c; 
                background: #fafafa;
                border-radius: 0 8px 8px 0;
            }
            .project h4 { 
                color: #2c3e50; 
                margin: 0 0 10px 0;
                font-size: 1.2em;
            }
            .project p { 
                margin: 10px 0; 
                color: #555;
            }
            .project-link { 
                color: #3498db; 
                text-decoration: none; 
                font-weight: bold;
            }
            .project-link:hover { 
                text-decoration: underline; 
            }
            .tech-tags { 
                margin-top: 10px; 
            }
            .tech-tag { 
                background: #3498db; 
                color: white; 
                padding: 4px 8px; 
                border-radius: 4px; 
                font-size: 0.8em; 
                margin-right: 8px;
                display: inline-block;
            }
            .experience-item { 
                margin-bottom: 25px; 
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #f39c12;
            }
            .experience-item h4 { 
                color: #2c3e50; 
                margin: 0 0 8px 0;
                font-size: 1.2em;
            }
            .experience-duration { 
                color: #7f8c8d; 
                font-weight: bold; 
                margin-bottom: 10px;
            }
            .social-links { 
                text-align: center; 
                margin-top: 30px;
            }
            .social-links a { 
                color: #3498db; 
                text-decoration: none; 
                margin: 0 15px; 
                font-weight: bold;
                display: inline-block;
                padding: 8px 16px;
                border: 2px solid #3498db;
                border-radius: 6px;
                transition: all 0.3s ease;
            }
            .social-links a:hover { 
                background: #3498db;
                color: white;
            }
            .contact-info { 
                background: #ecf0f1; 
                padding: 20px; 
                border-radius: 8px; 
                margin-bottom: 20px;
            }
            .contact-info p { 
                margin: 8px 0; 
                color: #2c3e50;
            }
            .hobbies { 
                background: #e8f5e8; 
                padding: 15px; 
                border-radius: 8px; 
                border-left: 4px solid #27ae60;
            }
            @media print {
                body { background: white; }
                .container { box-shadow: none; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>${profile.name}</h1>
                ${profile.title ? `<h2>${profile.title}</h2>` : ''}
                <p>${profile.bio}</p>
                ${profile.location ? `<p>📍 ${profile.location}</p>` : ''}
            </div>
            
            ${profile.email || profile.phone ? `
                <div class="section">
                    <h3>Contact Information</h3>
                    <div class="contact-info">
                        ${profile.email ? `<p><strong>Email:</strong> ${profile.email}</p>` : ''}
                        ${profile.phone ? `<p><strong>Phone:</strong> ${profile.phone}</p>` : ''}
                    </div>
                </div>
            ` : ''}
            
            ${profile.skills?.length ? `
                <div class="section">
                    <h3>Skills</h3>
                    <div class="skills-grid">
                        ${profile.skills.map(skill => `
                            <div class="skill">
                                <div class="skill-name">${skill.name}</div>
                                <div class="skill-level">${skill.level} • ${skill.category}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${profile.projects?.length ? `
                <div class="section">
                    <h3>Projects</h3>
                    ${profile.projects.map(project => `
                        <div class="project">
                            <h4>${project.title}</h4>
                            <p>${project.description}</p>
                            ${project.link ? `<p><a href="${project.link}" class="project-link" target="_blank">View Project →</a></p>` : ''}
                            ${project.techUsed?.length ? `
                                <div class="tech-tags">
                                    ${Array.isArray(project.techUsed) ? project.techUsed.map(tech => `<span class="tech-tag">${tech}</span>`).join('') : project.techUsed.split(',').map(tech => `<span class="tech-tag">${tech.trim()}</span>`).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${profile.experience?.length ? `
                <div class="section">
                    <h3>Experience</h3>
                    ${profile.experience.map(exp => `
                        <div class="experience-item">
                            <h4>${exp.title} at ${exp.company}</h4>
                            <div class="experience-duration">${exp.duration}</div>
                            ${exp.description ? `<p>${exp.description}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${profile.education?.length ? `
                <div class="section">
                    <h3>Education</h3>
                    ${profile.education.map(edu => `
                        <div class="experience-item">
                            <h4>${edu.degree}</h4>
                            <div class="experience-duration">${edu.institution} • ${edu.year}</div>
                            ${edu.grade ? `<p><strong>Grade:</strong> ${edu.grade}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            ${profile.socialLinks && Object.values(profile.socialLinks).some(link => link) ? `
                <div class="section">
                    <h3>Social Links</h3>
                    <div class="social-links">
                        ${profile.socialLinks.github ? `<a href="${profile.socialLinks.github}" target="_blank">GitHub</a>` : ''}
                        ${profile.socialLinks.linkedin ? `<a href="${profile.socialLinks.linkedin}" target="_blank">LinkedIn</a>` : ''}
                        ${profile.socialLinks.twitter ? `<a href="${profile.socialLinks.twitter}" target="_blank">Twitter</a>` : ''}
                        ${profile.socialLinks.website ? `<a href="${profile.socialLinks.website}" target="_blank">Website</a>` : ''}
                    </div>
                </div>
            ` : ''}
            
            ${profile.hobbies?.length ? `
                <div class="section">
                    <h3>Hobbies & Interests</h3>
                    <div class="hobbies">
                        <p>${profile.hobbies.join(' • ')}</p>
                    </div>
                </div>
            ` : ''}
            
            <div class="section" style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                <p style="color: #7f8c8d; font-size: 0.9em;">
                    Portfolio generated on ${new Date().toLocaleDateString()} • 
                    <a href="http://localhost:3000/user/${profile.user._id}" style="color: #3498db;">View Online</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
}

module.exports = router;
