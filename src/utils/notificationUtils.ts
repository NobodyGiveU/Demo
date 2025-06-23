import type { NotificationConfig } from '../types';

/**
 * Enhanced notification system with different types and animations
 */
export class NotificationUtils {
  private static container: HTMLElement | null = null;
  private static notifications: Set<HTMLElement> = new Set();

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
    `;
    document.body.appendChild(this.container);
  }

  /**
   * Show notification with enhanced styling and animations
   */
  static show(config: NotificationConfig): void {
    this.initContainer();
    
    const { message, type, duration = 4000 } = config;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = {
      success: { bg: 'linear-gradient(135deg, #4caf50, #45a049)', icon: '✅' },
      warning: { bg: 'linear-gradient(135deg, #ff9800, #f57c00)', icon: '⚠️' },
      error: { bg: 'linear-gradient(135deg, #f44336, #d32f2f)', icon: '❌' },
      info: { bg: 'linear-gradient(135deg, #2196f3, #1976d2)', icon: 'ℹ️' }
    };
    
    const color = colors[type];
    
    notification.style.cssText = `
      background: ${color.bg};
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      max-width: 400px;
      font-weight: 500;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 12px;
      transform: translateX(100%);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      pointer-events: auto;
      cursor: pointer;
    `;
    
    notification.innerHTML = `
      <span style="font-size: 1.2rem;">${color.icon}</span>
      <span style="flex: 1;">${message}</span>
      <button style="
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.8);
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin-left: 8px;
        transition: color 0.2s ease;
      " onclick="this.parentElement.remove()">×</button>
    `;
    
    this.container!.appendChild(notification);
    this.notifications.add(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    });
    
    // Auto remove
    setTimeout(() => {
      this.remove(notification);
    }, duration);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
      this.remove(notification);
    });
  }

  /**
   * Remove notification with animation
   */
  private static remove(notification: HTMLElement): void {
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
  static success(message: string, duration?: number): void {
    this.show({ message, type: 'success', duration });
  }

  /**
   * Show warning notification
   */
  static warning(message: string, duration?: number): void {
    this.show({ message, type: 'warning', duration });
  }

  /**
   * Show error notification
   */
  static error(message: string, duration?: number): void {
    this.show({ message, type: 'error', duration });
  }

  /**
   * Show info notification
   */
  static info(message: string, duration?: number): void {
    this.show({ message, type: 'info', duration });
  }
}