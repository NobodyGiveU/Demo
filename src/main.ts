import { ViewManager } from '@/components/ViewManager';
import { NotificationUtils } from '@/utils/notificationUtils';
import { AnimationUtils } from '@/utils/animationUtils';
import { StorageUtils } from '@/utils/storageUtils';
import { TimeUtils } from '@/utils/timeUtils';
import type { ViewType, AppError } from '@/types';

/**
 * Main application class with comprehensive TypeScript support
 */
class WebTimeWiseApp {
  private viewManager: ViewManager;
  private currentPage: ViewType;
  private isInitialized: boolean = false;
  private errorHandler: (error: AppError) => void;

  constructor() {
    this.viewManager = new ViewManager();
    this.currentPage = this.detectCurrentPage();
    this.errorHandler = this.handleGlobalError.bind(this);
    this.init();
  }

  /**
   * Detect current page from URL
   */
  private detectCurrentPage(): ViewType {
    const path = window.location.pathname;
    
    if (path.includes('browser-view')) return 'browser';
    if (path.includes('mobile-view')) return 'mobile';
    if (path.includes('laptop-view')) return 'laptop';
    if (path.includes('share-stats')) return 'share';
    
    return 'overall';
  }

  /**
   * Initialize the application
   */
  private async init(): Promise<void> {
    try {
      // Setup global error handling
      this.setupErrorHandling();

      // Check browser compatibility
      this.checkBrowserCompatibility();

      // Initialize storage
      await this.initializeStorage();

      // Set current view in view manager
      this.viewManager.setCurrentView(this.currentPage);

      // Initialize view manager
      await this.viewManager.initialize();

      // Initialize page-specific functionality
      await this.initializePage();

      // Setup global event listeners
      this.setupGlobalListeners();

      // Initialize focus mode if on overall view
      if (this.currentPage === 'overall') {
        this.initializeFocusMode();
      }

      // Show welcome message
      this.showWelcomeMessage();

      // Animate page entrance
      this.animatePageEntrance();

      // Mark as initialized
      this.isInitialized = true;

      console.log(`WebTimeWise initialized successfully for ${this.currentPage} view`);
    } catch (error) {
      console.error('Failed to initialize WebTimeWise:', error);
      this.handleInitializationError(error);
    }
  }

  /**
   * Setup global error handling
   */
  private setupErrorHandling(): void {
    window.addEventListener('error', (event) => {
      this.handleGlobalError({
        name: 'JavaScriptError',
        message: event.message,
        code: 'JS_ERROR',
        severity: 'medium'
      } as AppError);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleGlobalError({
        name: 'UnhandledPromiseRejection',
        message: event.reason?.message || 'Unhandled promise rejection',
        code: 'PROMISE_ERROR',
        severity: 'high'
      } as AppError);
    });
  }

  /**
   * Handle global errors
   */
  private handleGlobalError(error: AppError): void {
    console.error('Global error:', error);
    
    switch (error.severity) {
      case 'high':
        NotificationUtils.error(`Critical error: ${error.message}`);
        break;
      case 'medium':
        NotificationUtils.warning(`Warning: ${error.message}`);
        break;
      case 'low':
        NotificationUtils.info(`Info: ${error.message}`);
        break;
    }
  }

  /**
   * Handle initialization errors
   */
  private handleInitializationError(error: any): void {
    const fallbackMessage = 'Failed to initialize application. Please refresh the page.';
    
    NotificationUtils.error(fallbackMessage, 0); // Persistent error
    
    // Show fallback UI
    document.body.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-family: Inter, sans-serif;
        text-align: center;
        padding: 20px;
      ">
        <h1 style="font-size: 2rem; margin-bottom: 1rem;">⚠️ Initialization Error</h1>
        <p style="font-size: 1.1rem; margin-bottom: 2rem; max-width: 500px;">
          WebTimeWise failed to initialize properly. This might be due to browser compatibility issues or corrupted data.
        </p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
          <button onclick="location.reload()" style="
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
          ">Refresh Page</button>
          <button onclick="localStorage.clear(); location.reload()" style="
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
          ">Clear Data & Refresh</button>
        </div>
      </div>
    `;
  }

  /**
   * Check browser compatibility
   */
  private checkBrowserCompatibility(): void {
    const requiredFeatures = [
      'localStorage',
      'Promise',
      'fetch',
      'requestAnimationFrame',
      'addEventListener'
    ];

    const missingFeatures = requiredFeatures.filter(feature => {
      return !(feature in window);
    });

    if (missingFeatures.length > 0) {
      throw new Error(`Browser missing required features: ${missingFeatures.join(', ')}`);
    }

    // Check for modern JavaScript features
    try {
      eval('const test = () => {}; const {a} = {a: 1};');
    } catch (error) {
      throw new Error('Browser does not support modern JavaScript features');
    }
  }

  /**
   * Initialize storage
   */
  private async initializeStorage(): Promise<void> {
    if (!StorageUtils.isAvailable()) {
      throw new Error('localStorage is not available');
    }

    // Check storage quota
    const remainingQuota = StorageUtils.getRemainingQuota();
    if (remainingQuota < 1024 * 100) { // Less than 100KB
      NotificationUtils.warning('Storage space is running low');
    }

    // Initialize default settings if not present
    if (!StorageUtils.hasItem('settings')) {
      const defaultSettings = {
        theme: 'dark',
        language: 'en',
        notifications: true,
        autoRefresh: true
      };
      StorageUtils.setItem('settings', defaultSettings);
    }
  }

  /**
   * Initialize page-specific functionality
   */
  private async initializePage(): Promise<void> {
    switch (this.currentPage) {
      case 'overall':
        await this.initializeOverallView();
        break;
      case 'browser':
        await this.initializeBrowserView();
        break;
      case 'mobile':
        await this.initializeMobileView();
        break;
      case 'laptop':
        await this.initializeLaptopView();
        break;
      case 'share':
        await this.initializeShareView();
        break;
    }
  }

  /**
   * Initialize overall view
   */
  private async initializeOverallView(): Promise<void> {
    const chartManager = this.viewManager.getChartManager();
    
    // Device usage chart
    const deviceData = {
      labels: ['Laptop', 'Mobile', 'Browser'],
      data: [54, 35, 11],
      colors: ['#007ACC', '#E4405F', '#4285F4']
    };
    chartManager.createDoughnutChart('deviceChart', deviceData);

    // Category chart
    const categoryData = {
      labels: ['Social Media', 'Productive', 'Games', 'Other', 'News', 'Entertainment'],
      data: [30, 25, 20, 10, 8, 7],
      colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#9C27B0', '#FF9800']
    };
    chartManager.createDoughnutChart('categoryChart', categoryData);

    // Animate charts
    await TimeUtils.sleep(100);
    chartManager.animateChart('deviceChart', 'slideUp');
    chartManager.animateChart('categoryChart', 'scale');
  }

  /**
   * Initialize browser view
   */
  private async initializeBrowserView(): Promise<void> {
    const chartManager = this.viewManager.getChartManager();
    
    const categoryData = {
      labels: ['Entertainment', 'Games', 'Social Media', 'Other'],
      data: [38, 26, 18, 18],
      colors: ['#FF6B6B', '#9C27B0', '#E4405F', '#9E9E9E']
    };
    
    chartManager.createDoughnutChart('categoryChart', categoryData);
    
    await TimeUtils.sleep(100);
    chartManager.animateChart('categoryChart', 'fadeIn');
  }

  /**
   * Initialize mobile view
   */
  private async initializeMobileView(): Promise<void> {
    const chartManager = this.viewManager.getChartManager();
    
    const mobileData = {
      labels: ['Instagram', 'WhatsApp', 'Spotify', 'YouTube', 'Games', 'Gmail'],
      data: [32, 17, 15, 12, 11, 6],
      colors: ['#E4405F', '#25D366', '#1DB954', '#FF0000', '#FF6B6B', '#EA4335']
    };
    
    chartManager.createDoughnutChart('mobileChart', mobileData);
    
    await TimeUtils.sleep(100);
    chartManager.animateChart('mobileChart', 'scale');
  }

  /**
   * Initialize laptop view
   */
  private async initializeLaptopView(): Promise<void> {
    const chartManager = this.viewManager.getChartManager();
    
    const laptopData = {
      labels: ['VS Code', 'Chrome', 'Outlook', 'Excel', 'Spotify', 'Slack'],
      data: [33, 26, 11, 9, 8, 6],
      colors: ['#007ACC', '#4285F4', '#0078D4', '#217346', '#1DB954', '#4A154B']
    };
    
    chartManager.createDoughnutChart('laptopChart', laptopData);
    
    await TimeUtils.sleep(100);
    chartManager.animateChart('laptopChart', 'slideUp');
  }

  /**
   * Initialize share view
   */
  private async initializeShareView(): Promise<void> {
    const chartManager = this.viewManager.getChartManager();
    
    // Daily chart
    chartManager.createBarChart(
      'dailyChart',
      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      [{
        label: 'Screen Time (hours)',
        data: [6.2, 5.8, 7.1, 4.9, 6.5, 3.8, 3.6],
        backgroundColor: ['#4a90e2', '#4a90e2', '#4a90e2', '#4a90e2', '#4a90e2', '#ff9800', '#ff9800']
      }]
    );

    // Category chart
    const categoryData = {
      labels: ['Entertainment', 'Social Media', 'Productivity', 'Shopping', 'News'],
      data: [39, 10, 1, 8, 12],
      colors: ['#ff9800', '#2196f3', '#4caf50', '#9c27b0', '#ff5722']
    };
    chartManager.createDoughnutChart('categoryChart', categoryData);

    // Animate charts
    await TimeUtils.sleep(100);
    chartManager.animateChart('dailyChart', 'slideUp');
    chartManager.animateChart('categoryChart', 'scale');
  }

  /**
   * Initialize focus mode functionality
   */
  private initializeFocusMode(): void {
    const focusToggle = document.getElementById('focusModeToggle') as HTMLInputElement;
    const focusBlockList = document.getElementById('focusBlockedSitesList');
    const addFocusBtn = document.getElementById('addFocusBlockBtn');
    const focusSiteInput = document.getElementById('focusSiteToBlock') as HTMLInputElement;

    if (!focusToggle || !focusBlockList || !addFocusBtn || !focusSiteInput) return;

    // Load focus mode state
    const isActive = StorageUtils.getItem<boolean>('focusActive', false);
    focusToggle.checked = isActive;

    // Toggle focus mode
    focusToggle.addEventListener('change', () => {
      const active = focusToggle.checked;
      StorageUtils.setItem('focusActive', active);
      
      NotificationUtils.info(
        active ? 'Focus mode activated' : 'Focus mode deactivated'
      );

      // Log focus session
      this.logFocusSession(active);
    });

    // Add site to block list
    const addSiteHandler = () => {
      const site = focusSiteInput.value.trim();
      if (!site) return;

      const cleanSite = this.cleanDomainName(site);
      
      // Get current block list
      const blockList = StorageUtils.getItem<string[]>('focusBlockList', []);
      
      if (!blockList.includes(cleanSite)) {
        blockList.push(cleanSite);
        StorageUtils.setItem('focusBlockList', blockList);
        this.renderFocusBlockList();
        focusSiteInput.value = '';
        
        NotificationUtils.success(`Added ${cleanSite} to focus block list`);
      } else {
        NotificationUtils.warning('Site already in block list');
      }
    };

    addFocusBtn.addEventListener('click', addSiteHandler);
    
    // Enter key support
    focusSiteInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addSiteHandler();
      }
    });

    // Initial render
    this.renderFocusBlockList();
  }

  /**
   * Clean domain name
   */
  private cleanDomainName(input: string): string {
    return input
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .toLowerCase();
  }

  /**
   * Log focus session
   */
  private logFocusSession(isStarting: boolean): void {
    const sessions = StorageUtils.getItem<any[]>('focusSessions', []);
    
    if (isStarting) {
      sessions.push({
        id: Date.now().toString(),
        startTime: Date.now(),
        endTime: null,
        duration: 0,
        completed: false
      });
    } else {
      const lastSession = sessions[sessions.length - 1];
      if (lastSession && !lastSession.endTime) {
        lastSession.endTime = Date.now();
        lastSession.duration = lastSession.endTime - lastSession.startTime;
        lastSession.completed = true;
      }
    }
    
    StorageUtils.setItem('focusSessions', sessions);
  }

  /**
   * Render focus block list
   */
  private renderFocusBlockList(): void {
    const container = document.getElementById('focusBlockedSitesList');
    if (!container) return;

    const blockList = StorageUtils.getItem<string[]>('focusBlockList', []);
    
    if (blockList.length === 0) {
      container.innerHTML = '<div class="no-sites">No focus block sites added</div>';
      return;
    }

    container.innerHTML = blockList.map((site: string) => `
      <div class="blocked-site-item">
        <div class="site-info">
          <img src="https://www.google.com/s2/favicons?domain=${site}&sz=32" 
               alt="${site} logo" 
               class="site-logo"
               onerror="this.style.display='none'">
          <span class="site-name">${this.getCleanWebsiteName(site)}</span>
        </div>
        <button class="remove-focus-block-btn" data-site="${site}">❌</button>
      </div>
    `).join('');

    // Add remove listeners
    container.querySelectorAll('.remove-focus-block-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const site = (e.target as HTMLElement).dataset.site;
        if (site) {
          this.removeFocusBlockSite(site);
        }
      });
    });

    // Animate list items
    const items = container.querySelectorAll('.blocked-site-item');
    AnimationUtils.staggeredAnimation(
      Array.from(items) as HTMLElement[],
      AnimationUtils.slideUp,
      50
    );
  }

  /**
   * Remove site from focus block list
   */
  private removeFocusBlockSite(site: string): void {
    const blockList = StorageUtils.getItem<string[]>('focusBlockList', []);
    const updatedList = blockList.filter((s: string) => s !== site);
    StorageUtils.setItem('focusBlockList', updatedList);
    this.renderFocusBlockList();
    
    NotificationUtils.info(`Removed ${site} from focus block list`);
  }

  /**
   * Get clean website name
   */
  private getCleanWebsiteName(domain: string): string {
    const cleaned = domain.replace(/^www\./, '');
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).split('.')[0];
  }

  /**
   * Setup global event listeners
   */
  private setupGlobalListeners(): void {
    // Modal close functionality
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      // Close modal when clicking close button
      if (target.classList.contains('close-btn')) {
        const modal = target.closest('.modal') as HTMLElement;
        if (modal) {
          AnimationUtils.fadeOut(modal).then(() => {
            modal.style.display = 'none';
          });
        }
      }
      
      // Close modal when clicking outside
      if (target.classList.contains('modal')) {
        AnimationUtils.fadeOut(target).then(() => {
          target.style.display = 'none';
        });
      }
    });

    // Escape key to close modals
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="block"]') as HTMLElement;
        if (openModal) {
          AnimationUtils.fadeOut(openModal).then(() => {
            openModal.style.display = 'none';
          });
        }
      }
    });

    // Demo popup functionality
    this.setupDemoPopup();

    // Performance monitoring
    this.setupPerformanceMonitoring();
  }

  /**
   * Setup demo popup
   */
  private setupDemoPopup(): void {
    const demoPopup = document.getElementById('demoPopupOverlay');
    const continueBtn = document.getElementById('demoContinueBtn');
    
    if (!demoPopup || !continueBtn) return;

    // Show popup if not seen in this session
    const hasSeenPopup = sessionStorage.getItem('webtimewise_hasSeenDemoPopup');
    if (!hasSeenPopup) {
      demoPopup.classList.remove('hidden');
      AnimationUtils.fadeIn(demoPopup);
    }

    // Continue button
    continueBtn.addEventListener('click', () => {
      AnimationUtils.fadeOut(demoPopup).then(() => {
        demoPopup.classList.add('hidden');
      });
      sessionStorage.setItem('webtimewise_hasSeenDemoPopup', 'true');
    });

    // Click outside to close
    demoPopup.addEventListener('click', (e) => {
      if (e.target === demoPopup) {
        AnimationUtils.fadeOut(demoPopup).then(() => {
          demoPopup.classList.add('hidden');
        });
        sessionStorage.setItem('webtimewise_hasSeenDemoPopup', 'true');
      }
    });
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    // Monitor page load performance
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
      
      console.log(`Page load time: ${loadTime}ms`);
      
      if (loadTime > 3000) {
        NotificationUtils.warning('Page loaded slowly. Consider refreshing if performance issues persist.');
      }
    });

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usedMB = memory.usedJSHeapSize / 1024 / 1024;
        
        if (usedMB > 100) {
          console.warn(`High memory usage: ${usedMB.toFixed(1)}MB`);
        }
      }, 30000);
    }
  }

  /**
   * Show welcome message
   */
  private showWelcomeMessage(): void {
    const viewNames: Record<ViewType, string> = {
      overall: 'Overall Dashboard',
      browser: 'Browser Analytics',
      mobile: 'Mobile Insights',
      laptop: 'Laptop Tracking',
      share: 'Share Statistics'
    };

    setTimeout(() => {
      NotificationUtils.info(`Welcome to ${viewNames[this.currentPage]}!`, 3000);
    }, 1000);
  }

  /**
   * Animate page entrance
   */
  private animatePageEntrance(): void {
    const elements = document.querySelectorAll('.stat-card, .chart-container, .list-card, .total-time-card');
    AnimationUtils.staggeredAnimation(
      Array.from(elements) as HTMLElement[],
      AnimationUtils.slideUp,
      100
    );
  }

  /**
   * Get application instance
   */
  static getInstance(): WebTimeWiseApp | null {
    return (window as any).webTimeWiseApp || null;
  }

  /**
   * Destroy application instance
   */
  destroy(): void {
    if (this.isInitialized) {
      this.viewManager.destroy();
      NotificationUtils.clearAll();
      this.isInitialized = false;
    }
  }

  /**
   * Get current page
   */
  getCurrentPage(): ViewType {
    return this.currentPage;
  }

  /**
   * Get view manager
   */
  getViewManager(): ViewManager {
    return this.viewManager;
  }

  /**
   * Check if app is initialized
   */
  isAppInitialized(): boolean {
    return this.isInitialized;
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new WebTimeWiseApp();
  (window as any).webTimeWiseApp = app;
});

// Export for global access
(window as any).WebTimeWiseApp = WebTimeWiseApp;

// Handle page unload
window.addEventListener('beforeunload', () => {
  const app = WebTimeWiseApp.getInstance();
  if (app) {
    app.destroy();
  }
});