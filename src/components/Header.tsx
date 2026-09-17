import React, { useState } from 'react';
import { Shield, Menu, X, FileText, Activity, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  onNavigate?: (sectionId: string) => void;
  activeTab?: 'symptoms' | 'prescription';
  onSelectTab?: (tab: 'symptoms' | 'prescription') => void;
}

export default function Header({ onNavigate, activeTab = 'symptoms', onSelectTab }: HeaderProps) {
  const { language, setLanguage } = useLanguage();
  const isBn = language === 'bn';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleTabSwitch = (tab: 'symptoms' | 'prescription') => {
    setMobileMenuOpen(false);
    if (onSelectTab) {
      onSelectTab(tab);
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 cursor-pointer select-none"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <Shield size={20} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-slate-900 tracking-tight text-sm">SUROKKHA AI</span>
            <span className="text-xs text-slate-500 font-medium">
              {isBn ? 'স্মার্ট হেলথকেয়ার ইকোসিস্টেম' : 'Smart Healthcare Ecosystem'}
            </span>
          </div>
        </div>

        {/* Center Primary Nav */}
        <nav className="hidden md:flex items-center space-x-5 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => handleTabSwitch('symptoms')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors font-semibold text-xs sm:text-sm ${
              activeTab === 'symptoms'
                ? 'bg-teal-50 text-teal-700 border border-teal-200/60'
                : 'hover:text-teal-600 hover:bg-slate-50'
            }`}
          >
            <Activity size={15} />
            <span>{isBn ? 'লক্ষণ নির্দেশক' : 'Symptom Guide'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch('prescription')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors font-semibold text-xs sm:text-sm ${
              activeTab === 'prescription'
                ? 'bg-teal-50 text-teal-700 border border-teal-200/60'
                : 'hover:text-teal-600 hover:bg-slate-50'
            }`}
          >
            <FileText size={15} />
            <span>{isBn ? 'প্রেসক্রিপশন রিডার' : 'Prescription OCR'}</span>
          </button>

          <span className="h-4 w-[1px] bg-slate-200" />

          <a 
            href="#how-it-works" 
            onClick={(e) => handleNavClick(e, 'how-it-works')}
            className="hover:text-teal-600 transition-colors text-xs"
          >
            {isBn ? 'কীভাবে কাজ করে' : 'How It Works'}
          </a>
          <a 
            href="#safety-privacy" 
            onClick={(e) => handleNavClick(e, 'safety-privacy')}
            className="hover:text-teal-600 transition-colors text-xs"
          >
            {isBn ? 'নিরাপত্তা ও গোপনীয়তা' : 'Safety & Privacy'}
          </a>
          <a 
            href="#about" 
            onClick={(e) => handleNavClick(e, 'about')}
            className="hover:text-teal-600 transition-colors text-xs"
          >
            {isBn ? 'আমাদের সম্পর্কে' : 'About'}
          </a>
        </nav>

        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
            <button 
              onClick={() => setLanguage('en')} 
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${!isBn ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}>
              EN
            </button>
            <button 
              onClick={() => setLanguage('bn')} 
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${isBn ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}>
              বাং
            </button>
          </div>
          <a 
            href="https://surokkha-ai-em.onrender.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="relative inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-xs animate-emergency-pulse group"
            title={isBn ? 'জরুরী সহায়তা পোর্টাল খুলুন' : 'Open Emergency Help Portal'}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
            <span className="tracking-tight">{isBn ? 'জরুরী সহায়তা' : 'Emergency Help'}</span>
            <ExternalLink size={12} className="text-rose-500 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        <div className="flex items-center md:hidden space-x-3">
          <div className="flex items-center bg-slate-100 rounded-full p-0.5 border border-slate-200">
            <button 
              onClick={() => setLanguage('en')} 
              className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all ${!isBn ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500'}`}>
              EN
            </button>
            <button 
              onClick={() => setLanguage('bn')} 
              className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all ${isBn ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500'}`}>
              বাং
            </button>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            <button
              type="button"
              onClick={() => handleTabSwitch('symptoms')}
              className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'symptoms' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Activity size={14} />
              <span>{isBn ? 'লক্ষণ নির্দেশক' : 'Symptom Guide'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('prescription')}
              className={`flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'prescription' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <FileText size={14} />
              <span>{isBn ? 'প্রেসক্রিপশন রিডার' : 'Prescription OCR'}</span>
            </button>
          </div>

          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <a 
              href="#how-it-works" 
              onClick={(e) => handleNavClick(e, 'how-it-works')}
              className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-teal-700 transition-colors"
            >
              {isBn ? 'কীভাবে কাজ করে' : 'How It Works'}
            </a>
            <a 
              href="#safety-privacy" 
              onClick={(e) => handleNavClick(e, 'safety-privacy')}
              className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-teal-700 transition-colors"
            >
              {isBn ? 'নিরাপত্তা ও গোপনীয়তা' : 'Safety & Privacy'}
            </a>
            <a 
              href="#about" 
              onClick={(e) => handleNavClick(e, 'about')}
              className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-teal-700 transition-colors"
            >
              {isBn ? 'আমাদের সম্পর্কে' : 'About'}
            </a>
          </nav>
          <div className="pt-2 border-t border-slate-100">
            <a 
              href="https://surokkha-ai-em.onrender.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-xs animate-emergency-pulse"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
              <span>{isBn ? 'জরুরী সহায়তা' : 'Emergency Help'}</span>
              <ExternalLink size={13} className="text-rose-600 ml-1" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
