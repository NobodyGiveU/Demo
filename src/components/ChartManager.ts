import { Chart, ChartConfiguration, ChartType as ChartJSType } from 'chart.js/auto';
import type { ChartData } from '../types';

/**
 * Enhanced chart manager with TypeScript support and animations
 */
export class ChartManager {
  private charts: Map<string, Chart> = new Map();
  private static readonly DEFAULT_COLORS = [
    '#4285F4', '#34A853', '#FBBC05', '#EA4335', '#9C27B0', '#FF9800',
    '#607D8B', '#795548', '#E91E63', '#00BCD4', '#8BC34A', '#FFC107'
  ];

  /**
   * Create or update a doughnut chart
   */
  createDoughnutChart(
    canvasId: string, 
    data: ChartData, 
    options: Partial<ChartConfiguration['options']> = {}
  ): Chart | null {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.error(`Canvas with id "${canvasId}" not found`);
      return null;
    }

    // Destroy existing chart
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
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          hoverBorderWidth: 2,
          hoverBorderColor: 'rgba(255, 255, 255, 0.3)'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              color: '#ffffff',
              boxWidth: 15,
              padding: 20,
              font: {
                size: 12,
                family: 'Inter, sans-serif'
              },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
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
        },
        ...options
      }
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
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
    }>,
    options: Partial<ChartConfiguration['options']> = {}
  ): Chart | null {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.error(`Canvas with id "${canvasId}" not found`);
      return null;
    }

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
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
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
        },
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
              font: {
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
        },
        ...options
      }
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
    datasets: Array<{
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      fill?: boolean;
    }>,
    options: Partial<ChartConfiguration['options']> = {}
  ): Chart | null {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.error(`Canvas with id "${canvasId}" not found`);
      return null;
    }

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
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: dataset.borderColor || this.DEFAULT_COLORS[index % this.DEFAULT_COLORS.length],
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        },
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
        },
        plugins: {
          legend: {
            labels: {
              color: '#ffffff',
              font: {
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
        },
        ...options
      }
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
}