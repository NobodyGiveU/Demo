import type { ViewType, TimePeriod } from '@/types';
import { DemoDataManager } from '@/data/demoData';
import { ChartManager } from './ChartManager';
import { AnimationUtils } from '@/utils/animationUtils';
import { NotificationUtils } from '@/utils/notificationUtils';
import { TimeUtils } from '@/utils/timeUtils';
import { StorageUtils } from '@/utils/storageUtils';

/**
 * Enhanced view manager with comprehensive TypeScript support
 */
export class ViewManager {
  private chartManager: ChartManager;
  private currentView: ViewType = 'overall';
  private currentPeriod: TimePeriod = 'today';
  private isInitialized: boolean = false;

  constructor() {
    this.chartManager = new ChartManager();
    this.initializeEventListeners();
  }

  /**
   * Initialize the view manager
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load user preferences
      await this.loadUserPreferences();
      
      // Initialize current view
      await this.initializeCurrentView();
      
      // Setup periodic updates
      this.setupPeriodicUpdates();
      
      this.isInitialized = true;
      console.log('ViewManager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize ViewManager:', error);
      NotificationUtils.error('Failed to initialize dashboard');
    }
  }

  /**
   * Initialize global event listeners
   */
  private initializeEventListeners(): void {
    // Time period toggle
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      if (target.classList.contains('time-btn')) {
        this.handleTimePeriodChange(target);
      }
      
      if (target.classList.contains('action-btn')) {
        this.handleActionClick(target);
      }

      if (target.classList.contains('view-btn') || target.classList.contains('switcher-btn')) {
        this.handleViewSwitch(target);
      }

      // Add ripple effect to buttons
      if (target.tagName === 'BUTTON' || target.classList.contains('btn')) {
        AnimationUtils.createRipple(event as MouseEvent, target);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      this.handleKeyboardShortcuts(event);
    });

    // Window resize handler
    window.addEventListener('resize', () => {
      this.chartManager.resizeAllCharts();
    });

    // Visibility change handler
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.refreshData();
      }
    });
  }

  /**
   * Handle keyboard shortcuts
   */
  private handleKeyboardShortcuts(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case '1':
          event.preventDefault();
          this.navigateToView('overall');
          break;
        case '2':
          event.preventDefault();
          this.navigateToView('browser');
          break;
        case '3':
          event.preventDefault();
          this.navigateToView('mobile');
          break;
        case '4':
          event.preventDefault();
          this.navigateToView('laptop');
          break;
        case '5':
          event.preventDefault();
          this.navigateToView('share');
          break;
        case 'r':
          event.preventDefault();
          this.refreshData();
          break;
      }
    }

    // Escape key to close modals
    if (event.key === 'Escape') {
      this.closeAllModals();
    }
  }

  /**
   * Handle time period change
   */
  private handleTimePeriodChange(button: HTMLElement): void {
    const period: TimePeriod = button.id === 'weekBtn' ? 'week' : 'today';
    
    // Update button states
    document.querySelectorAll('.time-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');

    this.currentPeriod = period;
    this.updateViewData();
    
    // Save preference
    StorageUtils.setItem('preferredTimePeriod', period);
    
    NotificationUtils.info(`Switched to ${period === 'week' ? 'weekly' : 'daily'} view`);
  }

  /**
   * Handle view switching
   */
  private handleViewSwitch(button: HTMLElement): void {
    // Update button states
    const container = button.closest('.view-switcher');
    if (container) {
      container.querySelectorAll('.view-btn, .switcher-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
    }

    // Handle specific view switches
    if (button.id === 'categoryViewBtn' || button.id === 'websiteViewBtn') {
      this.switchBrowserView(button.id === 'categoryViewBtn' ? 'category' : 'website');
    }
  }

  /**
   * Handle action button clicks
   */
  private handleActionClick(button: HTMLElement): void {
    const action = button.id;
    
    switch (action) {
      case 'goalsBtn':
        this.showGoalsModal();
        break;
      case 'settingsBtn':
        this.showSettingsModal();
        break;
      case 'moreBtn':
        this.showMoreModal();
        break;
      case 'dashboardBtn':
        this.navigateToView('overall');
        break;
      case 'refreshBtn':
        this.refreshData();
        break;
      case 'exportBtn':
        this.exportData();
        break;
    }
  }

  /**
   * Navigate to a specific view
   */
  navigateToView(view: ViewType): void {
    const viewUrls: Record<ViewType, string> = {
      overall: 'overall-view.html',
      browser: 'browser-view.html',
      mobile: 'mobile-view.html',
      laptop: 'laptop-view.html',
      share: 'share-stats.html'
    };

    if (viewUrls[view]) {
      // Save current state before navigation
      this.saveCurrentState();
      window.location.href = viewUrls[view];
    }
  }

  /**
   * Update view data based on current period
   */
  async updateViewData(): Promise<void> {
    try {
      const isWeek = this.currentPeriod === 'week';
      
      // Show loading state
      this.showLoadingState();
      
      // Update total time display
      this.updateTotalTime(isWeek);
      
      // Update charts
      await this.updateCharts(isWeek);
      
      // Update lists and stats
      this.updateStats(isWeek);
      
      // Update lists
      this.updateLists(isWeek);
      
      // Animate updates
      this.animateDataUpdate();
      
      // Hide loading state
      this.hideLoadingState();
      
    } catch (error) {
      console.error('Failed to update view data:', error);
      NotificationUtils.error('Failed to update data');
      this.hideLoadingState();
    }
  }

  /**
   * Update total time display
   */
  private updateTotalTime(isWeek: boolean): void {
    const totalTimeEl = document.getElementById('totalTime');
    const titleEl = document.querySelector('.total-time-card h2');
    
    if (!totalTimeEl) return;

    const data = this.getCurrentViewData();
    const time = isWeek ? data.weekTime : data.todayTime;
    const title = isWeek ? 
      `Total ${this.getViewTitle()} This Week` : 
      `Total ${this.getViewTitle()} Today`;

    // Animate time change
    AnimationUtils.animateNumberChange(totalTimeEl, time);
    
    if (titleEl) titleEl.textContent = title;
  }

  /**
   * Get current view data
   */
  private getCurrentViewData(): any {
    switch (this.currentView) {
      case 'browser':
        return DemoDataManager.getBrowserData(this.currentPeriod);
      case 'mobile':
        return DemoDataManager.getMobileData(this.currentPeriod);
      case 'laptop':
        return DemoDataManager.getLaptopData(this.currentPeriod);
      case 'overall':
        return DemoDataManager.getOverallData(this.currentPeriod);
      case 'share':
        return DemoDataManager.getShareData();
      default:
        return DemoDataManager.getOverallData(this.currentPeriod);
    }
  }

  /**
   * Get view title
   */
  private getViewTitle(): string {
    const titles: Record<ViewType, string> = {
      browser: 'Browser Time',
      mobile: 'Mobile Screen Time',
      laptop: 'Laptop Usage',
      overall: 'Digital Time',
      share: 'Screen Time'
    };
    
    return titles[this.currentView] || 'Screen Time';
  }

  /**
   * Update charts based on current view
   */
  private async updateCharts(isWeek: boolean): Promise<void> {
    const data = this.getCurrentViewData();
    
    switch (this.currentView) {
      case 'browser':
        await this.updateBrowserCharts(data, isWeek);
        break;
      case 'mobile':
        await this.updateMobileCharts(data, isWeek);
        break;
      case 'laptop':
        await this.updateLaptopCharts(data, isWeek);
        break;
      case 'overall':
        await this.updateOverallCharts(data, isWeek);
        break;
      case 'share':
        await this.updateShareCharts(data);
        break;
    }
  }

  /**
   * Update browser-specific charts
   */
  private async updateBrowserCharts(data: any, isWeek: boolean): Promise<void> {
    if (isWeek) {
      // Show weekly trend chart
      this.chartManager.createBarChart(
        'categoryChart',
        data.weeklyData.labels,
        [
          { label: 'Productive', data: data.weeklyData.productive, backgroundColor: '#4caf50' },
          { label: 'Entertainment', data: data.weeklyData.entertainment, backgroundColor: '#ff9800' },
          { label: 'Social', data: data.weeklyData.social, backgroundColor: '#2196f3' }
        ]
      );
    } else {
      // Show category pie chart
      const chartData = DemoDataManager.getCategoryChartData();
      this.chartManager.createDoughnutChart('categoryChart', chartData);
    }

    // Animate chart entrance
    this.chartManager.animateChart('categoryChart', 'slideUp');
  }

  /**
   * Update mobile-specific charts
   */
  private async updateMobileCharts(data: any, isWeek: boolean): Promise<void> {
    if (isWeek) {
      this.chartManager.createBarChart(
        'mobileChart',
        data.weeklyStats.labels,
        [
          { label: 'Screen Time (hrs)', data: data.weeklyStats.screenTime, backgroundColor: '#4a90e2' },
          { label: 'Pickups', data: data.weeklyStats.pickups, backgroundColor: '#ff9800' }
        ]
      );
    } else {
      const chartData = DemoDataManager.getMobileChartData();
      this.chartManager.createDoughnutChart('mobileChart', chartData);
    }

    this.chartManager.animateChart('mobileChart', 'scale');
  }

  /**
   * Update laptop-specific charts
   */
  private async updateLaptopCharts(data: any, isWeek: boolean): Promise<void> {
    if (isWeek) {
      this.chartManager.createBarChart(
        'laptopChart',
        data.weeklyProductivity.labels,
        [
          { label: 'Productive', data: data.weeklyProductivity.productive, backgroundColor: '#4caf50' },
          { label: 'Idle', data: data.weeklyProductivity.idle, backgroundColor: '#ff9800' }
        ]
      );
    } else {
      const chartData = DemoDataManager.getLaptopChartData();
      this.chartManager.createDoughnutChart('laptopChart', chartData);
    }

    this.chartManager.animateChart('laptopChart', 'fadeIn');
  }

  /**
   * Update overall view charts
   */
  private async updateOverallCharts(data: any, isWeek: boolean): Promise<void> {
    // Device usage chart
    const deviceChartData = DemoDataManager.getOverallChartData();
    this.chartManager.createDoughnutChart('deviceChart', deviceChartData);
    
    // Category chart
    const categoryChartData = DemoDataManager.getCategoryChartData();
    this.chartManager.createDoughnutChart('categoryChart', categoryChartData);

    // Animate both charts
    this.chartManager.animateChart('deviceChart', 'slideUp');
    this.chartManager.animateChart('categoryChart', 'scale');
  }

  /**
   * Update share view charts
   */
  private async updateShareCharts(data: any): Promise<void> {
    // Daily chart
    this.chartManager.createBarChart(
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
    this.chartManager.createDoughnutChart('categoryChart', categoryData);
  }

  /**
   * Switch browser view between category and website
   */
  private switchBrowserView(viewType: 'category' | 'website'): void {
    const chartContainer = document.getElementById('categoryChart');
    if (!chartContainer) return;

    if (viewType === 'category') {
      const chartData = DemoDataManager.getCategoryChartData();
      this.chartManager.createDoughnutChart('categoryChart', chartData);
    } else {
      // Show top websites
      const browserData = DemoDataManager.getBrowserData(this.currentPeriod);
      const websiteData = {
        labels: browserData.topSites.slice(0, 6).map(site => site.name),
        data: [25, 20, 15, 12, 10, 8],
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']
      };
      this.chartManager.createDoughnutChart('categoryChart', websiteData);
    }

    this.chartManager.animateChart('categoryChart', 'scale');
  }

  /**
   * Update statistics displays
   */
  private updateStats(isWeek: boolean): void {
    const multiplier = isWeek ? 7 : 1;
    const data = this.getCurrentViewData();
    
    // Update stat cards based on current view
    this.updateStatCards(data, multiplier);
  }

  /**
   * Update stat cards
   */
  private updateStatCards(data: any, multiplier: number): void {
    const statCards = document.querySelectorAll('.stat-card .value');
    
    switch (this.currentView) {
      case 'mobile':
        this.updateMobileStatCards(statCards, data, multiplier);
        break;
      case 'laptop':
        this.updateLaptopStatCards(statCards, data, multiplier);
        break;
      case 'overall':
        this.updateOverallStatCards(statCards, data, multiplier);
        break;
    }
  }

  /**
   * Update mobile stat cards
   */
  private updateMobileStatCards(statCards: NodeListOf<Element>, data: any, multiplier: number): void {
    if (statCards.length >= 4) {
      AnimationUtils.animateNumberChange(statCards[0] as HTMLElement, (data.pickups * multiplier).toString());
      AnimationUtils.animateNumberChange(statCards[1] as HTMLElement, data.avgSession);
      AnimationUtils.animateNumberChange(statCards[2] as HTMLElement, (data.notifications * multiplier).toString());
      AnimationUtils.animateNumberChange(statCards[3] as HTMLElement, data.mostUsed);
    }
  }

  /**
   * Update laptop stat cards
   */
  private updateLaptopStatCards(statCards: NodeListOf<Element>, data: any, multiplier: number): void {
    if (statCards.length >= 4) {
      AnimationUtils.animateNumberChange(statCards[0] as HTMLElement, TimeUtils.multiplyTimeString(data.activeTime, multiplier));
      AnimationUtils.animateNumberChange(statCards[1] as HTMLElement, TimeUtils.multiplyTimeString(data.idleTime, multiplier));
      AnimationUtils.animateNumberChange(statCards[2] as HTMLElement, data.batteryRemaining);
      AnimationUtils.animateNumberChange(statCards[3] as HTMLElement, TimeUtils.multiplyDataString(data.dataUsed, multiplier));
    }
  }

  /**
   * Update overall stat cards
   */
  private updateOverallStatCards(statCards: NodeListOf<Element>, data: any, multiplier: number): void {
    if (statCards.length >= 4) {
      AnimationUtils.animateNumberChange(statCards[0] as HTMLElement, TimeUtils.multiplyTimeString(data.devices.laptop, multiplier));
      AnimationUtils.animateNumberChange(statCards[1] as HTMLElement, TimeUtils.multiplyTimeString(data.devices.mobile, multiplier));
      AnimationUtils.animateNumberChange(statCards[2] as HTMLElement, TimeUtils.multiplyTimeString(data.devices.browser, multiplier));
      AnimationUtils.animateNumberChange(statCards[3] as HTMLElement, `${data.focusScore}%`);
    }
  }

  /**
   * Update lists
   */
  private updateLists(isWeek: boolean): void {
    const data = this.getCurrentViewData();
    
    switch (this.currentView) {
      case 'browser':
        this.updateBrowserLists(data, isWeek);
        break;
      case 'mobile':
        this.updateMobileLists(data, isWeek);
        break;
      case 'laptop':
        this.updateLaptopLists(data, isWeek);
        break;
      case 'overall':
        this.updateOverallLists(data, isWeek);
        break;
    }
  }

  /**
   * Update browser lists
   */
  private updateBrowserLists(data: any, isWeek: boolean): void {
    const listContainer = document.getElementById('dataTableContainer');
    if (!listContainer) return;

    const sites = isWeek ? 
      DemoDataManager.generateWeeklyData(data.topSites, 7) : 
      data.topSites;

    this.renderSitesList(listContainer, sites);
  }

  /**
   * Update mobile lists
   */
  private updateMobileLists(data: any, isWeek: boolean): void {
    const listContainer = document.getElementById('topAppsList');
    if (!listContainer) return;

    const apps = isWeek ? 
      DemoDataManager.generateWeeklyData(data.apps, 7) : 
      data.apps;

    this.renderAppsList(listContainer, apps);
  }

  /**
   * Update laptop lists
   */
  private updateLaptopLists(data: any, isWeek: boolean): void {
    const listContainer = document.getElementById('laptopAppsList');
    if (!listContainer) return;

    const apps = isWeek ? 
      DemoDataManager.generateWeeklyData(data.applications, 7) : 
      data.applications;

    this.renderAppsList(listContainer, apps);
  }

  /**
   * Update overall lists
   */
  private updateOverallLists(data: any, isWeek: boolean): void {
    // Update browser sites list
    const browserList = document.getElementById('overallBrowserList');
    if (browserList) {
      const sites = isWeek ? 
        DemoDataManager.generateWeeklyData(data.topSites, 7) : 
        data.topSites;
      this.renderSitesList(browserList, sites.slice(0, 3));
    }

    // Update mobile apps list
    const mobileList = document.getElementById('overallMobileList');
    if (mobileList) {
      const apps = isWeek ? 
        DemoDataManager.generateWeeklyData(data.topApps, 7) : 
        data.topApps;
      this.renderAppsList(mobileList, apps.slice(0, 3));
    }

    // Update laptop apps list
    const laptopList = document.getElementById('overallLaptopList');
    if (laptopList) {
      const laptopData = DemoDataManager.getLaptopData(this.currentPeriod);
      const apps = isWeek ? 
        DemoDataManager.generateWeeklyData(laptopData.applications, 7) : 
        laptopData.applications;
      this.renderAppsList(laptopList, apps.slice(0, 3));
    }
  }

  /**
   * Render sites list
   */
  private renderSitesList(container: HTMLElement, sites: any[]): void {
    container.innerHTML = sites.map(site => `
      <div class="app-item">
        <div class="app-info">
          <div class="app-icon">${site.favicon}</div>
          <div class="app-details">
            <h4>${site.name}</h4>
            <p>${site.category}</p>
          </div>
        </div>
        <div class="app-time">${site.time}</div>
      </div>
    `).join('');

    // Animate list items
    const items = container.querySelectorAll('.app-item');
    AnimationUtils.staggeredAnimation(
      Array.from(items) as HTMLElement[],
      AnimationUtils.slideUp,
      50
    );
  }

  /**
   * Render apps list
   */
  private renderAppsList(container: HTMLElement, apps: any[]): void {
    container.innerHTML = apps.map(app => `
      <div class="app-item">
        <div class="app-info">
          <div class="app-icon">${app.icon}</div>
          <div class="app-details">
            <h4>${app.name}</h4>
            <p>${app.category}</p>
          </div>
        </div>
        <div class="app-time">${app.time}</div>
      </div>
    `).join('');

    // Animate list items
    const items = container.querySelectorAll('.app-item');
    AnimationUtils.staggeredAnimation(
      Array.from(items) as HTMLElement[],
      AnimationUtils.slideUp,
      50
    );
  }

  /**
   * Animate data updates
   */
  private animateDataUpdate(): void {
    const elements = document.querySelectorAll('.stat-card, .chart-container, .list-card');
    AnimationUtils.staggeredAnimation(
      Array.from(elements) as HTMLElement[],
      AnimationUtils.pulse,
      50
    );
  }

  /**
   * Show loading state
   */
  private showLoadingState(): void {
    const loadingElements = document.querySelectorAll('.chart-container, .stat-card');
    loadingElements.forEach(element => {
      element.classList.add('loading');
    });
  }

  /**
   * Hide loading state
   */
  private hideLoadingState(): void {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
      element.classList.remove('loading');
    });
  }

  /**
   * Show goals modal
   */
  private showGoalsModal(): void {
    const modal = document.getElementById('goalsModal');
    if (modal) {
      modal.style.display = 'block';
      this.populateGoalsModal();
      AnimationUtils.fadeIn(modal);
    }
  }

  /**
   * Show settings modal
   */
  private showSettingsModal(): void {
    const modal = document.getElementById('settingsModal');
    if (modal) {
      modal.style.display = 'block';
      this.populateSettingsModal();
      AnimationUtils.fadeIn(modal);
    }
  }

  /**
   * Show more modal with weekly summary
   */
  private showMoreModal(): void {
    const modal = document.getElementById('moreModal');
    if (modal) {
      modal.style.display = 'block';
      this.populateMoreModal();
      AnimationUtils.fadeIn(modal);
    }
  }

  /**
   * Close all modals
   */
  private closeAllModals(): void {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      (modal as HTMLElement).style.display = 'none';
    });
  }

  /**
   * Populate goals modal with data
   */
  private populateGoalsModal(): void {
    const goalsContainer = document.querySelector('.goals-container');
    if (!goalsContainer) return;

    const goals = [
      { name: 'Social Media', actual: '1h 37m', goal: '2h', status: 'good' },
      { name: 'Entertainment', actual: '30m', goal: '1h 30m', status: 'good' },
      { name: 'Productive', actual: '1h 54m', goal: '4h', status: 'over' },
      { name: 'Games', actual: '1h 52m', goal: '2h', status: 'complete' }
    ];

    goalsContainer.innerHTML = goals.map(goal => {
      const progress = TimeUtils.calculateGoalProgress(goal.actual, goal.goal);
      const statusClass = goal.status === 'complete' ? 'progress-complete' : 
                         goal.status === 'over' ? 'progress-over' : 'progress-good';
      
      return `
        <div class="goal-item">
          <div class="goal-header">
            <span class="goal-name">${goal.name}</span>
            <span class="goal-time">${goal.actual} / ${goal.goal}</span>
          </div>
          <div class="goal-progress">
            <div class="progress-bar ${statusClass}">
              <div style="width: ${Math.min(progress, 100)}%"></div>
            </div>
            <span class="goal-percentage">${progress}%</span>
          </div>
        </div>
      `;
    }).join('');

    // Animate goal items
    const goalItems = goalsContainer.querySelectorAll('.goal-item');
    AnimationUtils.staggeredAnimation(
      Array.from(goalItems) as HTMLElement[],
      AnimationUtils.slideUp,
      100
    );
  }

  /**
   * Populate settings modal
   */
  private populateSettingsModal(): void {
    const categoriesList = document.getElementById('categoriesList');
    if (!categoriesList) return;

    const settings = DemoDataManager.getSettings();
    const categories = Object.entries(settings.categories);

    categoriesList.innerHTML = categories.map(([name, category]) => `
      <div class="category-item">
        <div class="category-color" style="background-color: ${category.color}"></div>
        <div class="category-info">
          <h4>${name}</h4>
          <p>${category.description}</p>
        </div>
        <div class="category-count">${category.examples.length} sites</div>
      </div>
    `).join('');

    NotificationUtils.info('Settings loaded successfully');
  }

  /**
   * Populate more modal with weekly charts
   */
  private populateMoreModal(): void {
    setTimeout(() => {
      // Weekly overview chart
      const weeklyData = DemoDataManager.getBrowserData().weeklyData;
      this.chartManager.createBarChart(
        'weeklyChart',
        weeklyData.labels,
        [
          { label: 'Productive', data: weeklyData.productive, backgroundColor: '#4caf50' },
          { label: 'Entertainment', data: weeklyData.entertainment, backgroundColor: '#ff9800' },
          { label: 'Social', data: weeklyData.social, backgroundColor: '#2196f3' }
        ]
      );

      // Weekly website chart
      this.chartManager.createDoughnutChart(
        'weeklyWebsiteChart',
        DemoDataManager.getCategoryChartData()
      );

      // Animate charts
      this.chartManager.animateChart('weeklyChart', 'slideUp');
      this.chartManager.animateChart('weeklyWebsiteChart', 'scale');
    }, 100);
  }

  /**
   * Refresh data
   */
  private async refreshData(): Promise<void> {
    NotificationUtils.info('Refreshing data...');
    
    try {
      await this.updateViewData();
      NotificationUtils.success('Data refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh data:', error);
      NotificationUtils.error('Failed to refresh data');
    }
  }

  /**
   * Export data
   */
  private exportData(): void {
    try {
      const data = this.getCurrentViewData();
      const exportData = {
        view: this.currentView,
        period: this.currentPeriod,
        timestamp: new Date().toISOString(),
        data
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `webtimewise-${this.currentView}-${this.currentPeriod}-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      NotificationUtils.success('Data exported successfully');
    } catch (error) {
      console.error('Failed to export data:', error);
      NotificationUtils.error('Failed to export data');
    }
  }

  /**
   * Load user preferences
   */
  private async loadUserPreferences(): Promise<void> {
    try {
      const preferences = await StorageUtils.getItem('userPreferences');
      if (preferences) {
        this.currentPeriod = preferences.timePeriod || 'today';
        // Apply other preferences
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    }
  }

  /**
   * Save current state
   */
  private saveCurrentState(): void {
    try {
      const state = {
        view: this.currentView,
        period: this.currentPeriod,
        timestamp: Date.now()
      };
      StorageUtils.setItem('currentState', state);
    } catch (error) {
      console.error('Failed to save current state:', error);
    }
  }

  /**
   * Initialize current view
   */
  private async initializeCurrentView(): Promise<void> {
    await this.updateViewData();
  }

  /**
   * Setup periodic updates
   */
  private setupPeriodicUpdates(): void {
    // Update data every 5 minutes
    setInterval(() => {
      if (!document.hidden) {
        this.refreshData();
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Set current view type
   */
  setCurrentView(view: ViewType): void {
    this.currentView = view;
  }

  /**
   * Get chart manager instance
   */
  getChartManager(): ChartManager {
    return this.chartManager;
  }

  /**
   * Get current view
   */
  getCurrentView(): ViewType {
    return this.currentView;
  }

  /**
   * Get current period
   */
  getCurrentPeriod(): TimePeriod {
    return this.currentPeriod;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.chartManager.destroyAllCharts();
    this.isInitialized = false;
  }
}