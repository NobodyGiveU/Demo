import type { AnimationConfig } from '@/types';

/**
 * Enhanced animation utilities with comprehensive TypeScript support
 */
export class AnimationUtils {
  private static readonly DEFAULT_DURATION = 300;
  private static readonly DEFAULT_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
  private static readonly ANIMATION_QUEUE: Map<HTMLElement, Promise<void>> = new Map();

  /**
   * Animate element with fade in effect
   */
  static fadeIn(element: HTMLElement, config: Partial<AnimationConfig> = {}): Promise<void> {
    const { duration = this.DEFAULT_DURATION, delay = 0 } = config;
    
    return this.queueAnimation(element, () => {
      return new Promise((resolve) => {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ${this.DEFAULT_EASING}`;
        
        setTimeout(() => {
          element.style.opacity = '1';
          setTimeout(resolve, duration);
        }, delay);
      });
    });
  }

  /**
   * Animate element with fade out effect
   */
  static fadeOut(element: HTMLElement, config: Partial<AnimationConfig> = {}): Promise<void> {
    const { duration = this.DEFAULT_DURATION, delay = 0 } = config;
    
    return this.queueAnimation(element, () => {
      return new Promise((resolve) => {
        element.style.transition = `opacity ${duration}ms ${this.DEFAULT_EASING}`;
        
        setTimeout(() => {
          element.style.opacity = '0';
          setTimeout(resolve, duration);
        }, delay);
      });
    });
  }

  /**
   * Animate element with slide up effect
   */
  static slideUp(element: HTMLElement, config: Partial<AnimationConfig> = {}): Promise<void> {
    const { duration = this.DEFAULT_DURATION, delay = 0 } = config;
    
    return this.queueAnimation(element, () => {
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
    });
  }

  /**
   * Animate element with slide down effect
   */
  static slideDown(element: HTMLElement, config: Partial<AnimationConfig> = {}): Promise<void> {
    const { duration = this.DEFAULT_DURATION, delay = 0 } = config;
    
    return this.queueAnimation(element, () => {
      return new Promise((resolve) => {
        element.style.transform = 'translateY(-20px)';
        element.style.opacity = '0';
        element.style.transition = `transform ${duration}ms ${this.DEFAULT_EASING}, opacity ${duration}ms ${this.DEFAULT_EASING}`;
        
        setTimeout(() => {
          element.style.transform = 'translateY(0)';
          element.style.opacity = '1';
          setTimeout(resolve, duration);
        }, delay);
      });
    });
  }

  /**
   * Animate element with slide left effect
   */
  static slideLeft(element: HTMLElement, config: Partial<AnimationConfig> = {}): Promise<void> {
    const { duration = this.DEFAULT_DURATION, delay = 0 } = config;
    
    return this.queueAnimation(element, () => {
      return new Promise((resolve) => {
        element.style.transform = 'translateX(20px)';
        element.style.opacity = '0';
        element.style.transition = `transform ${duration}ms ${this.DEFAULT_EASING}, opacity ${duration}ms ${this.DEFAULT_EASING}`;
        
        setTimeout(() => {
          element.style.transform = 'translateX(0)';
          element.style.opacity = '1';
          setTimeout(resolve, duration);
        }, delay);
      });
    });
  }

  /**
   * Animate element with slide right effect
   */
  static slideRight(element: HTMLElement, config: Partial<AnimationConfig> = {}): Promise<void> {
    const { duration = this.DEFAULT_DURATION, delay = 0 } = config;
    
    return this.queueAnimation(element, () => {
      return new Promise((resolve) => {
        element.style.transform = 'translateX(-20px)';
        element.style.opacity = '0';
        element.style.transition = `transform ${duration}ms ${this.DEFAULT_EASING}, opacity ${duration}ms ${this.DEFAULT_EASING}`;
        
        setTimeout(() => {
          element.style.transform = 'translateX(0)';
          element.style.opacity = '1';
          setTimeout(resolve, duration);
        }, delay);
      });
    });
  }

  /**
   * Animate element with scale effect
   */
  static scale(element: HTMLElement, config: Partial<AnimationConfig> = {}): Promise<void> {
    const { duration = this.DEFAULT_DURATION, delay = 0 } = config;
    
    return this.queueAnimation(element, () => {
      return new Promise((resolve) => {
        element.style.transform = 'scale(0.8)';
        element.style.opacity = '0';
        element.style.transition = `transform ${duration}ms ${this.DEFAULT_EASING}, opacity ${duration}ms ${this.DEFAULT_EASING}`;
        
        setTimeout(() => {
          element.style.transform = 'scale(1)';
          element.style.opacity = '1';
          setTimeout(resolve, duration);
        }, delay);
      });
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
  static animateProgressBar(
    element: HTMLElement, 
    targetWidth: number, 
    duration: number = 1000
  ): Promise<void> {
    return this.queueAnimation(element, () => {
      return new Promise((resolve) => {
        element.style.width = '0%';
        element.style.transition = `width ${duration}ms ${this.DEFAULT_EASING}`;
        
        requestAnimationFrame(() => {
          element.style.width = `${targetWidth}%`;
          setTimeout(resolve, duration);
        });
      });
    });
  }

  /**
   * Pulse animation for notifications
   */
  static pulse(element: HTMLElement, intensity: number = 1.05): Promise<void> {
    return this.queueAnimation(element, () => {
      return new Promise((resolve) => {
        const originalTransform = element.style.transform;
        element.style.transition = 'transform 150ms ease-out';
        
        element.style.transform = `scale(${intensity})`;
        
        setTimeout(() => {
          element.style.transform = originalTransform;
          setTimeout(resolve, 150);
        }, 150);
      });
    });
  }

  /**
   * Bounce animation
   */
  static bounce(element: HTMLElement, config: Partial<AnimationConfig> = {}): Promise<void> {
    const { duration = 600 } = config;
    
    return this.queueAnimation(element, () => {
      return new Promise((resolve) => {
        element.style.animation = `bounce ${duration}ms ease-in-out`;
        
        setTimeout(() => {
          element.style.animation = '';
          resolve();
        }, duration);
      });
    });
  }

  /**
   * Shake animation
   */
  static shake(element: HTMLElement, config: Partial<AnimationConfig> = {}): Promise<void> {
    const { duration = 500 } = config;
    
    return this.queueAnimation(element, () => {
      return new Promise((resolve) => {
        element.style.animation = `shake ${duration}ms ease-in-out`;
        
        setTimeout(() => {
          element.style.animation = '';
          resolve();
        }, duration);
      });
    });
  }

  /**
   * Rotate animation
   */
  static rotate(element: HTMLElement, degrees: number = 360, duration: number = 500): Promise<void> {
    return this.queueAnimation(element, () => {
      return new Promise((resolve) => {
        element.style.transition = `transform ${duration}ms ${this.DEFAULT_EASING}`;
        element.style.transform = `rotate(${degrees}deg)`;
        
        setTimeout(() => {
          element.style.transform = 'rotate(0deg)';
          setTimeout(resolve, duration);
        }, duration);
      });
    });
  }

  /**
   * Smooth scroll to element
   */
  static scrollToElement(element: HTMLElement, offset: number = 0): Promise<void> {
    return new Promise((resolve) => {
      const elementPosition = element.offsetTop - offset;
      const startPosition = window.pageYOffset;
      const distance = elementPosition - startPosition;
      const duration = Math.min(Math.abs(distance) / 2, 1000);
      let start: number | null = null;

      function animation(currentTime: number) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          resolve();
        }
      }

      requestAnimationFrame(animation);
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
      z-index: 1000;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }

  /**
   * Animate number change
   */
  static animateNumberChange(
    element: HTMLElement, 
    newValue: string, 
    duration: number = 1000
  ): Promise<void> {
    return new Promise((resolve) => {
      const oldValue = element.textContent || '0';
      const isNumeric = /^\d+(\.\d+)?/.test(oldValue) && /^\d+(\.\d+)?/.test(newValue);
      
      if (!isNumeric) {
        // For non-numeric values, just fade transition
        element.style.transition = `opacity ${duration / 2}ms ease-out`;
        element.style.opacity = '0';
        
        setTimeout(() => {
          element.textContent = newValue;
          element.style.opacity = '1';
          setTimeout(resolve, duration / 2);
        }, duration / 2);
        return;
      }

      const startNum = parseFloat(oldValue);
      const endNum = parseFloat(newValue);
      const startTime = performance.now();

      function updateNumber(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = startNum + (endNum - startNum) * this.easeOutQuart(progress);
        
        element.textContent = newValue.includes('.') ? 
          current.toFixed(1) : 
          Math.round(current).toString();
        
        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          element.textContent = newValue;
          resolve();
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  /**
   * Animate height change
   */
  static animateHeight(
    element: HTMLElement, 
    targetHeight: number, 
    duration: number = 300
  ): Promise<void> {
    return this.queueAnimation(element, () => {
      return new Promise((resolve) => {
        const startHeight = element.offsetHeight;
        element.style.transition = `height ${duration}ms ${this.DEFAULT_EASING}`;
        element.style.height = `${targetHeight}px`;
        
        setTimeout(resolve, duration);
      });
    });
  }

  /**
   * Animate width change
   */
  static animateWidth(
    element: HTMLElement, 
    targetWidth: number, 
    duration: number = 300
  ): Promise<void> {
    return this.queueAnimation(element, () => {
      return new Promise((resolve) => {
        const startWidth = element.offsetWidth;
        element.style.transition = `width ${duration}ms ${this.DEFAULT_EASING}`;
        element.style.width = `${targetWidth}px`;
        
        setTimeout(resolve, duration);
      });
    });
  }

  /**
   * Queue animation to prevent conflicts
   */
  private static queueAnimation(
    element: HTMLElement, 
    animationFn: () => Promise<void>
  ): Promise<void> {
    const existingAnimation = this.ANIMATION_QUEUE.get(element);
    
    const newAnimation = existingAnimation ? 
      existingAnimation.then(animationFn) : 
      animationFn();
    
    this.ANIMATION_QUEUE.set(element, newAnimation);
    
    newAnimation.finally(() => {
      if (this.ANIMATION_QUEUE.get(element) === newAnimation) {
        this.ANIMATION_QUEUE.delete(element);
      }
    });
    
    return newAnimation;
  }

  /**
   * Easing functions
   */
  private static easeInOutQuad(t: number, b: number, c: number, d: number): number {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }

  private static easeOutQuart(t: number): number {
    return 1 - (--t) * t * t * t;
  }

  /**
   * Clear all animations for an element
   */
  static clearAnimations(element: HTMLElement): void {
    this.ANIMATION_QUEUE.delete(element);
    element.style.transition = '';
    element.style.animation = '';
    element.style.transform = '';
  }

  /**
   * Check if element is currently animating
   */
  static isAnimating(element: HTMLElement): boolean {
    return this.ANIMATION_QUEUE.has(element);
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
      transform: translate3d(0,0,0);
    }
    40%, 43% {
      animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
      transform: translate3d(0, -30px, 0);
    }
    70% {
      animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
      transform: translate3d(0, -15px, 0);
    }
    90% {
      transform: translate3d(0,-4px,0);
    }
  }

  @keyframes shake {
    0%, 100% {
      transform: translateX(0);
    }
    10%, 30%, 50%, 70%, 90% {
      transform: translateX(-10px);
    }
    20%, 40%, 60%, 80% {
      transform: translateX(10px);
    }
  }

  .loading {
    position: relative;
    overflow: hidden;
  }

  .loading::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% {
      left: -100%;
    }
    100% {
      left: 100%;
    }
  }
`;
document.head.appendChild(style);