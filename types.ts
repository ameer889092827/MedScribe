
export enum Page {
  HOME = 'home',
  APP = 'app',
  ABOUT = 'about',
  PRICING = 'pricing',
  LOGIN = 'login'
}

export type Language = 'en' | 'ru';

export type UserRole = 'doctor' | 'clinic';

export interface User {
  id: string;
  name: string; // Doctor's name or Admin name
  email: string;
  role: UserRole;
  organization?: string; // Clinic name
  specialty?: string; // For doctors
  licenseId?: string; // Doctor's ID/license for the form
}

export interface Form075Data {
  healthcareFacility: string; // Наименование МО
  iin: string; // ИИН
  patientName: string; // Ф.И.О.
  dateOfBirth: string; // Дата рождения
  gender: 'male' | 'female'; // Пол
  livingAddress: string; // Адрес проживания
  registrationAddress: string; // Адрес регистрации
  workPlace: string; // Место работы/учебы
  position: string; // Должность
  lastCheckupDate: string; // Дата последнего медосмотра
  pastIllnesses: string; // Заболевания
  doctorName: string; // Врач Ф.И.О.
  conclusion: string; // Заключение терапевта
}

export interface AudioState {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  durationSec: number;
}
