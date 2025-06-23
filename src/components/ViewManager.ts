import type { ViewType, TimePeriod } from '../types';
import { DemoDataManager } from '../data/demoData';
import { ChartManager } from './ChartManager';
import { AnimationUtils } from '../utils/animationUtils';
import { NotificationUtils } from '../utils/notificationUtils';
import { TimeUtils } from '../utils/timeUtils';

/**
 * Enhanced view manager with TypeScript support and improved functionality
 */
export class ViewManager {
  private chartManager: ChartManager;
  private currentView: ViewType = 'overall';
  private currentPeriod: TimePeriod = 'today';

  constructor() {
    this.chartManager = new ChartManager();
    this.initializeEventListeners();
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

      // Add ripple effect to buttons
      if (target.tagName === 'BUTTON' || target.classList.contains('btn')) {
        AnimationUtils.createRipple(event as MouseEvent, target);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
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
        }
      }
    });

    // Window resize handler
    window.addEventListener('resize', () => {
      this.chartManager.resizeAllCharts();
    });
  }

  /**
   * Handle time period change
   */
  private handleTimePeriodChange(button: HTMLElement): void {
    const period = button.id === 'weekBtn' ? 'week' : 'today';
    
    // Update button states
    document.querySelectorAll('.time-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');

    this.currentPeriod = period;
    this.updateViewData();
    
    NotificationUtils.info(`Switched to ${period === 'week' ? 'weekly' : 'daily'} view`);
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
      window.location.href = viewUrls[view];
    }
  }

  /**
   * Update view data based on current period
   */
  updateViewData(): void {
    const isWeek = this.currentPeriod === 'week';
    
    // Update total time display
    this.updateTotalTime(isWeek);
    
    // Update charts
    this.updateCharts(isWeek);
    
    // Update lists and stats
    this.updateStats(isWeek);
    
    // Animate updates
    this.animateDataUpdate();
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

    totalTimeEl.textContent = time;
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
  private updateCharts(isWeek: boolean): void {
    const data = this.getCurrentViewData();
    
    switch (this.currentView) {
      case 'browser':
        this.updateBrowserCharts(data, isWeek);
        break;
      case 'mobile':
        this.updateMobileCharts(data, isWeek);
        break;
      case 'laptop':
        this.updateLaptopCharts(data, isWeek);
        break;
      case 'overall':
        this.updateOverallCharts(data, isWeek);
        break;
    }
  }

  /**
   * Update browser-specific charts
   */
  private updateBrowserCharts(data: any, isWeek: boolean): void {
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
  }

  /**
   * Update mobile-specific charts
   */
  private updateMobileCharts(data: any, isWeek: boolean): void {
    if (isWeek) {
      this.chartManager.createBarChart(
        'mobileChart',
        data.weeklyStats.labels,
        [{ label: 'Screen Time (hrs)', data: data.weeklyStats.screenTime, backgroundColor: '#4a90e2' }]
      );
    } else {
      const chartData = DemoDataManager.getMobileChartData();
      this.chartManager.createDoughnutChart('mobileChart', chartData);
    }
  }

  /**
   * Update laptop-specific charts
   */
  private updateLaptopCharts(data: any, isWeek: boolean): void {
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
  }

  /**
   * Update overall view charts
   */
  private updateOverallCharts(data: any, isWeek: boolean): void {
    // Device usage chart
    const deviceChartData = DemoDataManager.getOverallChartData();
    this.chartManager.createDoughnutChart('deviceChart', deviceChartData);
    
    // Category chart
    const categoryChartData = DemoDataManager.getCategoryChartData();
    this.chartManager.createDoughnutChart('categoryChart', categoryChartData);
  }

  /**
   * Update statistics displays
   */
  private updateStats(isWeek: boolean): void {
    const multiplier = isWeek ? 7 : 1;
    const data = this.getCurrentViewData();
    
    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card .value');
    
    if (this.currentView === 'mobile' && statCards.length >= 4) {
      const mobileData = data as any;
      statCards[0].textContent = (mobileData.pickups * multiplier).toString();
      statCards[1].textContent = mobileData.avgSession;
      statCards[2].textContent = (mobileData.notifications * multiplier).toString();
      statCards[3].textContent = mobileData.mostUsed;
    }
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
   * Show goals modal
   */
  private showGoalsModal(): void {
    const modal = document.getElementById('goalsModal');
    if (modal) {
      modal.style.display = 'block';
      this.populateGoalsModal();
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
    }
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
  }

  /**
   * Populate settings modal
   */
  private populateSettingsModal(): void {
    // Implementation for settings modal
    NotificationUtils.info('Settings modal opened');
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
    }, 100);
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
}