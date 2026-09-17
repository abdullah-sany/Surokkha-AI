/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Activity, FileText } from 'lucide-react';
import Header from './components/Header';
import AnalysisCard from './components/AnalysisCard';
import ResultView from './components/ResultView';
import PrescriptionCard from './components/PrescriptionCard';
import PrescriptionResultView from './components/PrescriptionResultView';
import HowItWorks from './components/HowItWorks';
import SafetyPrivacy from './components/SafetyPrivacy';
import AboutSection from './components/AboutSection';
import FAQ from './components/FAQ';
import RecentSearches from './components/RecentSearches';
import { AnalysisResponse, PrescriptionAnalysisResponse, RecentSearchItem } from './types';
import { useLanguage } from './context/LanguageContext';
import { useRecentSearches } from './hooks/useRecentSearches';

export default function App() {
  const [activeTab, setActiveTab] = useState<'symptoms' | 'prescription'>('symptoms');
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [prescriptionResult, setPrescriptionResult] = useState<PrescriptionAnalysisResponse | null>(null);
  const [prescriptionImageUrl, setPrescriptionImageUrl] = useState<string | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [isPrescriptionLoading, setIsPrescriptionLoading] = useState(false);

  const { language } = useLanguage();
  const isBn = language === 'bn';

  const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } = useRecentSearches();

  const handleAnalysisResult = (analysisResult: AnalysisResponse, queryText?: string) => {
    setResult(analysisResult);
    const query = queryText || analysisResult.summary?.slice(0, 80) || (isBn ? 'স্বাস্থ্য সমস্যা বিশ্লেষণ' : 'Health Concern Analysis');
    addRecentSearch(query, analysisResult);
  };

  const handlePrescriptionResult = (pResult: PrescriptionAnalysisResponse, imgUrl?: string) => {
    setPrescriptionResult(pResult);
    setPrescriptionImageUrl(imgUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRecentSearch = (item: RecentSearchItem) => {
    setActiveTab('symptoms');
    setPrescriptionResult(null);
    setResult(item.result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (sectionId: string) => {
    if (result || prescriptionResult) {
      setResult(null);
      setPrescriptionResult(null);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleTabChange = (tab: 'symptoms' | 'prescription') => {
    setActiveTab(tab);
    setResult(null);
    setPrescriptionResult(null);
  };

  const isAnyResult = Boolean(result || prescriptionResult);
  const isAnyLoading = isLoading || isPrescriptionLoading;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900 relative overflow-hidden">
      {/* Subtle abstract background element */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-100/40 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-40 -left-20 w-80 h-80 bg-teal-100/40 rounded-full blur-3xl opacity-50"></div>
      </div>
      
      <div className="relative z-10 flex-grow flex flex-col w-full h-full">
        <Header 
          onNavigate={handleNavigate} 
          activeTab={activeTab} 
          onSelectTab={handleTabChange} 
        />
        
        <main className="flex-grow flex flex-col items-center justify-start w-full px-4 sm:px-6 py-10 md:py-16">
          <div className="w-full max-w-3xl space-y-12">
            {!isAnyResult && (
              <div className="text-center space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Feature Mode Switcher Pill */}
                <div className="inline-flex p-1 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => handleTabChange('symptoms')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeTab === 'symptoms'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                    }`}
                  >
                    <Activity size={16} />
                    <span>{isBn ? 'লক্ষণ নির্দেশক' : 'Symptom Guide'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTabChange('prescription')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeTab === 'prescription'
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                    }`}
                  >
                    <FileText size={16} />
                    <span>{isBn ? 'প্রেসক্রিপশন রিডার (OCR)' : 'Prescription OCR'}</span>
                  </button>
                </div>
                
                {/* Hero Titles */}
                {activeTab === 'symptoms' ? (
                  isBn ? (
                    <>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                        আপনার সমস্যাটি বুঝুন।<br />সঠিক চিকিৎসা সহায়তার পথ খুঁজুন।
                      </h1>
                      <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base">
                        আপনার কী সমস্যা হচ্ছে তা বিস্তারিত জানান এবং কোন স্তরের চিকিৎসা প্রয়োজন হতে পারে সে সম্পর্কে এআই-চালিত নির্দেশনা পান।
                      </p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                        Understand Your Concern.<br />
                        Know Where to Seek Care.
                      </h1>
                      <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base">
                        Describe what you are experiencing and receive AI-powered guidance about the level of care that may be appropriate.
                      </p>
                    </>
                  )
                ) : (
                  isBn ? (
                    <>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                        ডাক্তারের প্রেসক্রিপশন পড়ুন সহজে।<br />ওষুধ ও নির্দেশনার নিখুঁত বাংলা রূপান্তর।
                      </h1>
                      <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base">
                        প্রেসক্রিপশনের ছবি আপলোড করুন। এআই নির্ভুলভাবে ডাক্তারের হাতের লেখা, ওষুধের মাত্রা (ডোজ), খাওয়ার নিয়ম এবং ল্যাব টেস্ট বাংলায় বিশ্লেষণ করবে।
                      </p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                        Decode Doctor Prescriptions.<br />
                        Clear Bengali Drug & Dosage Translation.
                      </h1>
                      <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base">
                        Upload or snap a prescription photo. Surokkha AI extracts doctor details, standardizes medicine names, decodes dosages, and translates instructions into empathetic Bengali.
                      </p>
                    </>
                  )
                )}
              </div>
            )}
            
            {/* View Render Area */}
            {prescriptionResult ? (
              <PrescriptionResultView 
                data={prescriptionResult} 
                imageUrl={prescriptionImageUrl} 
                onReset={() => setPrescriptionResult(null)} 
              />
            ) : result ? (
              <ResultView 
                result={result} 
                onReset={() => setResult(null)} 
              />
            ) : (
              <>
                {activeTab === 'symptoms' ? (
                  <AnalysisCard 
                    onResult={handleAnalysisResult} 
                    isLoading={isLoading} 
                    setIsLoading={setIsLoading} 
                  />
                ) : (
                  <PrescriptionCard 
                    onResult={handlePrescriptionResult} 
                    isLoading={isPrescriptionLoading} 
                    setIsLoading={setIsPrescriptionLoading} 
                  />
                )}

                <HowItWorks />
                <SafetyPrivacy />
                <AboutSection />
                <FAQ />
                {activeTab === 'symptoms' && (
                  <RecentSearches
                    searches={recentSearches}
                    onSelectSearch={handleSelectRecentSearch}
                    onRemoveSearch={removeRecentSearch}
                    onClearAll={clearRecentSearches}
                  />
                )}
              </>
            )}
          </div>
        </main>

        {/* Sticky Privacy Reminder Banner */}
        {isAnyLoading && (
          <div className="fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-xs text-slate-200 px-4 py-3 shadow-2xl z-50 animate-in slide-in-from-bottom-full duration-500 border-t border-slate-800">
            <div className="max-w-3xl mx-auto flex items-center justify-center gap-3 text-center sm:text-left">
              <ShieldCheck size={20} className="text-teal-400 shrink-0 hidden sm:block" />
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                <span className="font-semibold text-white">
                  {isBn ? 'গোপনীয়তা সতর্কতা:' : 'Privacy Reminder:'}
                </span>{' '}
                {isBn 
                  ? 'আপনার প্রেসক্রিপশন ও তথ্য সুরক্ষিতভাবে রিয়েল-টাইমে প্রসেস করা হয় এবং কখনই স্থায়ীভাবে সংরক্ষণ করা হয় না।' 
                  : 'Your prescription images and health data are processed ephemerally and never permanently stored.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
