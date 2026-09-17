import React, { useState, useRef, useEffect } from 'react';
import { Mic, Image as ImageIcon, Send, X, AlertCircle, Loader2 } from 'lucide-react';
import { AnalysisResponse } from '../types';
import { useLanguage } from '../context/LanguageContext';
import ProgressStepIndicator from './ProgressStepIndicator';

interface AnalysisCardProps {
  onResult: (result: AnalysisResponse, queryText?: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function AnalysisCard({ onResult, isLoading, setIsLoading }: AnalysisCardProps) {
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB.');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Only JPG, PNG, and WEBP images are supported.');
        return;
      }
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      if ('vibrate' in navigator) navigator.vibrate(50);
    } catch (err) {
      console.error(err);
      setError('Voice input is not supported in this browser or permission denied. আপনার ব্রাউজারে ভয়েস ইনপুট সমর্থিত নয়।');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
    }
  };

  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append('audio', blob);

      const res = await fetch('/api/specialist-guide/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to transcribe audio.');
      }

      const data = await res.json();
      setText(prev => prev ? prev + ' ' + data.text : data.text);
    } catch (err: any) {
      setError(err.message || 'Error transcribing audio.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const [loadingStep, setLoadingStep] = useState(0);
  const [progressPercent, setProgressPercent] = useState(12);

  useEffect(() => {
    if (isLoading) {
      setProgressPercent(12);
      setLoadingStep(0);

      const startTime = Date.now();
      let lastStep = 0;

      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;

        let nextStep = 0;
        let nextPercent = 12;

        if (elapsed < 2.2) {
          nextStep = 0; // Analyzing...
          nextPercent = 12 + (elapsed / 2.2) * 26; // 12% to 38%
        } else if (elapsed < 5.0) {
          nextStep = 1; // Formulating...
          nextPercent = 38 + ((elapsed - 2.2) / 2.8) * 34; // 38% to 72%
        } else {
          nextStep = 2; // Preparing Result...
          nextPercent = 72 + Math.min(24, ((elapsed - 5.0) / 4.0) * 24); // 72% to 96%
        }

        if (nextStep !== lastStep) {
          lastStep = nextStep;
          if ('vibrate' in navigator) navigator.vibrate(25);
        }

        setLoadingStep(nextStep);
        setProgressPercent(nextPercent);
      }, 100);

      return () => clearInterval(interval);
    } else {
      setLoadingStep(0);
      setProgressPercent(12);
    }
  }, [isLoading]);

  const getLoadingText = () => {
    if (isBn) {
      const bnSteps = [
        "Analyzing... (বিশ্লেষণ করা হচ্ছে)",
        "Formulating... (পরামর্শ প্রণয়ন)",
        "Preparing Result... (ফলাফল প্রস্তুত)"
      ];
      return bnSteps[loadingStep] || bnSteps[0];
    }
    const enSteps = [
      "Analyzing...",
      "Formulating...",
      "Preparing Result..."
    ];
    return enSteps[loadingStep] || enSteps[0];
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError(isBn ? 'অনুগ্রহ করে আপনার সমস্যা সম্পর্কে বিস্তারিত লিখুন।' : 'Please provide a description of your concern.');
      return;
    }
    
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('situationText', text);
      // Let backend use selected UI language as primary instruction
      formData.append('language', language);
      
      if (image) {
        formData.append('image', image);
      }

      const res = await fetch('/api/specialist-guide/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || (isBn ? 'বিশ্লেষণ করতে ব্যর্থ হয়েছে।' : 'Failed to analyze concern.'));
      }

      if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
      onResult(data, text.trim());
    } catch (err: any) {
      setError(err.message || (isBn ? 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।' : 'An unexpected error occurred. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          {isBn ? (
            <>
              <h3 className="text-xl font-bold text-slate-900">আপনার কী সমস্যা হচ্ছে?</h3>
              <p className="text-sm text-slate-500 mt-2">
                আপনার লক্ষণ বা স্বাস্থ্য সমস্যা সম্পর্কে যতখানি সম্ভব বিস্তারিতভাবে জানান।
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-slate-900">Tell Us What You're Experiencing</h3>
              <p className="text-sm text-slate-500 mt-2">
                Describe your symptoms or health concern in as much detail as you are comfortable sharing.
              </p>
            </>
          )}
        </div>

        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading || isRecording || isTranscribing}
            className="w-full h-32 md:h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 resize-none transition-all placeholder:text-slate-400"
            placeholder={isBn ? "উদাহরণ: আমি কয়েকদিন ধরে মাথা ঘোরা অনুভব করছি।" : "Example: I have been feeling dizzy for several days."}
          />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading || isTranscribing}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                  isRecording 
                    ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                } disabled:opacity-50`}
              >
                <Mic size={16} />
                <span>{isRecording ? (isBn ? 'শোনা হচ্ছে... থামাতে ক্লিক করুন' : 'Listening... Click to stop') : (isBn ? 'ভয়েস ইনপুট' : 'Voice Input')}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || !!image}
                className="flex items-center space-x-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <ImageIcon size={16} />
                <span className="hidden sm:inline">{isBn ? 'ছবি যুক্ত করুন (ঐচ্ছিক)' : 'Add optional image'}</span>
                <span className="sm:hidden">{isBn ? 'ছবি' : 'Image'}</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
              />
            </div>
            
            {(isTranscribing) && (
              <div className="flex items-center space-x-2 text-sm text-teal-600 font-medium">
                <Loader2 size={16} className="animate-spin" />
                <span>{isBn ? 'ট্রান্সক্রাইব করা হচ্ছে...' : 'Transcribing...'}</span>
              </div>
            )}
          </div>

          {previewUrl && (
            <div className="relative inline-block mt-4">
              <img src={previewUrl} alt="Preview" className="h-24 w-24 object-cover rounded-lg border border-slate-200" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-white rounded-full shadow-sm border border-slate-200 p-1 text-slate-500 hover:text-rose-500"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {isLoading && (
            <div className="pt-2">
              <ProgressStepIndicator
                currentStep={loadingStep}
                progressPercent={progressPercent}
                isBn={isBn}
              />
            </div>
          )}

          {error && (
            <div className="flex items-start space-x-2 text-rose-600 bg-rose-50 p-3 rounded-lg text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 p-6 md:p-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-xs text-slate-500 leading-relaxed flex-1">
          {isBn 
            ? 'আপনার দেওয়া তথ্য নির্দেশনা তৈরির জন্য ব্যবহার করা হয় এবং এটি কোনো চিকিৎসা রেকর্ড হিসেবে সংরক্ষিত নয়।'
            : 'Your information is used to generate guidance and should not be treated as a medical record.'}
        </p>

        <button
          onClick={handleSubmit}
          disabled={isLoading || isRecording || isTranscribing || !text.trim()}
          className="w-full sm:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>{getLoadingText()}</span>
            </>
          ) : (
            <>
              <span>{isBn ? 'সমস্যা বিশ্লেষণ করুন' : 'ANALYZE CONCERN'}</span>
              <Send size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
