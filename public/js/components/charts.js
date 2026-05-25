/**
 * NetPolix Charts Wrapper
 * Simplified Chart.js wrapper for dashboard charts
 * Requires Chart.js loaded via CDN
 */
const ChartManager = {
  defaultColors: {
    blue: 'rgba(0, 212, 255, 1)',
    blueLight: 'rgba(0, 212, 255, 0.2)',
    red: 'rgba(255, 0, 84, 1)',
    redLight: 'rgba(255, 0, 84, 0.2)',
    green: 'rgba(0, 255, 136, 1)',
    greenLight: 'rgba(0, 255, 136, 0.2)',
    yellow: 'rgba(255, 184, 0, 1)',
    yellowLight: 'rgba(255, 184, 0, 0.2)',
    purple: 'rgba(168, 85, 247, 1)',
    purpleLight: 'rgba(168, 85, 247, 0.2)',
  },

  palette: [
    'rgba(0, 212, 255, 0.8)',
    'rgba(255, 0, 84, 0.8)',
    'rgba(0, 255, 136, 0.8)',
    'rgba(255, 184, 0, 0.8)',
    'rgba(168, 85, 247, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(34, 211, 238, 0.8)',
    'rgba(251, 146, 60, 0.8)',
    'rgba(163, 230, 53, 0.8)',
    'rgba(244, 114, 182, 0.8)',
  ],

  getDefaultOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#8892A8',
            font: { family: "'Inter', sans-serif", size: 12 },
            padding: 16,
            usePointStyle: true,
            pointStyleWidth: 8,
          }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleColor: '#F0F4FF',
          bodyColor: '#8892A8',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          titleFont: { family: "'Inter', sans-serif", weight: '600' },
          bodyFont: { family: "'Inter', sans-serif" },
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.04)', drawBorder: false },
          ticks: { color: '#5A6478', font: { family: "'Inter', sans-serif", size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.04)', drawBorder: false },
          ticks: { color: '#5A6478', font: { family: "'Inter', sans-serif", size: 11 } }
        }
      }
    };
  },

  createBarChart(canvasId, labels, datasets, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const defaultOpts = this.getDefaultOptions();
    const mergedOpts = this.mergeDeep(defaultOpts, options);

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: datasets.map((ds, i) => ({
          backgroundColor: ds.backgroundColor || this.palette[i % this.palette.length],
          borderColor: ds.borderColor || 'transparent',
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.7,
          ...ds
        }))
      },
      options: mergedOpts
    });
  },

  createLineChart(canvasId, labels, datasets, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const defaultOpts = this.getDefaultOptions();
    const mergedOpts = this.mergeDeep(defaultOpts, options);

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: datasets.map((ds, i) => ({
          borderColor: ds.borderColor || this.palette[i % this.palette.length],
          backgroundColor: ds.backgroundColor || this.palette[i % this.palette.length].replace('0.8', '0.1'),
          fill: ds.fill !== undefined ? ds.fill : true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: ds.borderColor || this.palette[i % this.palette.length],
          pointBorderColor: '#0A0E17',
          pointBorderWidth: 2,
          borderWidth: 2,
          ...ds
        }))
      },
      options: mergedOpts
    });
  },

  createDoughnutChart(canvasId, labels, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const doughnutOpts = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#8892A8',
            font: { family: "'Inter', sans-serif", size: 12 },
            padding: 16,
            usePointStyle: true,
          }
        },
        tooltip: {
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleColor: '#F0F4FF',
          bodyColor: '#8892A8',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
        }
      }
    };

    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: this.palette.slice(0, data.length),
          borderColor: '#0A0E17',
          borderWidth: 2,
          hoverOffset: 8,
          ...options.datasetOptions
        }]
      },
      options: this.mergeDeep(doughnutOpts, options)
    });
  },

  createHorizontalBarChart(canvasId, labels, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    const defaultOpts = this.getDefaultOptions();
    defaultOpts.indexAxis = 'y';
    const mergedOpts = this.mergeDeep(defaultOpts, options);

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: this.palette.slice(0, data.length),
          borderColor: 'transparent',
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.6,
          ...options.datasetOptions
        }]
      },
      options: mergedOpts
    });
  },

  // Deep merge helper
  mergeDeep(target, source) {
    const output = Object.assign({}, target);
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) Object.assign(output, { [key]: source[key] });
          else output[key] = this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  },

  isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }
};

window.ChartManager = ChartManager;
