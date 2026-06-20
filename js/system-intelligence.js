/**
 * Artificial Swarm v3 - System Intelligence Engine
 * Predictive analytics, anomaly detection, and optimization recommendations
 */

class SystemIntelligence {
  constructor() {
    this.baseline = null;
    this.anomalies = [];
    this.recommendations = [];
    this.predictions = [];
  }

  setBaseline(metrics) {
    this.baseline = {
      cpuAvg: metrics.cpuAvg,
      memoryAvg: metrics.memoryAvg,
      latencyAvg: metrics.latencyAvg,
      throughputAvg: metrics.throughputAvg,
      errorRateAvg: metrics.errorRateAvg
    };
  }

  detectAnomalies(currentMetrics) {
    if (!this.baseline) return [];

    const anomalies = [];
    const threshold = 1.5;

    if (currentMetrics.cpuAvg > this.baseline.cpuAvg * threshold) {
      anomalies.push({
        type: 'cpu_spike',
        severity: 'warning',
        message: 'Unusual CPU spike detected',
        value: currentMetrics.cpuAvg,
        baseline: this.baseline.cpuAvg
      });
    }

    if (currentMetrics.latencyAvg > this.baseline.latencyAvg * threshold) {
      anomalies.push({
        type: 'latency_spike',
        severity: 'warning',
        message: 'API latency significantly increased',
        value: currentMetrics.latencyAvg,
        baseline: this.baseline.latencyAvg
      });
    }

    if (currentMetrics.errorRateAvg > this.baseline.errorRateAvg * 2) {
      anomalies.push({
        type: 'error_rate_increase',
        severity: 'critical',
        message: 'Error rate doubled',
        value: currentMetrics.errorRateAvg,
        baseline: this.baseline.errorRateAvg
      });
    }

    if (currentMetrics.throughputAvg < this.baseline.throughputAvg * 0.7) {
      anomalies.push({
        type: 'throughput_decrease',
        severity: 'warning',
        message: 'System throughput decreased',
        value: currentMetrics.throughputAvg,
        baseline: this.baseline.throughputAvg
      });
    }

    this.anomalies = anomalies;
    return anomalies;
  }

  generateRecommendations(metrics, performance) {
    const recommendations = [];

    if (metrics.cpuAvg > 75) {
      recommendations.push({
        category: 'cpu',
        priority: 'high',
        action: 'Increase concurrent worker capacity',
        expectedImprovement: '20-30% reduction in processing time'
      });
    }

    if (metrics.memoryAvg > 80) {
      recommendations.push({
        category: 'memory',
        priority: 'high',
        action: 'Optimize memory cache policies',
        expectedImprovement: '15-25% reduction in memory usage'
      });
    }

    if (metrics.latencyAvg > 1000) {
      recommendations.push({
        category: 'latency',
        priority: 'medium',
        action: 'Implement request batching and caching',
        expectedImprovement: '30-50% reduction in API latency'
      });
    }

    if (metrics.errorRate > 5) {
      recommendations.push({
        category: 'reliability',
        priority: 'high',
        action: 'Increase retry logic and error handling',
        expectedImprovement: '50%+ improvement in task success rate'
      });
    }

    if (performance.throughputTrend === 'decreasing') {
      recommendations.push({
        category: 'throughput',
        priority: 'medium',
        action: 'Scale horizontal resources and optimize task distribution',
        expectedImprovement: '25-40% increase in tasks/second'
      });
    }

    this.recommendations = recommendations;
    return recommendations;
  }

  predictResourceNeeds(historicalMetrics, timeWindow = 60) {
    if (historicalMetrics.length < 2) return null;

    const predictions = {};
    const metricTypes = ['cpu', 'memory', 'apiLatency'];

    metricTypes.forEach(metricType => {
      const values = historicalMetrics.map(m => m[metricType] || 0);
      const n = values.length;
      
      const sumX = (n * (n + 1)) / 2;
      const sumY = values.reduce((a, b) => a + b, 0);
      const sumXY = values.reduce((sum, v, i) => sum + (i + 1) * v, 0);
      const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6;

      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      predictions[metricType] = {
        current: values[values.length - 1],
        predictedIn5Min: intercept + slope * (n + 5),
        trend: slope > 0 ? 'increasing' : 'decreasing',
        confidenceLevel: 0.85
      };
    });

    this.predictions = predictions;
    return predictions;
  }

  getIntelligenceReport() {
    return {
      timestamp: new Date().toISOString(),
      anomalies: this.anomalies,
      recommendations: this.recommendations,
      predictions: this.predictions,
      baseline: this.baseline
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SystemIntelligence };
}