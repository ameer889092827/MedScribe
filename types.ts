
export enum Page {
  HOME = 'home',
  APP = 'app',
  ABOUT = 'about',
  PRICING = 'pricing',
  LOGIN = 'login',
  PROFILE = 'profile'
}

export type Language = 'en' | 'ru';

export type UserRole = 'doctor' | 'clinic';

export interface User {
  id: string;
  name: string; 
  email: string;
  role: UserRole;
  organization?: string;
  specialty?: string; 
  licenseId?: string;
  signatureImage?: string; // Base64 string for signature
  stampImage?: string; // Base64 string for round stamp
  profilePhoto?: string; // Base64 string for profile photo
}

export type FormType = '075' | '027' | '003';

export interface ConsultationRecord {
  id: string;
  timestamp: number;
  patientName: string;
  formType: FormType;
  summary: string;
  data: any;
}

export interface AnalyticsInsight {
  title: string;
  narrative: string;
  topCondition: string;
  patientCountStr: string;
  efficiencyGain: string;
}

// Base interface for common fields
interface BaseFormData {
  shortSummary: string; // Feature #4: 1-sentence summary
}

export interface Form075Data extends BaseFormData {
  healthcareFacility: string;
  iin: string;
  patientName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  livingAddress: string;
  registrationAddress: string;
  workPlace: string;
  position: string;
  lastCheckupDate: string;
  pastIllnesses: string;
  doctorName: string;
  conclusion: string;
}

export interface Form027Data extends BaseFormData {
  date: string;
  healthcareFacility: string;
  idNumber: string;
  patientName: string;
  dateOfBirth: string;
  address: string;
  workPlace: string;
  diagnosis: string;
  conclusion: string;
  recommendations: string;
  doctorName: string;
}

export interface Form003Data extends BaseFormData {
  healthcareFacility: string;
  codeOkud: string;
  codeOkpo: string;
  admissionDate: string;
  dischargeDate: string;
  department: string;
  ward: string;
  daysSpent: string;
  transportType: 'walking' | 'stretcher' | 'wheelchair';
  bloodType: string;
  rhFactor: string;
  sideEffects: string;
  patientName: string;
  gender: 'male' | 'female';
  age: string;
  address: string;
  phone: string;
  workPlace: string;
  referredBy: string;
  emergency: boolean;
  referralDiagnosis: string;
  admissionDiagnosis: string;
  clinicalDiagnosis: string;
  diagnosisDate: string;
  doctorName: string;
}