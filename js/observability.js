/**
 * Artificial Swarm v3 - Observability System
 * Live metrics, health monitoring, and agent activity tracking
 */

class ObservabilitySystem {
  constructor() {
    this.metrics = {
      cpuUsage: 0,
      tokenUsage: 0,
      apiCalls: 0,
      costAccumulated: 0,
      tasksRunning: 0,
      tasksCompleted: 0
    };
    this.swarmHealth = 'healthy';
    this.healthHistory = [];
    this.activityFeed = [];
    this.errorRate = 0;
    this.taskLatency = [];
    this.retryCount = 0;
  }

  recordMetric(name, value) {
    if (this.metrics.hasOwnProperty(name)) {
      this.metrics[name] = value;
    }
    this.updateHealth();
  }

  recordActivity(agentId, action, details = {}) {
    const timestamp = new Date().toLocaleTimeString();
    const activity = {
      timestamp,
      agentId,
      action,
      details
    };
    this.activityFeed.push(activity);
    
    // Keep recent activity
    if (this.activityFeed.length > 100) {
      this.activityFeed.shift();
    }
    
    return activity;
  }

  recordLatency(duration) {
    this.taskLatency.push(duration);
    if (this.taskLatency.length > 100) {
      this.taskLatency.shift();
    }
  }

  recordError() {
    this.retryCount++;
    this.errorRate = (this.retryCount / Math.max(1, this.metrics.tasksCompleted + this.retryCount)) * 100;
    this.updateHealth();
  }

  getAverageLatency() {
    if (this.taskLatency.length === 0) return 0;
    const sum = this.taskLatency.reduce((a, b) => a + b, 0);
    return (sum / this.taskLatency.length).toFixed(2);
  }

  updateHealth() {
    const avgLatency = parseFloat(this.getAverageLatency());
    
    if (this.errorRate > 20 || this.metrics.cpuUsage > 90 || avgLatency > 5000) {
      this.swarmHealth = 'failure';
    } else if (this.errorRate > 10 || this.metrics.cpuUsage > 70 || avgLatency > 3000) {
      this.swarmHealth = 'degraded';
    } else {
      this.swarmHealth = 'healthy';
    }
    
    this.healthHistory.push({
      timestamp: new Date().toISOString(),
      status: this.swarmHealth
    });
  }

  getHealthIndicator() {
    const indicators = {
      'healthy': '🟢',
      'degraded': '🟡',
      'failure': '🔴'
    };
    return indicators[this.swarmHealth] || '⚪';
  }

  getRecentActivity(count = 10) {
    return this.activityFeed.slice(-count).reverse();
  }

  export() {
    return {
      metrics: this.metrics,
      swarmHealth: this.swarmHealth,
      healthIndicator: this.getHealthIndicator(),
      errorRate: this.errorRate.toFixed(2),
      averageLatency: this.getAverageLatency(),
      activityFeedLength: this.activityFeed.length,
      retryCount: this.retryCount
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ObservabilitySystem };
}