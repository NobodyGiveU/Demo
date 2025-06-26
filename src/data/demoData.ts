import type { 
  DemoScenario, 
  BrowserData, 
  MobileData, 
  LaptopData, 
  OverallData,
  ShareData,
  ChartData,
  Settings,
  TimePeriod
} from '@/types';

/**
 * Enhanced demo data manager with comprehensive TypeScript support
 */
export class DemoDataManager {
  private static readonly DEMO_SCENARIOS: Record<string, DemoScenario> = {
    productive: {
      name: "📚 Productive Day",
      description: "A day focused on learning, coding, and personal growth",
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
          },
          apps: {
            "Visual Studio Code": 7200000,
            "Chrome": 5400000,
            "Notion": 3600000,
            "Terminal": 1800000
          }
        }
      },
      goals: {
        productiveHours: 4,
        entertainmentHours: 2,
        socialMediaHours: 1,
        streak: 5
      },
      focusScore: 92
    },
    
    social: {
      name: "📱 Social Media Day",
      description: "A day with heavy social media and entertainment usage",
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
          },
          apps: {
            "Instagram": 5400000,
            "Facebook": 7200000,
            "TikTok": 5400000,
            "YouTube": 3600000
          }
        }
      },
      goals: {
        productiveHours: 2,
        entertainmentHours: 3,
        socialMediaHours: 4,
        streak: 1
      },
      focusScore: 45
    },
    
    gaming: {
      name: "🎮 Gaming Day",
      description: "A day focused on gaming and entertainment",
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
          },
          apps: {
            "Steam": 5400000,
            "Discord": 1800000,
            "Twitch": 7200000,
            "Epic Games": 1800000
          }
        }
      },
      goals: {
        productiveHours: 1,
        entertainmentHours: 4,
        socialMediaHours: 1,
        streak: 2
      },
      focusScore: 38
    },

    work: {
      name: "💼 Work Day",
      description: "A professional workday with productivity tools",
      timeData: {
        "2025-01-15": {
          sites: {
            "slack.com": 7200000, // 2 hours
            "docs.google.com": 5400000, // 1.5 hours
            "trello.com": 3600000, // 1 hour
            "github.com": 3600000, // 1 hour
            "linkedin.com": 1800000, // 30 minutes
            "stackoverflow.com": 1800000, // 30 minutes
            "notion.so": 2700000, // 45 minutes
            "zoom.us": 1800000, // 30 minutes
            "gmail.com": 900000, // 15 minutes
            "calendar.google.com": 900000 // 15 minutes
          },
          categories: {
            "Productive / Educational": 27000000, // 7.5 hours
            "Social Media": 1800000, // 30 minutes
            "Entertainment": 900000, // 15 minutes
            "Other / Uncategorized": 900000 // 15 minutes
          },
          apps: {
            "Slack": 7200000,
            "VS Code": 5400000,
            "Chrome": 3600000,
            "Zoom": 1800000
          }
        }
      },
      goals: {
        productiveHours: 6,
        entertainmentHours: 1,
        socialMediaHours: 1,
        streak: 7
      },
      focusScore: 88
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
      { name: "YouTube", time: "1h 23m", category: "Entertainment", favicon: "📺", domain: "youtube.com" },
      { name: "GitHub", time: "1h 12m", category: "Work & Productivity", favicon: "💻", domain: "github.com" },
      { name: "Twitter", time: "58m", category: "Social Media", favicon: "🐦", domain: "twitter.com" },
      { name: "Stack Overflow", time: "33m", category: "Work & Productivity", favicon: "📚", domain: "stackoverflow.com" },
      { name: "Reddit", time: "28m", category: "Entertainment", favicon: "🔗", domain: "reddit.com" },
      { name: "LinkedIn", time: "19m", category: "Social Media", favicon: "💼", domain: "linkedin.com" }
    ],
    weeklyData: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      productive: [3.2, 4.1, 3.8, 4.5, 3.9, 1.2, 2.1],
      entertainment: [1.8, 1.5, 2.2, 1.9, 2.1, 3.5, 4.2],
      social: [1.1, 0.8, 1.5, 1.2, 1.3, 2.8, 3.1],
      screenTime: [6.1, 6.4, 7.5, 7.6, 6.3, 7.5, 9.4],
      pickups: [45, 52, 48, 61, 55, 73, 68]
    },
    focusScore: 75
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
      { name: "Instagram", time: "1h 23m", category: "Social Media", icon: "📷", percentage: 32, domain: "instagram.com" },
      { name: "WhatsApp", time: "45m", category: "Messaging", icon: "💬", percentage: 17, domain: "whatsapp.com" },
      { name: "Spotify", time: "38m", category: "Music", icon: "🎵", percentage: 15, domain: "spotify.com" },
      { name: "YouTube", time: "32m", category: "Entertainment", icon: "📺", percentage: 12, domain: "youtube.com" },
      { name: "Subway Surfers", time: "28m", category: "Games", icon: "🎮", percentage: 11 },
      { name: "Gmail", time: "17m", category: "Productivity", icon: "📧", percentage: 6, domain: "gmail.com" },
      { name: "TikTok", time: "12m", category: "Social Media", icon: "🎬", percentage: 5, domain: "tiktok.com" },
      { name: "Maps", time: "8m", category: "Navigation", icon: "🗺️", percentage: 2 }
    ],
    weeklyStats: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      screenTime: [3.2, 4.1, 3.8, 4.5, 3.9, 6.2, 5.8],
      pickups: [35, 42, 38, 45, 41, 58, 52],
      notifications: [18, 25, 22, 31, 28, 45, 38]
    },
    topSites: [
      { name: "YouTube", time: "58m", category: "Entertainment", favicon: "📺", domain: "youtube.com" },
      { name: "Wikipedia", time: "35m", category: "Information", favicon: "📚", domain: "wikipedia.org" },
      { name: "Reddit", time: "27m", category: "Social", favicon: "🔗", domain: "reddit.com" },
      { name: "Instagram", time: "25m", category: "Social", favicon: "📸", domain: "instagram.com" },
      { name: "X", time: "21m", category: "Social", favicon: "🐦", domain: "x.com" }
    ],
    batteryLevel: 78,
    dataUsage: "1.2GB"
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
      { name: "Visual Studio Code", time: "2h 15m", category: "Development", icon: "💻", percentage: 33, domain: "code.visualstudio.com" },
      { name: "Google Chrome", time: "1h 45m", category: "Web Browser", icon: "🌐", percentage: 26, domain: "google.com" },
      { name: "Microsoft Outlook", time: "45m", category: "Email", icon: "📧", percentage: 11, domain: "outlook.com" },
      { name: "Microsoft Excel", time: "38m", category: "Productivity", icon: "📊", percentage: 9, domain: "microsoft.com" },
      { name: "Spotify", time: "32m", category: "Music", icon: "🎵", percentage: 8, domain: "spotify.com" },
      { name: "Slack", time: "25m", category: "Communication", icon: "💬", percentage: 6, domain: "slack.com" },
      { name: "Figma", time: "18m", category: "Design", icon: "🎨", percentage: 4, domain: "figma.com" },
      { name: "Terminal", time: "12m", category: "Development", icon: "⚡", percentage: 3 }
    ],
    weeklyProductivity: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      productive: [5.2, 6.1, 5.8, 6.5, 5.9, 2.2, 3.1],
      idle: [1.8, 1.5, 2.2, 1.9, 2.1, 3.5, 2.8],
      screenTime: [7.0, 7.6, 8.0, 8.4, 8.0, 5.7, 5.9],
      pickups: [0, 0, 0, 0, 0, 0, 0] // Not applicable for laptop
    },
    cpuUsage: 45,
    memoryUsage: 68
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
      { name: "YouTube", time: "58m", category: "Entertainment", favicon: "📺", domain: "youtube.com" },
      { name: "Wikipedia", time: "35m", category: "Information", favicon: "📚", domain: "wikipedia.org" },
      { name: "Reddit", time: "27m", category: "Social", favicon: "🔗", domain: "reddit.com" },
      { name: "Instagram", time: "25m", category: "Social", favicon: "📸", domain: "instagram.com" },
      { name: "X", time: "21m", category: "Social", favicon: "🐦", domain: "x.com" }
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

  private static readonly SHARE_DATA: ShareData = {
    totalScreenTime: "8h 23m",
    productiveTime: "5h 12m",
    focusScore: 87,
    goalsMet: "4/7",
    weeklyHighlights: [
      "Met productivity goals 5 out of 7 days",
      "Reduced social media usage by 15%",
      "Increased focused work time by 20%",
      "Maintained good digital wellness balance"
    ],
    recentShares: [
      { title: "Yesterday's Progress", platform: "Twitter", time: "2 hours ago" },
      { title: "Weekly Summary", platform: "WhatsApp", time: "1 day ago" },
      { title: "Focus Mode Achievement", platform: "Instagram", time: "3 days ago" }
    ]
  };

  private static readonly DEFAULT_SETTINGS: Settings = {
    categories: {
      'Productive / Educational': {
        description: 'Websites that promote learning, work, coding, and personal growth',
        examples: ['wikipedia.org', 'khanacademy.org', 'coursera.org', 'udemy.com', 'edx.org', 'leetcode.com', 'notion.so', 'trello.com', 'slack.com', 'linkedin.com', 'docs.google.com', 'chat.openai.com'],
        color: '#4CAF50'
      },
      'Entertainment': {
        description: 'Time-pass, media consumption, and fun-focused websites',
        examples: ['youtube.com', 'netflix.com', 'spotify.com', 'twitch.tv', 'hotstar.com', 'primevideo.com', 'disneyplus.com', '9gag.com'],
        color: '#FF9800'
      },
      'News': {
        description: 'Websites focused on current events, politics, and general news',
        examples: ['cnn.com', 'bbc.com', 'nytimes.com', 'reuters.com', 'foxnews.com', 'aljazeera.com'],
        color: '#2196F3'
      },
      'Social Media': {
        description: 'Websites focused on social interaction and communication',
        examples: ['facebook.com', 'instagram.com', 'twitter.com', 'tiktok.com', 'snapchat.com', 'linkedin.com', 'reddit.com', 'pinterest.com'],
        color: '#E4405F'
      },
      'Games': {
        description: 'Online gaming platforms or game-related content',
        examples: ['roblox.com', 'epicgames.com', 'steampowered.com', 'miniclip.com', 'ign.com', 'chess.com'],
        color: '#9C27B0'
      },
      'Shopping': {
        description: 'E-commerce and online retail platforms',
        examples: ['amazon.com', 'ebay.com', 'aliexpress.com', 'walmart.com', 'flipkart.com', 'etsy.com'],
        color: '#FF5722'
      },
      'Other / Uncategorized': {
        description: 'Anything that doesn\'t clearly fit the above or is new/unknown',
        examples: ['medium.com', 'quora.com', 'openai.com', 'duckduckgo.com'],
        color: '#9E9E9E'
      }
    },
    blockedSites: [
      { url: 'facebook.com', expiresAt: Date.now() + 86400000, reason: 'Focus time' },
      { url: 'instagram.com', expiresAt: Date.now() + 86400000, reason: 'Productivity' },
      { url: 'tiktok.com', expiresAt: Date.now() + 86400000, reason: 'Time management' }
    ],
    focusBlockList: ['facebook.com', 'instagram.com', 'twitter.com', 'tiktok.com', 'youtube.com'],
    notifications: {
      enabled: true,
      frequency: 'medium',
      types: ['goals', 'focus', 'breaks', 'weekly']
    },
    theme: 'dark',
    language: 'en'
  };

  /**
   * Get browser data with optional time period
   */
  static getBrowserData(period: TimePeriod = 'today'): BrowserData {
    const data = { ...this.BROWSER_DATA };
    
    if (period === 'week') {
      // Multiply daily values for weekly view
      data.totalTime = data.weekTime;
      Object.keys(data.categories).forEach(key => {
        data.categories[key].time = this.multiplyTimeString(data.categories[key].time, 7);
      });
      data.topSites = data.topSites.map(site => ({
        ...site,
        time: this.multiplyTimeString(site.time, 7)
      }));
    }
    
    return data;
  }

  /**
   * Get mobile data with optional time period
   */
  static getMobileData(period: TimePeriod = 'today'): MobileData {
    const data = { ...this.MOBILE_DATA };
    
    if (period === 'week') {
      data.totalTime = data.weekTime;
      data.pickups = data.pickups * 7;
      data.notifications = data.notifications * 7;
      data.apps = data.apps.map(app => ({
        ...app,
        time: this.multiplyTimeString(app.time, 7)
      }));
      data.topSites = data.topSites.map(site => ({
        ...site,
        time: this.multiplyTimeString(site.time, 7)
      }));
    }
    
    return data;
  }

  /**
   * Get laptop data with optional time period
   */
  static getLaptopData(period: TimePeriod = 'today'): LaptopData {
    const data = { ...this.LAPTOP_DATA };
    
    if (period === 'week') {
      data.totalTime = data.weekTime;
      data.activeTime = this.multiplyTimeString(data.activeTime, 7);
      data.idleTime = this.multiplyTimeString(data.idleTime, 7);
      data.dataUsed = this.multiplyDataString(data.dataUsed, 7);
      data.applications = data.applications.map(app => ({
        ...app,
        time: this.multiplyTimeString(app.time, 7)
      }));
    }
    
    return data;
  }

  /**
   * Get overall data with optional time period
   */
  static getOverallData(period: TimePeriod = 'today'): OverallData {
    const data = { ...this.OVERALL_DATA };
    
    if (period === 'week') {
      data.totalTime = data.weekTime;
      data.devices = {
        laptop: this.multiplyTimeString(data.devices.laptop, 7),
        mobile: this.multiplyTimeString(data.devices.mobile, 7),
        browser: this.multiplyTimeString(data.devices.browser, 7)
      };
      data.topSites = data.topSites.map(site => ({
        ...site,
        time: this.multiplyTimeString(site.time, 7)
      }));
      data.topApps = data.topApps.map(app => ({
        ...app,
        time: this.multiplyTimeString(app.time, 7)
      }));
    }
    
    return data;
  }

  /**
   * Get share data
   */
  static getShareData(): ShareData {
    return { ...this.SHARE_DATA };
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
    return this.DEMO_SCENARIOS[name] ? { ...this.DEMO_SCENARIOS[name] } : null;
  }

  /**
   * Get default settings
   */
  static getSettings(): Settings {
    return { ...this.DEFAULT_SETTINGS };
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

  /**
   * Multiply data string by a factor
   */
  private static multiplyDataString(dataStr: string, multiplier: number): string {
    const match = dataStr.match(/(\d+\.?\d*)(GB|MB)/);
    if (!match) return dataStr;

    const value = parseFloat(match[1]) * multiplier;
    const unit = match[2];
    
    if (unit === 'MB' && value >= 1000) {
      return `${(value / 1000).toFixed(1)}GB`;
    }
    
    return `${value.toFixed(1)}${unit}`;
  }

  /**
   * Add random variation to data for more realistic demo
   */
  static addRandomVariation(baseValue: number, variation: number = 0.1): number {
    const randomFactor = 1 + (Math.random() - 0.5) * variation;
    return Math.round(baseValue * randomFactor);
  }

  /**
   * Get current date string
   */
  static getCurrentDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Get week date range
   */
  static getWeekDateRange(): { start: string; end: string } {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      start: weekAgo.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    };
  }
}