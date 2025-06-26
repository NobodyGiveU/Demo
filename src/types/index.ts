// Core application types
export type ViewType = 'browser' | 'mobile' | 'laptop' | 'overall' | 'share';
export type TimePeriod = 'today' | 'week';
export type ChartType = 'doughnut' | 'bar' | 'line' | 'pie';
export type NotificationType = 'success' | 'warning' | 'error' | 'info';

// Time and usage data interfaces
export interface TimeData {
  [date: string]: {
    sites: Record<string, number>;
    categories: Record<string, number>;
    apps?: Record<string, number>;
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
  domain?: string;
}

export interface SiteUsage {
  name: string;
  time: string;
  category: string;
  favicon: string;
  domain?: string;
  url?: string;
}

export interface CategoryData {
  time: string;
  percentage: number;
  color: string;
  description?: string;
}

export interface GoalData {
  name: string;
  actual: string;
  goal: string;
  status: 'good' | 'complete' | 'over' | 'warning';
  progress?: number;
}

export interface WeeklyStats {
  labels: string[];
  screenTime: number[];
  pickups: number[];
  productive?: number[];
  entertainment?: number[];
  social?: number[];
  idle?: number[];
  notifications?: number[];
}

// Device-specific data interfaces
export interface BrowserData {
  totalTime: string;
  todayTime: string;
  weekTime: string;
  categories: Record<string, CategoryData>;
  topSites: SiteUsage[];
  weeklyData: WeeklyStats;
  focusScore?: number;
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
  batteryLevel?: number;
  dataUsage?: string;
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
  cpuUsage?: number;
  memoryUsage?: number;
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
  goals?: GoalData[];
}

export interface ShareData {
  totalScreenTime: string;
  productiveTime: string;
  focusScore: number;
  goalsMet: string;
  weeklyHighlights: string[];
  recentShares: Array<{
    title: string;
    platform: string;
    time: string;
  }>;
}

// Chart data interfaces
export interface ChartData {
  labels: string[];
  data: number[];
  colors: string[];
  borderColors?: string[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
  tension?: number;
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  animation?: {
    duration?: number;
    easing?: string;
  };
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
      labels?: {
        color?: string;
        font?: {
          size?: number;
          family?: string;
        };
      };
    };
    tooltip?: {
      backgroundColor?: string;
      titleColor?: string;
      bodyColor?: string;
      borderColor?: string;
      borderWidth?: number;
      cornerRadius?: number;
    };
  };
  scales?: {
    x?: {
      ticks?: { color?: string };
      grid?: { color?: string };
    };
    y?: {
      ticks?: { color?: string };
      grid?: { color?: string };
    };
  };
}

// Demo scenario interface
export interface DemoScenario {
  name: string;
  description: string;
  timeData: TimeData;
  goals: {
    productiveHours: number;
    entertainmentHours: number;
    socialMediaHours: number;
    streak: number;
  };
  focusScore: number;
}

// Settings and configuration
export interface Settings {
  categories: Record<string, {
    description: string;
    examples: string[];
    color: string;
  }>;
  blockedSites: Array<{
    url: string;
    expiresAt: number;
    reason?: string;
  }>;
  focusBlockList: string[];
  notifications: {
    enabled: boolean;
    frequency: 'low' | 'medium' | 'high';
    types: string[];
  };
  theme: 'dark' | 'light' | 'auto';
  language: string;
}

// Focus mode interfaces
export interface FocusSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration: number;
  blockedSites: string[];
  interruptions: number;
  completed: boolean;
}

export interface FocusStats {
  totalSessions: number;
  totalTime: number;
  averageSession: number;
  longestSession: number;
  successRate: number;
  weeklyTrend: number[];
}

// Animation and UI types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  direction?: 'normal' | 'reverse' | 'alternate';
}

export interface NotificationConfig {
  message: string;
  type: NotificationType;
  duration?: number;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  text: string;
  textSecondary: string;
  background: string;
  backgroundSecondary: string;
  card: string;
  border: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  fonts: {
    primary: string;
    secondary: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Event types
export interface AppEvent {
  type: string;
  timestamp: number;
  data?: any;
  source?: ViewType;
}

export interface UserInteraction extends AppEvent {
  element: string;
  action: 'click' | 'hover' | 'focus' | 'scroll';
  coordinates?: { x: number; y: number };
}

// API and storage types
export interface StorageData {
  timeData: TimeData;
  settings: Settings;
  goals: GoalData[];
  focusSessions: FocusSession[];
  lastSync: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Component prop types
export interface BaseComponentProps {
  className?: string;
  id?: string;
  style?: Partial<CSSStyleDeclaration>;
  'data-testid'?: string;
}

export interface ChartComponentProps extends BaseComponentProps {
  data: ChartData;
  type: ChartType;
  options?: ChartOptions;
  height?: number;
  width?: number;
  onDataUpdate?: (newData: ChartData) => void;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  persistent?: boolean;
}

// Error types
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: 'low' | 'medium' | 'high' = 'medium'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export interface ErrorInfo {
  message: string;
  code: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
  stack?: string;
  context?: Record<string, any>;
}