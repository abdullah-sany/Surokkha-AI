import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Compass, Target, HeartHandshake, Users, Sparkles, Building2, Globe2, ShieldCheck } from 'lucide-react';

export default function AboutSection() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <section id="about" className="w-full scroll-mt-24 space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold uppercase tracking-wider">
          <Compass size={13} className="text-teal-600" />
          <span>{isBn ? 'আমাদের লক্ষ্য ও পরিচিতি' : 'Our Story & Purpose'}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
          {isBn ? 'সুরক্ষা এআই সম্পর্কে' : 'About Surokkha AI'}
        </h2>
        <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          {isBn
            ? 'সঠিক সময়ে সঠিক ডাক্তারের কাছে পৌঁছানোর পথকে সহজ ও সুলভ করতে আমাদের এই উদ্যোগ।'
            : 'Bridging the critical gap between symptom onset and specialized clinical care with compassionate, intelligent AI.'}
        </p>
      </div>

      {/* Main Mission Card */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-700/60 border border-teal-500/40 text-teal-200 text-xs font-medium">
            <Sparkles size={13} className="text-teal-300" />
            <span>{isBn ? 'স্বাস্থ্যসেবায় নতুন দিগন্ত' : 'Empowering Everyday Healthcare'}</span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white max-w-2xl leading-snug">
            {isBn
              ? 'অপ্রয়োজনীয় ভোগান্তি দূর করে রোগীকে দ্রুততম সময়ে উপযুক্ত বিশেষজ্ঞের কাছে পৌঁছে দেওয়া।'
              : 'Eliminating diagnostic confusion to connect every patient with the right specialist at the right time.'}
          </h3>

          <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed max-w-2xl">
            {isBn
              ? 'বাংলাদেশে লক্ষ লক্ষ মানুষ সামান্য উপসর্গ দেখে দ্বিধায় পড়েন যে কোন ডাক্তারের কাছে যাবেন—মেডিসিন, নিউরোলজি, নাকি অর্থোপেডিকস? এই বিভ্রান্তির কারণে চিকিৎসা শুরু হতে বিলম্ব ঘটে এবং আর্থিক অপচয় হয়। সুরক্ষা এআই লক্ষণগুলো বিচার করে তাৎক্ষণিক ক্লিনিক্যাল ট্রায়াজ দিকনির্দেশনা প্রদান করে।'
              : 'Millions of patients face overwhelming uncertainty when symptoms first appear: Is this an emergency? Which specialist should I book? This hesitation often leads to delayed treatment, misdirected appointments, and mounting medical costs. Surokkha AI was created to provide instant, clear, and culturally attuned clinical triage guidance.'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-teal-700/50">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">24/7</div>
              <div className="text-xs text-slate-300 mt-0.5">{isBn ? 'তাৎক্ষণিক সহায়তা' : 'Instant Guidance'}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">100%</div>
              <div className="text-xs text-slate-300 mt-0.5">{isBn ? 'গোপনীয় ও সুরক্ষিত' : 'Private & Ephemeral'}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">EN / বাং</div>
              <div className="text-xs text-slate-300 mt-0.5">{isBn ? 'দ্বিভাষিক সমর্থন' : 'Bilingual Support'}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">4-Tier</div>
              <div className="text-xs text-slate-300 mt-0.5">{isBn ? 'সেফটি ট্রায়াজ' : 'Safety Triage'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Core Values Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Target size={20} />
          </div>
          <h4 className="text-base font-bold text-slate-900">
            {isBn ? 'আমাদের ভিশন (Vision)' : 'Our Vision'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {isBn
              ? 'প্রযুক্তি এবং কৃত্রিম বুদ্ধিমত্তার দায়িত্বশীল ব্যবহারের মাধ্যমে স্বাস্থ্যসেবার প্রাথমিক দিকনির্দেশনা প্রতিটি মানুষের হাতের নাগালে পৌঁছে দেওয়া।'
              : 'A world where no individual delays life-saving medical care due to lack of health literacy or confusion over medical departments.'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <HeartHandshake size={20} />
          </div>
          <h4 className="text-base font-bold text-slate-900">
            {isBn ? 'আমাদের মূল্যবোধ (Values)' : 'Core Values'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {isBn
              ? 'রোগীর নিরাপত্তা সর্বদা সবার আগে। স্বচ্ছতা, স্পষ্ট মেডিকেল ডিসক্লেইমার এবং তথ্যের সর্বোচ্চ গোপনীয়তা আমাদের অঙ্গীকার।'
              : 'Patient safety is non-negotiable. We maintain total clinical transparency, unyielding privacy, and strict algorithmic accountability.'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Globe2 size={20} />
          </div>
          <h4 className="text-base font-bold text-slate-900">
            {isBn ? 'স্থানীয় পরিপ্রেক্ষিত (Local Impact)' : 'Ecosystem Impact'}
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {isBn
              ? 'বাংলা ও ইংরেজিতে সহজ ইন্টারফেস, বাংলাদেশের হাসপাতাল ও ইমার্জেন্সি ব্যবস্থার সাথে দ্রুত সমন্বয়ের সুযোগ।'
              : 'Designed with deep contextual relevance for Bangladesh and regional healthcare infrastructures, empowering informed consultations.'}
          </p>
        </div>
      </div>
    </section>
  );
}
