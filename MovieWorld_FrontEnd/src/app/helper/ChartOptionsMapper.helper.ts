import { ChartConfiguration } from "chart.js";

export class ChartOptionsMapper {
  
  public static updatePieTheme(options: ChartConfiguration['options'], textColor: string): ChartConfiguration['options'] {
    return {
      ...options,
      plugins: {
        ...options?.plugins,
        legend: {
          ...options?.plugins?.legend,
          labels: {
            ...options?.plugins?.legend?.labels,
            color: textColor
          }
        }
      }
    };
  }

  public static updateBarLineScalesTheme(options: ChartConfiguration['options'], textColor: string, isDark: boolean): ChartConfiguration['options'] {
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    
    return {
      ...options,
      plugins: {
        ...options?.plugins,
        legend: {
          ...options?.plugins?.legend,
          labels: { ...options?.plugins?.legend?.labels, color: textColor }
        }
      },
      scales: {
        y: {
          ...options?.scales?.['y'],
          ticks: { ...options?.scales?.['y']?.ticks, color: textColor },
          grid: { color: gridColor }
        },
        x: {
          ...options?.scales?.['x'],
          ticks: { ...options?.scales?.['x']?.ticks, color: textColor },
          grid: { display: false }
        }
      }
    };
  }

  public static getPieChartOptions(): ChartConfiguration['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 14, weight: 'bold' },
            padding: 20
          }
        }
      }
    }
  }

  public static getLineBarChartOptions(): ChartConfiguration['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            font: { size: 14 }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { font: { size: 12 } }
        },
        x: {
          ticks: { 
            font: { size: 12 },
            maxRotation: 45,
            minRotation: 45 
          },
          grid: { display: false }
        }
      }
    }
  }
}