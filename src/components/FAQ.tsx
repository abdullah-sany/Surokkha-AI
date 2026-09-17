import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const faqs = [
  {
    question: "Does this AI provide medical diagnoses?",
    questionBn: "এই এআই কি রোগ নির্ণয় করে?",
    answer: "No. The AI Specialist Guide provides informational healthcare navigation only. It is designed to help you understand the apparent urgency of your concern and point you toward the right type of healthcare professional. It cannot diagnose conditions or prescribe treatments.",
    answerBn: "না। এআই স্পেশালিস্ট গাইড শুধুমাত্র তথ্যমূলক স্বাস্থ্যসেবা নেভিগেশন প্রদান করে। এটি আপনার সমস্যার ধরন বুঝতে এবং সঠিক বিশেষজ্ঞের কাছে দিকনির্দেশনা দিতে সাহায্য করে। এটি রোগ নির্ণয় বা চিকিৎসার পরামর্শ দিতে পারে না।"
  },
  {
    question: "Is my personal health data saved?",
    questionBn: "আমার ব্যক্তিগত স্বাস্থ্য তথ্য কি সেভ করা হয়?",
    answer: "Your privacy is our priority. The health descriptions and images you provide are used solely in real-time to generate guidance and are not stored in any persistent database as a medical record.",
    answerBn: "আপনার গোপনীয়তা আমাদের অগ্রাধিকার। আপনার দেওয়া তথ্য শুধুমাত্র তাৎক্ষণিক নির্দেশনা তৈরির জন্য ব্যবহৃত হয় এবং কোনো মেডিকেল রেকর্ড হিসেবে সংরক্ষণ করা হয় না।"
  },
  {
    question: "What should I do in an emergency?",
    questionBn: "জরুরী অবস্থায় আমার কী করা উচিত?",
    answer: "If you are experiencing a life-threatening medical emergency, do not rely on this tool. Please seek immediate emergency medical assistance or visit the nearest hospital.",
    answerBn: "আপনার যদি জীবন-ঝুঁকিপূর্ণ কোনো সমস্যা হয়, তবে এই টুলের উপর নির্ভর করবেন না। অনুগ্রহ করে অবিলম্বে জরুরি চিকিৎসা সহায়তা নিন বা নিকটস্থ হাসপাতালে যান।"
  },
  {
    question: "Can this replace my doctor?",
    questionBn: "এটি কি আমার ডাক্তারের বিকল্প হতে পারে?",
    answer: "Absolutely not. This tool is a starting point to help you make informed decisions about seeking care. It should never replace professional medical evaluation, advice, or treatment.",
    answerBn: "একেবারেই না। এই টুলটি শুধুমাত্র আপনাকে স্বাস্থ্যসেবা খোঁজার বিষয়ে সিদ্ধান্ত নিতে সাহায্য করার একটি প্রাথমিক মাধ্যম। এটি কখনই পেশাদার চিকিৎসা মূল্যায়নের বিকল্প হতে পারে না।"
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <section id="faq" className="w-full mt-20 pt-10 border-t border-slate-200 scroll-mt-24">
      <div className="text-center mb-10">
        <h3 className="text-2xl font-bold text-slate-900">
          {isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্ন' : 'Frequently Asked Questions'}
        </h3>
        <p className="text-slate-500 mt-2">
          {isBn ? 'এআই স্পেশালিস্ট গাইড কীভাবে কাজ করে সে সম্পর্কে আরও জানুন' : 'Learn more about how the AI Specialist Guide works'}
        </p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx} 
              className={`border border-slate-200 rounded-2xl overflow-hidden transition-colors duration-200 ${isOpen ? 'bg-white shadow-sm border-teal-200' : 'bg-slate-50 hover:bg-white'}`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between focus:outline-none"
              >
                <div className="text-left pr-4">
                  <h4 className="font-semibold text-slate-900 leading-tight">
                    {isBn ? faq.questionBn : faq.question}
                  </h4>
                </div>
                <div className={`p-2 rounded-full transition-colors shrink-0 ${isOpen ? 'bg-teal-50 text-teal-600' : 'bg-slate-100 text-slate-400'}`}>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>
              
              {isOpen && (
                <div className="px-6 pb-5 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                    {isBn ? faq.answerBn : faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
