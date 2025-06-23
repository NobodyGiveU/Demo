import type { 
  DemoScenario, 
  BrowserData, 
  MobileData, 
  LaptopData, 
  OverallData,
  ChartData,
  Settings
} from '../types';

/**
 * Enhanced demo data with TypeScript types and additional scenarios
 */
export class DemoDataManager {
  private static readonly DEMO_SCENARIOS: Record<string, DemoScenario> = {
    productive: {
      name: "📚 Productive Day",
      timeData: {
        "2025-01-15": {
          sites: {
            "github.com": 7200000, // 2 hours
            "stackoverflow.com": 3600000, // 1 hour
            "docs.google.com": 5400000, // 1.5 hours
            "notion.so": 3600000, // 1 hour
            "leetcode.com": 1800000, // 30 minutes
            "chat.openai.com": 1800000, // 30 minutes
            "wikipedia.org": 900000, // 15 minutes
            "medium.com": 900000 // 15 minutes
          },
          categories: {
            "Productive / Educational": 23400000, // 6.5 hours
            "News": 900000, // 15 minutes
            "Other / Uncategorized": 900000 // 15 minutes
          }
        }
      },
      goals: {
        productiveHours: 4,
        entertainmentHours: 2,
        socialMediaHours: 1,
        streak: 5
      }
    },
    
    social: {
      name: "📱 Social Media Day",
      timeData: {
        "2025-01-15": {
          sites: {
            "facebook.com": 7200000, // 2 hours
            "instagram.com": 5400000, // 1.5 hours
            "twitter.com": 3600000, // 1 hour
            "tiktok.com": 5400000, // 1.5 hours
            "reddit.com": 1800000, // 30 minutes
            "youtube.com": 3600000, // 1 hour
            "netflix.com": 1800000, // 30 minutes
            "spotify.com": 900000 // 15 minutes
          },
          categories: {
            "Social Media": 19800000, // 5.5 hours
            "Entertainment": 6300000, // 1.75 hours
            "Other / Uncategorized": 900000 // 15 minutes
          }
        }
      },
      goals: {
        productiveHours: 2,
        entertainmentHours: 3,
        socialMediaHours: 4,
        streak: 1
      }
    },
    
    gaming: {
      name: "🎮 Gaming Day",
      timeData: {
        "2025-01-15": {
          sites: {
            "twitch.tv": 7200000, // 2 hours
            "steampowered.com": 5400000, // 1.5 hours
            "roblox.com": 3600000, // 1 hour
            "epicgames.com": 1800000, // 30 minutes
            "chess.com": 1800000, // 30 minutes
            "youtube.com": 3600000, // 1 hour (gaming content)
            "reddit.com": 1800000, // 30 minutes (gaming subreddits)
            "discord.com": 1800000, // 30 minutes
            "github.com": 900000, // 15 minutes
            "stackoverflow.com": 900000 // 15 minutes
          },
          categories: {
            "Games": 19800000, // 5.5 hours
            "Entertainment": 5400000, // 1.5 hours
            "Social Media": 1800000, // 30 minutes
            "Productive / Educational": 1800000 // 30 minutes
          }
        }
      },
      goals: {
        productiveHours: 1,
        entertainmentHours: 4,
        socialMediaHours: 1,
        streak: 2
      }
    }
  };

  private static readonly BROWSER_DATA: BrowserData = {
    totalTime: "3h 38m",
    todayTime: "3h 38m",
    weekTime: "25h 26m",
    categories: {
      "Entertainment": { time: "1h 23m 29s", percentage: 38, color: "#FF6B6B" },
      "Games": { time: "0h 58m 4s", percentage: 26, color: "#9C27B0" },
      "Social Media": { time: "0h 39m 17s", percentage: 18, color: "#E4405F" },
      "Other / Uncategorized": { time: "0h 37m 56s", percentage: 18, color: "#9E9E9E" }
    },
    topSites: [
      { name: "YouTube", time: "1h 23m", category: "Entertainment", favicon: "📺" },
      { name: "GitHub", time: "1h 12m", category: "Work & Productivity", favicon: "💻" },
      { name: "Twitter", time: "58m", category: "Social Media", favicon: "🐦" },
      { name: "Stack Overflow", time: "33m", category: "Work & Productivity", favicon: "📚" },
      { name: "Reddit", time: "28m", category: "Entertainment", favicon: "🔗" },
      { name: "LinkedIn", time: "19m", category: "Social Media", favicon: "💼" }
    ],
    weeklyData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      productive: [3.2, 4.1, 3.8, 4.5, 3.9, 1.2, 2.1],
      entertainment: [1.8, 1.5, 2.2, 1.9, 2.1, 3.5, 4.2],
      social: [1.1, 0.8, 1.5, 1.2, 1.3, 2.8, 3.1],
      screenTime: [6.1, 6.4, 7.5, 7.6, 6.3, 7.5, 9.4],
      pickups: [45, 52, 48, 61, 55, 73, 68]
    }
  };

  private static readonly MOBILE_DATA: MobileData = {
    totalTime: "4h 23m",
    todayTime: "4h 23m",
    weekTime: "28h 45m",
    pickups: 47,
    avgSession: "5m 36s",
    notifications: 23,
    mostUsed: "Instagram",
    apps: [
      { name: "Instagram", time: "1h 23m", category: "Social Media", icon: "📷", percentage: 32 },
      { name: "WhatsApp", time: "45m", category: "Messaging", icon: "💬", percentage: 17 },
      { name: "Spotify", time: "38m", category: "Music", icon: "🎵", percentage: 15 },
      { name: "YouTube", time: "32m", category: "Entertainment", icon: "📺", percentage: 12 },
      { name: "Subway Surfers", time: "28m", category: "Games", icon: "🎮", percentage: 11 },
      { name: "Gmail", time: "17m", category: "Productivity", icon: "📧", percentage: 6 },
      { name: "TikTok", time: "12m", category: "Social Media", icon: "🎬", percentage: 5 },
      { name: "Maps", time: "8m", category: "Navigation", icon: "🗺️", percentage: 2 }
    ],
    weeklyStats: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      screenTime: [3.2, 4.1, 3.8, 4.5, 3.9, 6.2, 5.8],
      pickups: [35, 42, 38, 45, 41, 58, 52]
    },
    topSites: [
      { name: "YouTube", time: "58m", category: "Entertainment", favicon: "📺" },
      { name: "Wikipedia", time: "35m", category: "Information", favicon: "📚" },
      { name: "Reddit", time: "27m", category: "Social", favicon: "🔗" },
      { name: "Instagram", time: "25m", category: "Social", favicon: "📸" },
      { name: "X", time: "21m", category: "Social", favicon: "🐦" }
    ]
  };

  private static readonly LAPTOP_DATA: LaptopData = {
    totalTime: "6h 45m",
    todayTime: "6h 45m",
    weekTime: "45h 20m",
    activeTime: "5h 12m",
    idleTime: "1h 33m",
    batteryRemaining: "3h 45m",
    dataUsed: "2.4GB",
    applications: [
      { name: "Visual Studio Code", time: "2h 15m", category: "Development", icon: "💻", percentage: 33 },
      { name: "Google Chrome", time: "1h 45m", category: "Web Browser", icon: "🌐", percentage: 26 },
      { name: "Microsoft Outlook", time: "45m", category: "Email", icon: "📧", percentage: 11 },
      { name: "Microsoft Excel", time: "38m", category: "Productivity", icon: "📊", percentage: 9 },
      { name: "Spotify", time: "32m", category: "Music", icon: "🎵", percentage: 8 },
      { name: "Slack", time: "25m", category: "Communication", icon: "💬", percentage: 6 },
      { name: "Figma", time: "18m", category: "Design", icon: "🎨", percentage: 4 },
      { name: "Terminal", time: "12m", category: "Development", icon: "⚡", percentage: 3 }
    ],
    weeklyProductivity: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      productive: [5.2, 6.1, 5.8, 6.5, 5.9, 2.2, 3.1],
      idle: [1.8, 1.5, 2.2, 1.9, 2.1, 3.5, 2.8],
      screenTime: [7.0, 7.6, 8.0, 8.4, 8.0, 5.7, 5.9],
      pickups: [0, 0, 0, 0, 0, 0, 0] // Not applicable for laptop
    }
  };

  private static readonly OVERALL_DATA: OverallData = {
    totalTime: "12h 34m",
    todayTime: "12h 34m",
    weekTime: "87h 45m",
    devices: {
      laptop: "6h 45m",
      mobile: "4h 23m",
      browser: "1h 26m"
    },
    focusScore: 87,
    weeklyBreakdown: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      laptop: [5.2, 6.1, 5.8, 6.5, 5.9, 2.2, 3.1],
      mobile: [3.2, 4.1, 3.8, 4.5, 3.9, 6.2, 5.8],
      browser: [1.1, 1.3, 1.2, 1.4, 1.1, 2.1, 1.8],
      screenTime: [9.5, 11.5, 10.8, 12.4, 10.9, 10.5, 10.7],
      pickups: [45, 52, 48, 61, 55, 73, 68]
    },
    topSites: [
      { name: "YouTube", time: "58m", category: "Entertainment", favicon: "📺" },
      { name: "Wikipedia", time: "35m", category: "Information", favicon: "📚" },
      { name: "Reddit", time: "27m", category: "Social", favicon: "🔗" },
      { name: "Instagram", time: "25m", category: "Social", favicon: "📸" },
      { name: "X", time: "21m", category: "Social", favicon: "🐦" }
    ],
    topApps: [
      { name: "Instagram", time: "25m", category: "Social Media", icon: "📸" },
      { name: "WhatsApp", time: "45m", category: "Messaging", icon: "💬" },
      { name: "Spotify", time: "38m", category: "Music", icon: "🎵" },
      { name: "YouTube", time: "32m", category: "Entertainment", icon: "📺" },
      { name: "Subway Surfers", time: "28m", category: "Games", icon: "🎮" },
      { name: "Gmail", time: "17m", category: "Productivity", icon: "📧" },
      { name: "TikTok", time: "12m", category: "Social Media", icon: "🎬" },
      { name: "Maps", time: "8m", category: "Navigation", icon: "🗺️" }
    ]
  };

  /**
   * Get browser data with optional time period
   */
  static getBrowserData(period: 'today' | 'week' = 'today'): BrowserData {
    return { ...this.BROWSER_DATA };
  }

  /**
   * Get mobile data with optional time period
   */
  static getMobileData(period: 'today' | 'week' = 'today'): MobileData {
    return { ...this.MOBILE_DATA };
  }

  /**
   * Get laptop data with optional time period
   */
  static getLaptopData(period: 'today' | 'week' = 'today'): LaptopData {
    return { ...this.LAPTOP_DATA };
  }

  /**
   * Get overall data with optional time period
   */
  static getOverallData(period: 'today' | 'week' = 'today'): OverallData {
    return { ...this.OVERALL_DATA };
  }

  /**
   * Get chart data for categories
   */
  static getCategoryChartData(): ChartData {
    const categories = this.BROWSER_DATA.categories;
    return {
      labels: Object.keys(categories),
      data: Object.values(categories).map(cat => cat.percentage),
      colors: Object.values(categories).map(cat => cat.color)
    };
  }

  /**
   * Get chart data for mobile apps
   */
  static getMobileChartData(): ChartData {
    const apps = this.MOBILE_DATA.apps.slice(0, 6);
    return {
      labels: apps.map(app => app.name),
      data: apps.map(app => app.percentage || 0),
      colors: ['#E4405F', '#25D366', '#1DB954', '#FF0000', '#FF6B6B', '#EA4335']
    };
  }

  /**
   * Get chart data for laptop applications
   */
  static getLaptopChartData(): ChartData {
    const apps = this.LAPTOP_DATA.applications.slice(0, 6);
    return {
      labels: apps.map(app => app.name),
      data: apps.map(app => app.percentage || 0),
      colors: ['#007ACC', '#4285F4', '#0078D4', '#217346', '#1DB954', '#4A154B']
    };
  }

  /**
   * Get chart data for overall device usage
   */
  static getOverallChartData(): ChartData {
    const devices = this.OVERALL_DATA.devices;
    return {
      labels: ['Laptop', 'Mobile', 'Browser'],
      data: [54, 35, 11], // Percentages
      colors: ['#007ACC', '#E4405F', '#4285F4']
    };
  }

  /**
   * Get available demo scenarios
   */
  static getScenarios(): Record<string, DemoScenario> {
    return { ...this.DEMO_SCENARIOS };
  }

  /**
   * Get specific scenario data
   */
  static getScenario(name: string): DemoScenario | null {
    return this.DEMO_SCENARIOS[name] || null;
  }

  /**
   * Generate realistic weekly data based on daily data
   */
  static generateWeeklyData<T extends { time: string }>(dailyData: T[], multiplier: number = 7): T[] {
    return dailyData.map(item => ({
      ...item,
      time: this.multiplyTimeString(item.time, multiplier)
    }));
  }

  /**
   * Multiply time string by a factor
   */
  private static multiplyTimeString(timeStr: string, multiplier: number): string {
    const match = timeStr.match(/(\d+)h\s*(\d+)m/);
    if (!match) return timeStr;

    const hours = parseInt(match[1]) * multiplier;
    const minutes = parseInt(match[2]) * multiplier;
    const totalMinutes = hours * 60 + minutes;
    const finalHours = Math.floor(totalMinutes / 60);
    const finalMins = totalMinutes % 60;

    return `${finalHours}h ${finalMins}m`;
  }
}