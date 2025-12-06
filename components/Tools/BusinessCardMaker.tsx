import React, { useState } from 'react';
import { Download, CreditCard, Palette, User, Mail, Phone, Globe, MapPin, Briefcase, Linkedin, Twitter, Instagram } from 'lucide-react';

interface CardData {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  linkedin: string;
  twitter: string;
  instagram: string;
}

type CardStyle = 'modern' | 'classic' | 'minimal' | 'gradient' | 'bold' | 'elegant';

const BusinessCardMaker: React.FC = () => {
  const [cardData, setCardData] = useState<CardData>({
    name: 'John Doe',
    title: 'Senior Product Designer',
    company: 'Creative Studios Inc.',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    website: 'www.example.com',
    address: 'San Francisco, CA',
    linkedin: 'johndoe',
    twitter: '@johndoe',
    instagram: '@johndoe',
  });

  const [selectedStyle, setSelectedStyle] = useState<CardStyle>('modern');

  const styles: { id: CardStyle; name: string; colors: { primary: string; secondary: string; text: string; bg: string } }[] = [
    { id: 'modern', name: 'Modern', colors: { primary: '#4f46e5', secondary: '#818cf8', text: '#ffffff', bg: '#1e293b' } },
    { id: 'classic', name: 'Classic', colors: { primary: '#1e40af', secondary: '#3b82f6', text: '#1e293b', bg: '#ffffff' } },
    { id: 'minimal', name: 'Minimal', colors: { primary: '#000000', secondary: '#6b7280', text: '#000000', bg: '#ffffff' } },
    { id: 'gradient', name: 'Gradient', colors: { primary: '#ec4899', secondary: '#8b5cf6', text: '#ffffff', bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' } },
    { id: 'bold', name: 'Bold', colors: { primary: '#dc2626', secondary: '#f59e0b', text: '#ffffff', bg: '#0f172a' } },
    { id: 'elegant', name: 'Elegant', colors: { primary: '#059669', secondary: '#10b981', text: '#064e3b', bg: '#f0fdf4' } },
  ];

  const currentStyle = styles.find(s => s.id === selectedStyle)!;

  const downloadCard = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = generateCardHTML();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const generateCardHTML = () => {
    const style = currentStyle;
    const bgStyle = style.colors.bg.startsWith('linear-gradient')
      ? `background:${style.colors.bg}`
      : `background-color:${style.colors.bg}`;

    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Business Card - ${cardData.name}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;padding:40px;background:#f3f4f6}
.card-container{width:3.5in;height:2in;${bgStyle};border-radius:8px;padding:24px;box-shadow:0 10px 30px rgba(0,0,0,0.2);position:relative;overflow:hidden}
.card-front{display:flex;flex-direction:column;justify-content:space-between;height:100%}
.name{font-size:22px;font-weight:700;color:${style.colors.text};margin-bottom:4px}
.title{font-size:14px;color:${style.colors.secondary};margin-bottom:2px}
.company{font-size:16px;font-weight:600;color:${style.colors.text};margin-bottom:16px}
.contact{font-size:11px;color:${style.colors.text};line-height:1.6;opacity:0.9}
.social{font-size:10px;color:${style.colors.secondary};margin-top:8px}
.accent{position:absolute;top:0;right:0;width:80px;height:80px;background:${style.colors.primary};opacity:0.1;border-radius:0 0 0 100%}
@media print{body{padding:0;background:white}@page{margin:0.5in;size:3.5in 2in}}
</style>
<script>window.onload=function(){setTimeout(function(){window.print()},500)}</script>
</head><body>
<div class="card-container">
  <div class="accent"></div>
  <div class="card-front">
    <div>
      <div class="name">${cardData.name}</div>
      <div class="title">${cardData.title}</div>
      <div class="company">${cardData.company}</div>
    </div>
    <div>
      <div class="contact">
        ${cardData.email ? `📧 ${cardData.email}<br>` : ''}
        ${cardData.phone ? `📱 ${cardData.phone}<br>` : ''}
        ${cardData.website ? `🌐 ${cardData.website}<br>` : ''}
        ${cardData.address ? `📍 ${cardData.address}` : ''}
      </div>
      ${cardData.linkedin || cardData.twitter || cardData.instagram ? `
        <div class="social">
          ${cardData.linkedin ? `LinkedIn: ${cardData.linkedin} | ` : ''}
          ${cardData.twitter ? `Twitter: ${cardData.twitter} | ` : ''}
          ${cardData.instagram ? `Instagram: ${cardData.instagram}` : ''}
        </div>
      ` : ''}
    </div>
  </div>
</div>
</body></html>`;
  };

  const renderCardPreview = () => {
    const style = currentStyle;
    const bgClass = selectedStyle === 'gradient'
      ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
      : '';
    const bgColor = !bgClass ? style.colors.bg : '';

    return (
      <div
        className={`w-full aspect-[3.5/2] rounded-xl shadow-2xl p-6 relative overflow-hidden ${bgClass}`}
        style={bgColor ? { backgroundColor: bgColor } : {}}
      >
        <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10"
          style={{ backgroundColor: style.colors.primary }}
        />

        <div className="relative h-full flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: style.colors.text }}>
              {cardData.name || 'Your Name'}
            </h2>
            <p className="text-sm mb-0.5" style={{ color: style.colors.secondary }}>
              {cardData.title || 'Your Title'}
            </p>
            <p className="text-base font-semibold" style={{ color: style.colors.text }}>
              {cardData.company || 'Company Name'}
            </p>
          </div>

          <div>
            <div className="text-xs space-y-0.5" style={{ color: style.colors.text, opacity: 0.9 }}>
              {cardData.email && <div className="flex items-center gap-1.5"><Mail size={10} />{cardData.email}</div>}
              {cardData.phone && <div className="flex items-center gap-1.5"><Phone size={10} />{cardData.phone}</div>}
              {cardData.website && <div className="flex items-center gap-1.5"><Globe size={10} />{cardData.website}</div>}
              {cardData.address && <div className="flex items-center gap-1.5"><MapPin size={10} />{cardData.address}</div>}
            </div>

            {(cardData.linkedin || cardData.twitter || cardData.instagram) && (
              <div className="flex gap-2 mt-2 text-xs" style={{ color: style.colors.secondary }}>
                {cardData.linkedin && <span className="flex items-center gap-1"><Linkedin size={10} />{cardData.linkedin}</span>}
                {cardData.twitter && <span className="flex items-center gap-1"><Twitter size={10} />{cardData.twitter}</span>}
                {cardData.instagram && <span className="flex items-center gap-1"><Instagram size={10} />{cardData.instagram}</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
            <CreditCard className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Business Card Maker</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Design professional business cards with live preview
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <User size={20} />
              Personal Information
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={cardData.name}
                onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-semibold"
              />
              <input
                type="text"
                placeholder="Job Title"
                value={cardData.title}
                onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Company Name"
                value={cardData.company}
                onChange={(e) => setCardData({ ...cardData, company: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Briefcase size={20} />
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={cardData.email}
                  onChange={(e) => setCardData({ ...cardData, email: e.target.value })}
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={cardData.phone}
                  onChange={(e) => setCardData({ ...cardData, phone: e.target.value })}
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Website"
                  value={cardData.website}
                  onChange={(e) => setCardData({ ...cardData, website: e.target.value })}
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Address/Location"
                  value={cardData.address}
                  onChange={(e) => setCardData({ ...cardData, address: e.target.value })}
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Social Media (Optional)</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Linkedin className="w-5 h-5 text-blue-500" />
                <input
                  type="text"
                  placeholder="LinkedIn username"
                  value={cardData.linkedin}
                  onChange={(e) => setCardData({ ...cardData, linkedin: e.target.value })}
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Twitter className="w-5 h-5 text-sky-500" />
                <input
                  type="text"
                  placeholder="Twitter handle"
                  value={cardData.twitter}
                  onChange={(e) => setCardData({ ...cardData, twitter: e.target.value })}
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-pink-500" />
                <input
                  type="text"
                  placeholder="Instagram handle"
                  value={cardData.instagram}
                  onChange={(e) => setCardData({ ...cardData, instagram: e.target.value })}
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          {/* Style Selector */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Palette size={20} />
              Card Style
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {styles.map(style => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-3 rounded-xl border-2 transition-all ${selectedStyle === style.id
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
                    }`}
                >
                  <div
                    className="w-full h-12 rounded-lg mb-2"
                    style={{ backgroundColor: style.colors.bg.startsWith('linear') ? style.colors.primary : style.colors.bg }}
                  />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">
                    {style.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Live Preview</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">3.5" × 2"</span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-8">
              {renderCardPreview()}
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={downloadCard}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Download for Print
          </button>

          {/* Print Info */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-6">
            <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-2">📏 Print Specifications</h4>
            <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
              <li>• Standard size: 3.5" × 2" (89mm × 51mm)</li>
              <li>• Ready for professional printing</li>
              <li>• Use browser's "Save as PDF" option</li>
              <li>• Recommended: 300 DPI for printing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCardMaker;