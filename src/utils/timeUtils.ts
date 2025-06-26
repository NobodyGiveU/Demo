/**
 * Comprehensive time utility functions with TypeScript support
 */
export class TimeUtils {
  private static readonly TIME_UNITS = {
    MILLISECOND: 1,
    SECOND: 1000,
    MINUTE: 60 * 1000,
    HOUR: 60 * 60 * 1000,
    DAY: 24 * 60 * 60 * 1000,
    WEEK: 7 * 24 * 60 * 60 * 1000
  };

  /**
   * Parse time string like "2h 30m" to minutes
   */
  static parseTimeToMinutes(timeStr: string): number {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    
    const parts = timeStr.trim().split(' ');
    let minutes = 0;
    
    for (const part of parts) {
      if (part.endsWith('h')) {
        minutes += parseInt(part.replace('h', '')) * 60;
      } else if (part.endsWith('m')) {
        minutes += parseInt(part.replace('m', ''));
      } else if (part.endsWith('s')) {
        minutes += Math.round(parseInt(part.replace('s', '')) / 60);
      }
    }
    
    return minutes;
  }

  /**
   * Parse time string to milliseconds
   */
  static parseTimeToMilliseconds(timeStr: string): number {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    
    const parts = timeStr.trim().split(' ');
    let milliseconds = 0;
    
    for (const part of parts) {
      if (part.endsWith('h')) {
        milliseconds += parseInt(part.replace('h', '')) * this.TIME_UNITS.HOUR;
      } else if (part.endsWith('m')) {
        milliseconds += parseInt(part.replace('m', '')) * this.TIME_UNITS.MINUTE;
      } else if (part.endsWith('s')) {
        milliseconds += parseInt(part.replace('s', '')) * this.TIME_UNITS.SECOND;
      }
    }
    
    return milliseconds;
  }

  /**
   * Format minutes to "Xh Ym" format
   */
  static formatMinutes(minutes: number): string {
    if (minutes < 0) return '0m';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  }

  /**
   * Format milliseconds to human readable format
   */
  static formatMilliseconds(ms: number, includeSeconds: boolean = false): string {
    if (ms < 0) return '0m';
    
    const hours = Math.floor(ms / this.TIME_UNITS.HOUR);
    const minutes = Math.floor((ms % this.TIME_UNITS.HOUR) / this.TIME_UNITS.MINUTE);
    const seconds = Math.floor((ms % this.TIME_UNITS.MINUTE) / this.TIME_UNITS.SECOND);
    
    const parts: string[] = [];
    
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (includeSeconds && seconds > 0) parts.push(`${seconds}s`);
    
    return parts.length > 0 ? parts.join(' ') : '0m';
  }

  /**
   * Format time for speech synthesis
   */
  static formatTimeForSpeech(timeStr: string): string {
    if (!timeStr || timeStr.trim() === '') return '0 minutes';
    
    const minutes = this.parseTimeToMinutes(timeStr);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0 && mins === 0) {
      return '0 minutes';
    } else if (hours === 0) {
      return mins === 1 ? '1 minute' : `${mins} minutes`;
    } else if (mins === 0) {
      return hours === 1 ? '1 hour' : `${hours} hours`;
    } else {
      const hourText = hours === 1 ? '1 hour' : `${hours} hours`;
      const minuteText = mins === 1 ? '1 minute' : `${mins} minutes`;
      return `${hourText} ${minuteText}`;
    }
  }

  /**
   * Add random variation to time values for demo purposes
   */
  static addRandomVariation(baseMinutes: number, variationPercent: number = 0.1): number {
    const variation = baseMinutes * variationPercent;
    const randomFactor = (Math.random() - 0.5) * 2; // -1 to 1
    return Math.max(0, Math.round(baseMinutes + (variation * randomFactor)));
  }

  /**
   * Get current week number
   */
  static getCurrentWeek(): number {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

  /**
   * Get date range for current week
   */
  static getCurrentWeekRange(): { start: string; end: string } {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      start: weekAgo.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    };
  }

  /**
   * Calculate percentage of goal completion
   */
  static calculateGoalProgress(actual: string, goal: string): number {
    const actualMinutes = this.parseTimeToMinutes(actual);
    const goalMinutes = this.parseTimeToMinutes(goal);
    
    if (goalMinutes === 0) return 0;
    return Math.min(100, Math.round((actualMinutes / goalMinutes) * 100));
  }

  /**
   * Get time ago string
   */
  static getTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < this.TIME_UNITS.MINUTE) {
      return 'just now';
    } else if (diff < this.TIME_UNITS.HOUR) {
      const minutes = Math.floor(diff / this.TIME_UNITS.MINUTE);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < this.TIME_UNITS.DAY) {
      const hours = Math.floor(diff / this.TIME_UNITS.HOUR);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diff < this.TIME_UNITS.WEEK) {
      const days = Math.floor(diff / this.TIME_UNITS.DAY);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      const weeks = Math.floor(diff / this.TIME_UNITS.WEEK);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }
  }

  /**
   * Format duration between two timestamps
   */
  static formatDuration(startTime: number, endTime: number): string {
    const duration = endTime - startTime;
    return this.formatMilliseconds(duration);
  }

  /**
   * Check if time is within business hours
   */
  static isBusinessHours(timestamp: number = Date.now()): boolean {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const day = date.getDay();
    
    // Monday to Friday, 9 AM to 5 PM
    return day >= 1 && day <= 5 && hour >= 9 && hour < 17;
  }

  /**
   * Get start of day timestamp
   */
  static getStartOfDay(timestamp: number = Date.now()): number {
    const date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }

  /**
   * Get end of day timestamp
   */
  static getEndOfDay(timestamp: number = Date.now()): number {
    const date = new Date(timestamp);
    date.setHours(23, 59, 59, 999);
    return date.getTime();
  }

  /**
   * Get start of week timestamp
   */
  static getStartOfWeek(timestamp: number = Date.now()): number {
    const date = new Date(timestamp);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }

  /**
   * Get end of week timestamp
   */
  static getEndOfWeek(timestamp: number = Date.now()): number {
    const startOfWeek = this.getStartOfWeek(timestamp);
    return startOfWeek + (7 * this.TIME_UNITS.DAY) - 1;
  }

  /**
   * Multiply time string by a factor
   */
  static multiplyTimeString(timeStr: string, multiplier: number): string {
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
  static multiplyDataString(dataStr: string, multiplier: number): string {
    const match = dataStr.match(/(\d+\.?\d*)(GB|MB|KB)/);
    if (!match) return dataStr;

    const value = parseFloat(match[1]) * multiplier;
    const unit = match[2];
    
    if (unit === 'MB' && value >= 1000) {
      return `${(value / 1000).toFixed(1)}GB`;
    } else if (unit === 'KB' && value >= 1000) {
      return `${(value / 1000).toFixed(1)}MB`;
    }
    
    return `${value.toFixed(1)}${unit}`;
  }

  /**
   * Parse relative time strings like "2 hours ago"
   */
  static parseRelativeTime(relativeStr: string): number {
    const now = Date.now();
    const match = relativeStr.match(/(\d+)\s+(second|minute|hour|day|week)s?\s+ago/i);
    
    if (!match) return now;
    
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    
    switch (unit) {
      case 'second':
        return now - (value * this.TIME_UNITS.SECOND);
      case 'minute':
        return now - (value * this.TIME_UNITS.MINUTE);
      case 'hour':
        return now - (value * this.TIME_UNITS.HOUR);
      case 'day':
        return now - (value * this.TIME_UNITS.DAY);
      case 'week':
        return now - (value * this.TIME_UNITS.WEEK);
      default:
        return now;
    }
  }

  /**
   * Format timestamp to readable date
   */
  static formatDate(timestamp: number, format: 'short' | 'long' | 'iso' = 'short'): string {
    const date = new Date(timestamp);
    
    switch (format) {
      case 'short':
        return date.toLocaleDateString();
      case 'long':
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      case 'iso':
        return date.toISOString().split('T')[0];
      default:
        return date.toLocaleDateString();
    }
  }

  /**
   * Format timestamp to readable time
   */
  static formatTime(timestamp: number, format: '12h' | '24h' = '12h'): string {
    const date = new Date(timestamp);
    
    if (format === '24h') {
      return date.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: 'numeric', 
        minute: '2-digit' 
      });
    }
  }

  /**
   * Check if two timestamps are on the same day
   */
  static isSameDay(timestamp1: number, timestamp2: number): boolean {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  /**
   * Get days between two timestamps
   */
  static getDaysBetween(startTimestamp: number, endTimestamp: number): number {
    const diffTime = Math.abs(endTimestamp - startTimestamp);
    return Math.ceil(diffTime / this.TIME_UNITS.DAY);
  }

  /**
   * Get working days between two timestamps
   */
  static getWorkingDaysBetween(startTimestamp: number, endTimestamp: number): number {
    let workingDays = 0;
    const current = new Date(startTimestamp);
    const end = new Date(endTimestamp);
    
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
        workingDays++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return workingDays;
  }

  /**
   * Sleep for specified milliseconds
   */
  static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Debounce function calls
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T, 
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * Throttle function calls
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T, 
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}