/**
 * Utility functions for time parsing and formatting
 */

export class TimeUtils {
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
      }
    }
    
    return minutes;
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
}