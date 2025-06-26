import { Chart, ChartConfiguration, ChartType as ChartJSType } from 'chart.js/auto';
import type { ChartData, ChartOptions, ChartDataset } from '@/types';

/**
 * Enhanced chart manager with comprehensive TypeScript support
 */
export class ChartManager {
  private charts: Map<string, Chart> = new Map();
  private static readonly DEFAULT_COLORS = [
    '#4285F4', '#34A853', '#FBBC05', '#EA4335', '#9C27B0', '#FF9800',
    '#607D8B', '#795548', '#E91E63', '#00BCD4', '#8BC34A', '#FFC107'
  ];

  private static readonly DEFAULT_CHART_OPTIONS: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8
      }
    }
  };

  /**
   * Create or update a doughnut chart
   */
  createDoughnutChart(
    canvasId: string, 
    data: ChartData, 
    options: Partial<ChartOptions> = {}
  ): Chart | null {
    const canvas = this.getCanvas(canvasId);
    if (!canvas) return null;

    this.destroyChart(canvasId);

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.data,
          backgroundColor: data.colors.length > 0 ? data.colors : this.DEFAULT_COLORS,
          borderColor: data.borderColors || 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          hoverBorderWidth: 2,
          hoverBorderColor: 'rgba(255, 255, 255, 0.3)'
        }]
      },
      options: this.mergeOptions({
        ...this.DEFAULT_CHART_OPTIONS,
        plugins: {
          ...this.DEFAULT_CHART_OPTIONS.plugins,
          legend: {
            ...this.DEFAULT_CHART_OPTIONS.plugins?.legend,
            display: true,
            position: 'right'
          },
          tooltip: {
            ...this.DEFAULT_CHART_OPTIONS.plugins?.tooltip,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value as number / total) * 100).toFixed(1);
                return `${label}: ${value}% (${percentage}% of total)`;
              }
            }
          }
        }
      }, options)
    };

    const chart = new Chart(ctx, config);
    this.charts.set(canvasId, chart);
    return chart;
  }

  /**
   * Create or update a bar chart
   */
  createBarChart(
    canvasId: string,
    labels: string[],
    datasets: ChartDataset[],
    options: Partial<ChartOptions> = {}
  ): Chart | null {
    const canvas = this.getCanvas(canvasId);
    if (!canvas) return null;

    this.destroyChart(canvasId);

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: datasets.map((dataset, index) => ({
          ...dataset,
          backgroundColor: dataset.backgroundColor || this.DEFAULT_COLORS[index % this.DEFAULT_COLORS.length],
          borderColor: dataset.borderColor || 'rgba(255, 255, 255, 0.1)',
          borderWidth: dataset.borderWidth || 1,
          borderRadius: 4,
          borderSkipped: false
        }))
      },
      options: this.mergeOptions({
        ...this.DEFAULT_CHART_OPTIONS,
        scales: {
          x: {
            ticks: { 
              color: '#ffffff',
              font: {
                family: 'Inter, sans-serif'
              }
            },
            grid: { 
              color: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }
          },
          y: {
            ticks: { 
              color: '#ffffff',
              font: {
                family: 'Inter, sans-serif'
              }
            },
            grid: { 
              color: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }
          }
        }
      }, options)
    };

    const chart = new Chart(ctx, config);
    this.charts.set(canvasId, chart);
    return chart;
  }

  /**
   * Create or update a line chart
   */
  createLineChart(
    canvasId: string,
    labels: string[],
    datasets: ChartDataset[],
    options: Partial<ChartOptions> = {}
  ): Chart | null {
    const canvas = this.getCanvas(canvasId);
    if (!canvas) return null;

    this.destroyChart(canvasId);

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: datasets.map((dataset, index) => ({
          ...dataset,
          borderColor: dataset.borderColor || this.DEFAULT_COLORS[index % this.DEFAULT_COLORS.length],
          backgroundColor: dataset.backgroundColor || `${this.DEFAULT_COLORS[index % this.DEFAULT_COLORS.length]}20`,
          fill: dataset.fill !== undefined ? dataset.fill : false,
          tension: dataset.tension || 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: dataset.borderColor || this.DEFAULT_COLORS[index % this.DEFAULT_COLORS.length],
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        }))
      },
      options: this.mergeOptions({
        ...this.DEFAULT_CHART_OPTIONS,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        scales: {
          x: {
            ticks: { 
              color: '#ffffff',
              font: {
                family: 'Inter, sans-serif'
              }
            },
            grid: { 
              color: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }
          },
          y: {
            ticks: { 
              color: '#ffffff',
              font: {
                family: 'Inter, sans-serif'
              }
            },
            grid: { 
              color: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }
          }
        }
      }, options)
    };

    const chart = new Chart(ctx, config);
    this.charts.set(canvasId, chart);
    return chart;
  }

  /**
   * Create a pie chart
   */
  createPieChart(
    canvasId: string,
    data: ChartData,
    options: Partial<ChartOptions> = {}
  ): Chart | null {
    const canvas = this.getCanvas(canvasId);
    if (!canvas) return null;

    this.destroyChart(canvasId);

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.data,
          backgroundColor: data.colors.length > 0 ? data.colors : this.DEFAULT_COLORS,
          borderColor: data.borderColors || 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1
        }]
      },
      options: this.mergeOptions(this.DEFAULT_CHART_OPTIONS, options)
    };

    const chart = new Chart(ctx, config);
    this.charts.set(canvasId, chart);
    return chart;
  }

  /**
   * Update chart data with animation
   */
  updateChart(canvasId: string, newData: Partial<ChartData>): void {
    const chart = this.charts.get(canvasId);
    if (!chart) return;

    if (newData.labels) {
      chart.data.labels = newData.labels;
    }

    if (newData.data && chart.data.datasets[0]) {
      chart.data.datasets[0].data = newData.data;
    }

    if (newData.colors && chart.data.datasets[0]) {
      (chart.data.datasets[0] as any).backgroundColor = newData.colors;
    }

    chart.update('active');
  }

  /**
   * Update chart options
   */
  updateChartOptions(canvasId: string, newOptions: Partial<ChartOptions>): void {
    const chart = this.charts.get(canvasId);
    if (!chart) return;

    chart.options = this.mergeOptions(chart.options, newOptions);
    chart.update();
  }

  /**
   * Animate chart entrance
   */
  animateChart(canvasId: string, animationType: 'fadeIn' | 'slideUp' | 'scale' = 'fadeIn'): void {
    const chart = this.charts.get(canvasId);
    if (!chart) return;

    const canvas = chart.canvas;
    
    switch (animationType) {
      case 'fadeIn':
        canvas.style.opacity = '0';
        canvas.style.transition = 'opacity 0.5s ease-in-out';
        setTimeout(() => {
          canvas.style.opacity = '1';
        }, 100);
        break;
      
      case 'slideUp':
        canvas.style.transform = 'translateY(20px)';
        canvas.style.opacity = '0';
        canvas.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        setTimeout(() => {
          canvas.style.transform = 'translateY(0)';
          canvas.style.opacity = '1';
        }, 100);
        break;
      
      case 'scale':
        canvas.style.transform = 'scale(0.8)';
        canvas.style.opacity = '0';
        canvas.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
        setTimeout(() => {
          canvas.style.transform = 'scale(1)';
          canvas.style.opacity = '1';
        }, 100);
        break;
    }
  }

  /**
   * Destroy a specific chart
   */
  destroyChart(canvasId: string): void {
    const chart = this.charts.get(canvasId);
    if (chart) {
      chart.destroy();
      this.charts.delete(canvasId);
    }
  }

  /**
   * Destroy all charts
   */
  destroyAllCharts(): void {
    this.charts.forEach(chart => chart.destroy());
    this.charts.clear();
  }

  /**
   * Get chart instance
   */
  getChart(canvasId: string): Chart | undefined {
    return this.charts.get(canvasId);
  }

  /**
   * Resize all charts
   */
  resizeAllCharts(): void {
    this.charts.forEach(chart => chart.resize());
  }

  /**
   * Export chart as image
   */
  exportChart(canvasId: string, format: 'png' | 'jpeg' = 'png'): string | null {
    const chart = this.charts.get(canvasId);
    if (!chart) return null;

    return chart.toBase64Image(`image/${format}`, 1.0);
  }

  /**
   * Get all chart IDs
   */
  getChartIds(): string[] {
    return Array.from(this.charts.keys());
  }

  /**
   * Check if chart exists
   */
  hasChart(canvasId: string): boolean {
    return this.charts.has(canvasId);
  }

  /**
   * Get canvas element
   */
  private getCanvas(canvasId: string): HTMLCanvasElement | null {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.error(`Canvas with id "${canvasId}" not found`);
      return null;
    }
    return canvas;
  }

  /**
   * Merge chart options
   */
  private mergeOptions(defaultOptions: any, customOptions: any): any {
    return {
      ...defaultOptions,
      ...customOptions,
      plugins: {
        ...defaultOptions.plugins,
        ...customOptions.plugins
      },
      scales: {
        ...defaultOptions.scales,
        ...customOptions.scales
      }
    };
  }
}