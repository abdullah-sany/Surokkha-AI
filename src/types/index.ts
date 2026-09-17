export type SafetyLevel = "GREEN" | "YELLOW" | "ORANGE" | "RED";

export interface Specialist {
  name: string;
  reason: string;
}

export interface EmergencyEscalation {
  required: boolean;
  message: string;
}

export interface AnalysisResponse {
  language: "bn" | "en";
  safetyLevel: SafetyLevel;
  summary: string;
  careGuidance: string;
  suggestedSpecialists: Specialist[];
  warningSigns: string[];
  emergencyEscalation: EmergencyEscalation;
  importantNotes: string[];
}

export interface MedicalResourceLink {
  title: string;
  uri: string;
  domain: string;
}

export interface MedicalResourceSearchResult {
  query: string;
  summary: string;
  links: MedicalResourceLink[];
  searchQueries: string[];
}

export interface RecentSearchItem {
  id: string;
  query: string;
  timestamp: number;
  result: AnalysisResponse;
}

export interface DoctorInfo {
  name: string | null;
  specialty: string | null;
}

export interface PatientInfo {
  name: string | null;
  age: string | null;
  date: string | null;
}

export interface DetectedMedicine {
  rawTextFound: string;
  possibleName: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  dosage: string;
  timing: string;
  duration: string;
  purpose: string;
}

export interface SuggestedTest {
  testName: string;
  note: string;
}

export interface PrescriptionAnalysisResponse {
  doctorInfo: DoctorInfo;
  patientInfo: PatientInfo;
  detectedMedicines: DetectedMedicine[];
  suggestedTests: SuggestedTest[];
  hasUnreadableSections: boolean;
  overallAnalysis: string;
  disclaimer: string;
}

