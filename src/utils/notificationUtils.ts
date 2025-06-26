import type { NotificationConfig, NotificationType } from '@/types';

/**
 * Enhanced notification system with comprehensive TypeScript support
 */
export class NotificationUtils {
  private static container: HTMLElement | null = null;
  private static notifications: Set<HTMLElement> = new Set();
  private static maxNotifications: number = 5;
  private static defaultDuration: number = 4000;

  /**
   * Initialize notification container
   */
  private static initContainer(): void {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
      max-width: 400px;
    `;
    document.body.appendChild(this.container);
  }

  /**
   * Show notification with enhanced styling and animations
   */
  static show(config: NotificationConfig): HTMLElement {
    this.initContainer();
    
    const { message, type, duration = this.defaultDuration, persistent = false, actions = [] } = config;
    
    // Remove oldest notification if at max capacity
    if (this.notifications.size >= this.maxNotifications) {
      const oldestNotification = Array.from(this.notifications)[0];
      this.remove(oldestNotification);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = this.getNotificationColors(type);
    
    notification.style.cssText = `
      background: ${colors.bg};
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      border: 1px solid ${colors.border};
      max-width: 400px;
      font-weight: 500;
      font-size: 0.95rem;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      transform: translateX(100%);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      pointer-events: auto;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    `;
    
    // Create notification content
    const content = this.createNotificationContent(message, colors.icon, actions);
    notification.innerHTML = content;
    
    // Add close button
    const closeBtn = notification.querySelector('.notification-close') as HTMLElement;
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.remove(notification);
      });
    }
    
    // Add action button listeners
    actions.forEach((action, index) => {
      const actionBtn = notification.querySelector(`.notification-action-${index}`) as HTMLElement;
      if (actionBtn) {
        actionBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          action.action();
          this.remove(notification);
        });
      }
    });
    
    this.container!.appendChild(notification);
    this.notifications.add(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    });
    
    // Add progress bar for timed notifications
    if (!persistent && duration > 0) {
      this.addProgressBar(notification, duration);
    }
    
    // Auto remove
    if (!persistent && duration > 0) {
      setTimeout(() => {
        this.remove(notification);
      }, duration);
    }
    
    // Click to dismiss
    notification.addEventListener('click', () => {
      if (!persistent) {
        this.remove(notification);
      }
    });
    
    return notification;
  }

  /**
   * Create notification content HTML
   */
  private static createNotificationContent(
    message: string, 
    icon: string, 
    actions: Array<{ label: string; action: () => void }>
  ): string {
    const actionsHtml = actions.length > 0 ? `
      <div class="notification-actions" style="
        display: flex;
        gap: 8px;
        margin-top: 12px;
      ">
        ${actions.map((action, index) => `
          <button class="notification-action-${index}" style="
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: background 0.2s ease;
          " onmouseover="this.style.background='rgba(255, 255, 255, 0.3)'" 
             onmouseout="this.style.background='rgba(255, 255, 255, 0.2)'">
            ${action.label}
          </button>
        `).join('')}
      </div>
    ` : '';

    return `
      <span style="font-size: 1.2rem; flex-shrink: 0;">${icon}</span>
      <div style="flex: 1;">
        <div style="line-height: 1.4;">${message}</div>
        ${actionsHtml}
      </div>
      <button class="notification-close" style="
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.8);
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin-left: 8px;
        transition: color 0.2s ease;
        flex-shrink: 0;
      " onmouseover="this.style.color='white'" 
         onmouseout="this.style.color='rgba(255, 255, 255, 0.8)'">×</button>
    `;
  }

  /**
   * Add progress bar to notification
   */
  private static addProgressBar(notification: HTMLElement, duration: number): void {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
      width: 100%;
      transform-origin: left;
      animation: notificationProgress ${duration}ms linear;
    `;
    
    notification.appendChild(progressBar);
  }

  /**
   * Get notification colors based on type
   */
  private static getNotificationColors(type: NotificationType): {
    bg: string;
    border: string;
    icon: string;
  } {
    const colors = {
      success: { 
        bg: 'linear-gradient(135deg, #4caf50, #45a049)', 
        border: 'rgba(76, 175, 80, 0.3)',
        icon: '✅' 
      },
      warning: { 
        bg: 'linear-gradient(135deg, #ff9800, #f57c00)', 
        border: 'rgba(255, 152, 0, 0.3)',
        icon: '⚠️' 
      },
      error: { 
        bg: 'linear-gradient(135deg, #f44336, #d32f2f)', 
        border: 'rgba(244, 67, 54, 0.3)',
        icon: '❌' 
      },
      info: { 
        bg: 'linear-gradient(135deg, #2196f3, #1976d2)', 
        border: 'rgba(33, 150, 243, 0.3)',
        icon: 'ℹ️' 
      }
    };
    
    return colors[type];
  }

  /**
   * Remove notification with animation
   */
  static remove(notification: HTMLElement): void {
    if (!this.notifications.has(notification)) return;
    
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification);
      }
      this.notifications.delete(notification);
    }, 400);
  }

  /**
   * Clear all notifications
   */
  static clearAll(): void {
    this.notifications.forEach(notification => {
      this.remove(notification);
    });
  }

  /**
   * Show success notification
   */
  static success(message: string, duration?: number): HTMLElement {
    return this.show({ message, type: 'success', duration });
  }

  /**
   * Show warning notification
   */
  static warning(message: string, duration?: number): HTMLElement {
    return this.show({ message, type: 'warning', duration });
  }

  /**
   * Show error notification
   */
  static error(message: string, duration?: number): HTMLElement {
    return this.show({ message, type: 'error', duration });
  }

  /**
   * Show info notification
   */
  static info(message: string, duration?: number): HTMLElement {
    return this.show({ message, type: 'info', duration });
  }

  /**
   * Show persistent notification
   */
  static persistent(message: string, type: NotificationType = 'info'): HTMLElement {
    return this.show({ message, type, persistent: true });
  }

  /**
   * Show notification with actions
   */
  static withActions(
    message: string, 
    type: NotificationType, 
    actions: Array<{ label: string; action: () => void }>
  ): HTMLElement {
    return this.show({ message, type, actions, persistent: true });
  }

  /**
   * Show loading notification
   */
  static loading(message: string = 'Loading...'): HTMLElement {
    const notification = this.show({ 
      message: `<div style="display: flex; align-items: center; gap: 12px;">
        <div style="
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
        ${message}
      </div>`, 
      type: 'info', 
      persistent: true 
    });
    
    return notification;
  }

  /**
   * Update notification message
   */
  static updateMessage(notification: HTMLElement, newMessage: string): void {
    const messageElement = notification.querySelector('div > div');
    if (messageElement) {
      messageElement.innerHTML = newMessage;
    }
  }

  /**
   * Set max notifications
   */
  static setMaxNotifications(max: number): void {
    this.maxNotifications = max;
  }

  /**
   * Set default duration
   */
  static setDefaultDuration(duration: number): void {
    this.defaultDuration = duration;
  }

  /**
   * Get notification count
   */
  static getNotificationCount(): number {
    return this.notifications.size;
  }

  /**
   * Check if notifications are supported
   */
  static isSupported(): boolean {
    return typeof document !== 'undefined';
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes notificationProgress {
    from {
      transform: scaleX(1);
    }
    to {
      transform: scaleX(0);
    }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .notification:hover {
    transform: translateX(-5px) !important;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4) !important;
  }
`;
document.head.appendChild(style);