import type { AnimationConfig } from '../types';

/**
 * Animation utilities for smooth UI transitions
 */
export class AnimationUtils {
  private static readonly DEFAULT_DURATION = 300;
  private static readonly DEFAULT_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

  /**
   * Animate element with fade in effect
   */
  static fadeIn(element: HTMLElement, config: Partial<AnimationConfig> = {}): Promise<void> {
    const { duration = this.DEFAULT_DURATION, delay = 0 } = config;
    
    return new Promise((resolve) => {
      element.style.opacity = '0';
      element.style.transition = `opacity ${duration}ms ${this.DEFAULT_EASING}`;
      
      setTimeout(() => {
        element.style.opacity = '1';
        setTimeout(resolve, duration);
      }, delay);
    });
  }

  /**
   * Animate element with slide up effect
   */
  static slideUp(element: HTMLElement, config: Partial<AnimationConfig> = {}): Promise<void> {
    const { duration = this.DEFAULT_DURATION, delay = 0 } = config;
    
    return new Promise((resolve) => {
      element.style.transform = 'translateY(20px)';
      element.style.opacity = '0';
      element.style.transition = `transform ${duration}ms ${this.DEFAULT_EASING}, opacity ${duration}ms ${this.DEFAULT_EASING}`;
      
      setTimeout(() => {
        element.style.transform = 'translateY(0)';
        element.style.opacity = '1';
        setTimeout(resolve, duration);
      }, delay);
    });
  }

  /**
   * Animate multiple elements with staggered timing
   */
  static staggeredAnimation(
    elements: HTMLElement[], 
    animationFn: (el: HTMLElement, config: Partial<AnimationConfig>) => Promise<void>,
    staggerDelay: number = 100
  ): Promise<void[]> {
    return Promise.all(
      elements.map((element, index) => 
        animationFn(element, { delay: index * staggerDelay })
      )
    );
  }

  /**
   * Animate progress bar fill
   */
  static animateProgressBar(element: HTMLElement, targetWidth: number, duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      element.style.width = '0%';
      element.style.transition = `width ${duration}ms ${this.DEFAULT_EASING}`;
      
      requestAnimationFrame(() => {
        element.style.width = `${targetWidth}%`;
        setTimeout(resolve, duration);
      });
    });
  }

  /**
   * Pulse animation for notifications
   */
  static pulse(element: HTMLElement, intensity: number = 1.05): Promise<void> {
    return new Promise((resolve) => {
      const originalTransform = element.style.transform;
      element.style.transition = 'transform 150ms ease-out';
      
      element.style.transform = `scale(${intensity})`;
      
      setTimeout(() => {
        element.style.transform = originalTransform;
        setTimeout(resolve, 150);
      }, 150);
    });
  }

  /**
   * Smooth scroll to element
   */
  static scrollToElement(element: HTMLElement, offset: number = 0): void {
    const elementPosition = element.offsetTop - offset;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }

  /**
   * Create ripple effect on click
   */
  static createRipple(event: MouseEvent, element: HTMLElement): void {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 600ms linear;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);