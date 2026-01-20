
export enum AnalysisTab {
  HOME = 'الرئيسية',
  SEARCH = 'البحث',
  ANALYSIS = 'المختبر',
  DISCOVERIES = 'الاكتشافات',
  STATS = 'الإحصائيات',
  LOGIN = 'الدخول',
  ABOUT = 'عن_المشروع',
  LAB_CHARS = 'تحليل_الحروف',
  LAB_GEOMETRY = 'التناظر_الهندسي',
  LAB_FREQUENCY = 'محرك_الترددات',
  LAB_VISION = 'مختبر_الرؤية',
  LAB_TIMELINE = 'رحلة_التنزيل',
  DISCOVERY_DETAIL = 'تفاصيل_الاكتشاف',
  STATS_DETAIL = 'تفاصيل_الإحصائيات',
  TOPIC_DETAIL = 'تفاصيل_الموضوع',
  CHAT_CENTER = 'مركز_الاستشارات'
}

export type StatCategory = 'words' | 'verses' | 'letters' | 'surahs' | 'roots' | 'prostrations';

export interface WordNode {
  id: string;
  group: number;
  frequency: number;
  root?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface WordLink {
  source: any;
  target: any;
  value: number;
}

export interface NumericalPattern {
  label: string;
  value1: string;
  count1: number;
  value2: string;
  count2: number;
  significance: string;
}

export interface DiscoveryItem {
  id: number;
  title: string;
  category: string;
  desc: string;
  fullContent: string;
  evidence: string[];
  conclusion: string;
  verified: boolean;
  type: 'numeric' | 'linguistic' | 'pattern';
  views?: string;
  likes?: number;
  icon?: string;
}

export interface GeminiAnalysisResponse {
  summary: string;
  patterns: Array<{
    title: string;
    description: string;
    evidence: string;
  }>;
  visualData?: {
    nodes: WordNode[];
    links: WordLink[];
  };
}
