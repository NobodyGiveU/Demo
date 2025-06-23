import { ViewManager } from './components/ViewManager';
import { NotificationUtils } from './utils/notificationUtils';
import { AnimationUtils } from './utils/animationUtils';
import type { ViewType } from './types';

/**
 * Main application entry point
 */
class WebTimeWiseApp {
  private viewManager: ViewManager;
  private currentPage: ViewType;

  constructor() {
    this.viewManager = new ViewManager();
    this.currentPage = this.detectCurrentPage();
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
      // Set current view in view manager
      this.viewManager.setCurrentView(this.currentPage);

      // Initialize page-specific functionality
      await this.initializePage();

      // Setup global event listeners
      this.setupGlobalListeners();

      // Show welcome notification
      this.showWelcomeMessage();

      // Animate page entrance
      this.animatePageEntrance();

      console.log(`WebTimeWise initialized for ${this.currentPage} view`);
    } catch (error) {
      console.error('Failed to initialize WebTimeWise:', error);
      NotificationUtils.error('Failed to initialize application');
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
    // Initialize charts
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

    // Initialize focus mode functionality
    this.initializeFocusMode();
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
    const isActive = localStorage.getItem('focusActive') === 'true';
    focusToggle.checked = isActive;

    // Toggle focus mode
    focusToggle.addEventListener('change', () => {
      const active = focusToggle.checked;
      localStorage.setItem('focusActive', active.toString());
      
      NotificationUtils.info(
        active ? 'Focus mode activated' : 'Focus mode deactivated'
      );
    });

    // Add site to block list
    addFocusBtn.addEventListener('click', () => {
      const site = focusSiteInput.value.trim();
      if (!site) return;

      const cleanSite = site.replace(/^https?:\/\//, '').replace(/^www\./, '').toLowerCase();
      
      // Get current block list
      const blockList = JSON.parse(localStorage.getItem('focusBlockList') || '[]');
      
      if (!blockList.includes(cleanSite)) {
        blockList.push(cleanSite);
        localStorage.setItem('focusBlockList', JSON.stringify(blockList));
        this.renderFocusBlockList();
        focusSiteInput.value = '';
        
        NotificationUtils.success(`Added ${cleanSite} to focus block list`);
      } else {
        NotificationUtils.warning('Site already in block list');
      }
    });

    // Initial render
    this.renderFocusBlockList();
  }

  /**
   * Render focus block list
   */
  private renderFocusBlockList(): void {
    const container = document.getElementById('focusBlockedSitesList');
    if (!container) return;

    const blockList = JSON.parse(localStorage.getItem('focusBlockList') || '[]');
    
    if (blockList.length === 0) {
      container.innerHTML = '<div class="no-sites">No focus block sites added</div>';
      return;
    }

    container.innerHTML = blockList.map((site: string) => `
      <div class="blocked-site-item">
        <div class="site-info">
          <img src="https://www.google.com/s2/favicons?domain=${site}&sz=32" alt="${site} logo" class="site-logo">
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
  }

  /**
   * Remove site from focus block list
   */
  private removeFocusBlockSite(site: string): void {
    const blockList = JSON.parse(localStorage.getItem('focusBlockList') || '[]');
    const updatedList = blockList.filter((s: string) => s !== site);
    localStorage.setItem('focusBlockList', JSON.stringify(updatedList));
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
          modal.style.display = 'none';
        }
      }
      
      // Close modal when clicking outside
      if (target.classList.contains('modal')) {
        target.style.display = 'none';
      }
    });

    // Escape key to close modals
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="block"]') as HTMLElement;
        if (openModal) {
          openModal.style.display = 'none';
        }
      }
    });

    // Demo popup functionality
    this.setupDemoPopup();
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
    }

    // Continue button
    continueBtn.addEventListener('click', () => {
      demoPopup.classList.add('hidden');
      sessionStorage.setItem('webtimewise_hasSeenDemoPopup', 'true');
    });

    // Click outside to close
    demoPopup.addEventListener('click', (e) => {
      if (e.target === demoPopup) {
        demoPopup.classList.add('hidden');
        sessionStorage.setItem('webtimewise_hasSeenDemoPopup', 'true');
      }
    });
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
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new WebTimeWiseApp();
});

// Export for global access
(window as any).WebTimeWiseApp = WebTimeWiseApp;