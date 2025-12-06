import React, { useState } from 'react';
import { Plus, Trash2, Download, User, Briefcase, GraduationCap, Award, FileText, Palette } from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
}

type Template = 'professional' | 'modern' | 'creative';

const ResumeBuilder: React.FC = () => {
  const [resume, setResume] = useState<ResumeData>({
    name: 'John Doe',
    title: 'Senior Software Engineer',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    website: 'johndoe.com',
    summary: 'Experienced software engineer with 8+ years of expertise in full-stack development, specializing in React, Node.js, and cloud architecture.',
    experiences: [],
    education: [],
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
  });

  const [template, setTemplate] = useState<Template>('professional');
  const [newSkill, setNewSkill] = useState('');

  const addExperience = () => {
    setResume({
      ...resume,
      experiences: [...resume.experiences, {
        id: Date.now().toString(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        description: '',
      }]
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setResume({
      ...resume,
      experiences: resume.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const deleteExperience = (id: string) => {
    setResume({ ...resume, experiences: resume.experiences.filter(exp => exp.id !== id) });
  };

  const addEducation = () => {
    setResume({
      ...resume,
      education: [...resume.education, {
        id: Date.now().toString(),
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
      }]
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResume({
      ...resume,
      education: resume.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const deleteEducation = (id: string) => {
    setResume({ ...resume, education: resume.education.filter(edu => edu.id !== id) });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResume({ ...resume, skills: [...resume.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const deleteSkill = (index: number) => {
    setResume({ ...resume, skills: resume.skills.filter((_, i) => i !== index) });
  };

  const downloadResume = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = generateResumeHTML();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const generateResumeHTML = () => {
    const colors = {
      professional: { primary: '#1e40af', secondary: '#3b82f6', text: '#1e293b', light: '#f1f5f9' },
      modern: { primary: '#7c3aed', secondary: '#a78bfa', text: '#0f172a', light: '#f5f3ff' },
      creative: { primary: '#dc2626', secondary: '#f87171', text: '#0f172a', light: '#fef2f2' },
    };
    const c = colors[template];

    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Resume - ${resume.name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;line-height:1.6;color:${c.text};padding:40px;background:#fff}
.resume{max-width:800px;margin:0 auto}
.header{text-align:center;padding-bottom:20px;border-bottom:3px solid ${c.primary};margin-bottom:30px}
.name{font-size:36px;font-weight:700;color:${c.primary};margin-bottom:5px}
.title{font-size:18px;color:${c.secondary};margin-bottom:15px}
.contact{font-size:12px;color:${c.text};opacity:0.8}
.contact span{margin:0 10px}
.summary{background:${c.light};padding:20px;border-left:4px solid ${c.primary};margin-bottom:30px;font-size:14px}
.section{margin-bottom:30px}
.section-title{font-size:20px;font-weight:700;color:${c.primary};border-bottom:2px solid ${c.secondary};padding-bottom:5px;margin-bottom:15px}
.exp-item,.edu-item{margin-bottom:20px}
.item-header{display:flex;justify-content:space-between;margin-bottom:5px}
.item-title{font-size:16px;font-weight:600;color:${c.text}}
.item-subtitle{font-size:14px;color:${c.secondary}}
.item-date{font-size:12px;color:${c.text};opacity:0.7}
.item-desc{font-size:13px;margin-top:8px;color:${c.text};opacity:0.9}
.skills{display:flex;flex-wrap:wrap;gap:8px}
.skill{padding:6px 12px;background:${c.light};border:1px solid ${c.secondary};border-radius:4px;font-size:12px;color:${c.text}}
@media print{body{padding:0}@page{margin:0.5in;size:letter}}
</style>
<script>window.onload=function(){setTimeout(function(){window.print()},500)}</script>
</head><body>
<div class="resume">
  <div class="header">
    <h1 class="name">${resume.name}</h1>
    <div class="title">${resume.title}</div>
    <div class="contact">
      ${resume.email ? `<span>${resume.email}</span>` : ''}
      ${resume.phone ? `<span>${resume.phone}</span>` : ''}
      ${resume.location ? `<span>${resume.location}</span>` : ''}
      ${resume.linkedin ? `<span>${resume.linkedin}</span>` : ''}
      ${resume.website ? `<span>${resume.website}</span>` : ''}
    </div>
  </div>

  ${resume.summary ? `
    <div class="summary">${resume.summary}</div>
  ` : ''}

  ${resume.experiences.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Professional Experience</h2>
      ${resume.experiences.map(exp => `
        <div class="exp-item">
          <div class="item-header">
            <div>
              <div class="item-title">${exp.position}</div>
              <div class="item-subtitle">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
            </div>
            <div class="item-date">${exp.startDate} - ${exp.endDate || 'Present'}</div>
          </div>
          ${exp.description ? `<div class="item-desc">${exp.description}</div>` : ''}
        </div>
      `).join('')}
    </div>
  ` : ''}

  ${resume.education.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Education</h2>
      ${resume.education.map(edu => `
        <div class="edu-item">
          <div class="item-header">
            <div>
              <div class="item-title">${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</div>
              <div class="item-subtitle">${edu.school}</div>
            </div>
            <div class="item-date">${edu.startDate} - ${edu.endDate || 'Present'}</div>
          </div>
        </div>
      `).join('')}
    </div>
  ` : ''}

  ${resume.skills.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Skills</h2>
      <div class="skills">
        ${resume.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
      </div>
    </div>
  ` : ''}
</div>
</body></html>`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Resume Builder</h1>
        <p className="text-slate-600 dark:text-slate-400">Create a professional resume in minutes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <User size={20} />Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" value={resume.name}
                onChange={(e) => setResume({ ...resume, name: e.target.value })}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 font-semibold" />
              <input type="text" placeholder="Professional Title" value={resume.title}
                onChange={(e) => setResume({ ...resume, title: e.target.value })}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500" />
              <input type="email" placeholder="Email" value={resume.email}
                onChange={(e) => setResume({ ...resume, email: e.target.value })}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500" />
              <input type="tel" placeholder="Phone" value={resume.phone}
                onChange={(e) => setResume({ ...resume, phone: e.target.value })}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="Location" value={resume.location}
                onChange={(e) => setResume({ ...resume, location: e.target.value })}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500" />
              <input type="text" placeholder="LinkedIn URL" value={resume.linkedin}
                onChange={(e) => setResume({ ...resume, linkedin: e.target.value })}
                className="px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500" />
            </div>
            <textarea placeholder="Professional Summary" value={resume.summary}
              onChange={(e) => setResume({ ...resume, summary: e.target.value })}
              className="w-full mt-4 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none h-24" />
          </div>

          {/* Experience */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase size={20} />Experience
              </h3>
              <button onClick={addExperience}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2">
                <Plus size={16} />Add
              </button>
            </div>
            <div className="space-y-4">
              {resume.experiences.map(exp => (
                <div key={exp.id} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input type="text" placeholder="Position" value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      className="px-3 py-2 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Company" value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      className="px-3 py-2 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Location" value={exp.location}
                      onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                      className="px-3 py-2 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <div className="flex gap-2">
                      <input type="text" placeholder="Start (2020)" value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      <input type="text" placeholder="End (Present)" value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <textarea placeholder="Description & achievements" value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none h-20" />
                  <button onClick={() => deleteExperience(exp.id)}
                    className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium flex items-center gap-1">
                    <Trash2 size={14} />Remove
                  </button>
                </div>
              ))}
              {resume.experiences.length === 0 && (
                <p className="text-center text-slate-400 py-8">No experience added yet</p>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap size={20} />Education
              </h3>
              <button onClick={addEducation}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2">
                <Plus size={16} />Add
              </button>
            </div>
            <div className="space-y-4">
              {resume.education.map(edu => (
                <div key={edu.id} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-xl space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input type="text" placeholder="Degree" value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      className="px-3 py-2 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Field of Study" value={edu.field}
                      onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                      className="px-3 py-2 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="School/University" value={edu.school}
                      onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                      className="px-3 py-2 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <div className="flex gap-2">
                      <input type="text" placeholder="Start" value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500" />
                      <input type="text" placeholder="End" value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <button onClick={() => deleteEducation(edu.id)}
                    className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium flex items-center gap-1">
                    <Trash2 size={14} />Remove
                  </button>
                </div>
              ))}
              {resume.education.length === 0 && (
                <p className="text-center text-slate-400 py-8">No education added yet</p>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Award size={20} />Skills
            </h3>
            <div className="flex gap-2 mb-4">
              <input type="text" placeholder="Add a skill" value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <button onClick={addSkill}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2">
                <Plus size={16} />Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <span key={index}
                  className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium flex items-center gap-2">
                  {skill}
                  <button onClick={() => deleteSkill(index)} className="hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Template Selector */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Palette size={20} />Template
            </h3>
            <div className="space-y-3">
              {[
                { id: 'professional' as Template, name: 'Professional', color: 'blue' },
                { id: 'modern' as Template, name: 'Modern', color: 'purple' },
                { id: 'creative' as Template, name: 'Creative', color: 'red' }
              ].map(t => (
                <button key={t.id} onClick={() => setTemplate(t.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${template === t.id
                      ? `border-${t.color}-600 bg-${t.color}-50 dark:bg-${t.color}-900/20`
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}>
                  <div className="font-semibold text-slate-900 dark:text-white">{t.name}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {t.id === 'professional' && 'Classic, clean design'}
                    {t.id === 'modern' && 'Contemporary styling'}
                    {t.id === 'creative' && 'Bold and unique'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Download */}
          <button onClick={downloadResume}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
            <Download size={20} />Download Resume
          </button>

          {/* Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-3">📊 Resume Stats</h4>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex justify-between">
                <span>Experience:</span>
                <span className="font-bold">{resume.experiences.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Education:</span>
                <span className="font-bold">{resume.education.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Skills:</span>
                <span className="font-bold">{resume.skills.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-6">
            <h4 className="font-bold text-green-900 dark:text-green-100 mb-2">💡 Tips</h4>
            <ul className="text-xs text-green-800 dark:text-green-200 space-y-1">
              <li>• Use action verbs in descriptions</li>
              <li>• Quantify achievements when possible</li>
              <li>• Keep it concise (1-2 pages)</li>
              <li>• Tailor to each job application</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;