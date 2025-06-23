// Core Types
export interface TimeData {
  [date: string]: {
    sites: Record<string, number>;
    categories: Record<string, number>;
  };
}

export interface DeviceUsage {
  laptop: string;
  mobile: string;
  browser: string;
}

export interface AppUsage {
  name: string;
  time: string;
  category: string;
  icon: string;
  logo?: string;
  percentage?: number;
}

export interface SiteUsage {
  name: string;
  time: string;
  category: string;
  favicon: string;
  domain?: string;
}

export interface CategoryData {
  time: string;
  percentage: number;
  color: string;
}

export interface GoalData {
  name: string;
  actual: string;
  goal: string;
  status?: 'good' | 'complete' | 'over';
}

export interface WeeklyStats {
  labels: string[];
  screenTime: number[];
  pickups: number[];
  productive?: number[];
  entertainment?: number[];
  social?: number[];
  idle?: number[];
}

// Device-specific data interfaces
export interface BrowserData {
  totalTime: string;
  todayTime: string;
  weekTime: string;
  categories: Record<string, CategoryData>;
  topSites: SiteUsage[];
  weeklyData: WeeklyStats;
}

export interface MobileData {
  totalTime: string;
  todayTime: string;
  weekTime: string;
  pickups: number;
  avgSession: string;
  notifications: number;
  mostUsed: string;
  apps: AppUsage[];
  weeklyStats: WeeklyStats;
  topSites: SiteUsage[];
}

export interface LaptopData {
  totalTime: string;
  todayTime: string;
  weekTime: string;
  activeTime: string;
  idleTime: string;
  batteryRemaining: string;
  dataUsed: string;
  applications: AppUsage[];
  weeklyProductivity: WeeklyStats;
}

export interface OverallData {
  totalTime: string;
  todayTime: string;
  weekTime: string;
  devices: DeviceUsage;
  focusScore: number;
  weeklyBreakdown: WeeklyStats;
  topSites: SiteUsage[];
  topApps: AppUsage[];
}

// Chart data interfaces
export interface ChartData {
  labels: string[];
  data: number[];
  colors: string[];
}

// Demo scenario interface
export interface DemoScenario {
  name: string;
  timeData: TimeData;
  goals: {
    productiveHours: number;
    entertainmentHours: number;
    socialMediaHours: number;
    streak: number;
  };
}

// Settings and configuration
export interface Settings {
  categories: Record<string, {
    description: string;
    examples: string[];
  }>;
  blockedSites: Array<{
    url: string;
    expiresAt: number;
  }>;
  focusBlockList: string[];
}

// Animation and UI types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
}

export interface NotificationConfig {
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  text: string;
  background: string;
}

// Event types
export type ViewType = 'browser' | 'mobile' | 'laptop' | 'overall' | 'share';
export type TimePeriod = 'today' | 'week';
export type ChartType = 'category' | 'website' | 'device' | 'weekly';