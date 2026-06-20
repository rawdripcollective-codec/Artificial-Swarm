/**
 * Artificial Swarm v3 - Advanced Observability Dashboard
 * Real-time metrics, performance analytics, and system intelligence
 */

class AdvancedObservability {
  constructor() {
    this.base = new ObservabilitySystem();
    this.metrics = {
      cpu: [],
      memory: [],
      tokenUsage: [],
      apiLatency: [],
      costPerHour: [],
      throughput: []
    };
    this.alerts = [];
    this.performanceProfile = {};
    this.trendAnalysis = {};
  }

  recordCPUMetric(usage) {
    this.metrics.cpu.push({
      value: usage,
      timestamp: Date.now()
    });
    this._maintainMetricWindow('cpu');
  }

  recordMemoryMetric(usage) {
    this.metrics.memory.push({
      value: usage,
      timestamp: Date.now()
    });
    this._maintainMetricWindow('memory');
  }

  recordTokenUsage(tokens) {
    this.metrics.tokenUsage.push({
      value: tokens,
      timestamp: Date.now()
    });
    this._maintainMetricWindow('tokenUsage');
  }

  recordAPILatency(duration) {
    this.metrics.apiLatency.push({
      value: duration,
      timestamp: Date.now()
    });
    this._maintainMetricWindow('apiLatency');
  }

  recordCostPerHour(cost) {
    this.metrics.costPerHour.push({
      value: cost,
      timestamp: Date.now()
    });
    this._maintainMetricWindow('costPerHour');
  }

  recordThroughput(tasksPerSecond) {
    this.metrics.throughput.push({
      value: tasksPerSecond,
      timestamp: Date.now()
    });
    this._maintainMetricWindow('throughput');
  }

  _maintainMetricWindow(metricName, windowSize = 300) {
    if (this.metrics[metricName].length > windowSize) {
      this.metrics[metricName] = this.metrics[metricName].slice(-windowSize);
    }
  }

  getMetricTrend(metricName) {
    const data = this.metrics[metricName] || [];
    if (data.length < 2) return 'stable';

    const recent = data.slice(-10);
    const older = data.slice(-20, -10);

    const recentAvg = recent.reduce((sum, m) => sum + m.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + m.value, 0) / older.length;

    const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (changePercent > 10) return 'increasing';
    if (changePercent < -10) return 'decreasing';
    return 'stable';
  }

  getAverageMetric(metricName) {
    const data = this.metrics[metricName] || [];
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, m) => acc + m.value, 0);
    return (sum / data.length).toFixed(2);
  }

  getMaxMetric(metricName) {
    const data = this.metrics[metricName] || [];
    if (data.length === 0) return 0;
    return Math.max(...data.map(m => m.value)).toFixed(2);
  }

  getMinMetric(metricName) {
    const data = this.metrics[metricName] || [];
    if (data.length === 0) return 0;
    return Math.min(...data.map(m => m.value)).toFixed(2);
  }

  createAlert(severity, message, details) {
    const alert = {
      id: `alert_${Date.now()}`,
      severity,
      message,
      details,
      timestamp: new Date().toISOString(),
      acknowledged: false
    };
    this.alerts.push(alert);
    return alert.id;
  }

  getActiveAlerts() {
    return this.alerts.filter(a => !a.acknowledged);
  }

  acknowledgeAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) alert.acknowledged = true;
  }

  analyzePerformance() {
    const cpuTrend = this.getMetricTrend('cpu');
    const memoryTrend = this.getMetricTrend('memory');
    const latencyTrend = this.getMetricTrend('apiLatency');
    const throughputTrend = this.getMetricTrend('throughput');

    this.performanceProfile = {
      cpuAvg: this.getAverageMetric('cpu'),
      cpuMax: this.getMaxMetric('cpu'),
      cpuTrend,
      memoryAvg: this.getAverageMetric('memory'),
      memoryMax: this.getMaxMetric('memory'),
      memoryTrend,
      latencyAvg: this.getAverageMetric('apiLatency'),
      latencyMax: this.getMaxMetric('apiLatency'),
      latencyTrend,
      throughputAvg: this.getAverageMetric('throughput'),
      throughputTrend,
      costPerHourAvg: this.getAverageMetric('costPerHour')
    };

    if (parseFloat(this.performanceProfile.cpuAvg) > 80) {
      this.createAlert('warning', 'High CPU Usage', { value: this.performanceProfile.cpuAvg });
    }
    if (parseFloat(this.performanceProfile.latencyAvg) > 2000) {
      this.createAlert('warning', 'High API Latency', { value: this.performanceProfile.latencyAvg });
    }

    return this.performanceProfile;
  }

  getComprehensiveReport() {
    return {
      timestamp: new Date().toISOString(),
      health: this.base.export(),
      performanceProfile: this.analyzePerformance(),
      activeAlerts: this.getActiveAlerts(),
      metrics: {
        cpu: {
          current: this.metrics.cpu.length > 0 ? this.metrics.cpu[this.metrics.cpu.length - 1].value : 0,
          avg: this.getAverageMetric('cpu'),
          max: this.getMaxMetric('cpu'),
          trend: this.getMetricTrend('cpu')
        },
        memory: {
          current: this.metrics.memory.length > 0 ? this.metrics.memory[this.metrics.memory.length - 1].value : 0,
          avg: this.getAverageMetric('memory'),
          max: this.getMaxMetric('memory'),
          trend: this.getMetricTrend('memory')
        },
        apiLatency: {
          current: this.metrics.apiLatency.length > 0 ? this.metrics.apiLatency[this.metrics.apiLatency.length - 1].value : 0,
          avg: this.getAverageMetric('apiLatency'),
          max: this.getMaxMetric('apiLatency'),
          trend: this.getMetricTrend('apiLatency')
        },
        throughput: {
          avg: this.getAverageMetric('throughput'),
          trend: this.getMetricTrend('throughput')
        },
        costPerHour: this.getAverageMetric('costPerHour')
      }
    };
  }

  exportMetrics() {
    return this.getComprehensiveReport();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AdvancedObservability };
}