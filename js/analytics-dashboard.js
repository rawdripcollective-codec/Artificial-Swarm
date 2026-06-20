/**
 * Artificial Swarm v3 - Analytics Dashboard UI
 * Real-time metrics visualization and performance intelligence
 */

class AnalyticsDashboard {
  constructor() {
    this.container = null;
    this.updateInterval = null;
    this.observability = null;
  }

  initialize(containerElement, observability) {
    this.container = containerElement;
    this.observability = observability;
    this.render();
    this.startAutoUpdate();
  }

  startAutoUpdate(interval = 5000) {
    if (this.updateInterval) clearInterval(this.updateInterval);
    this.updateInterval = setInterval(() => this.updateDashboard(), interval);
  }

  stopAutoUpdate() {
    if (this.updateInterval) clearInterval(this.updateInterval);
  }

  updateDashboard() {
    this.render();
  }

  render() {
    if (!this.container || !this.observability) return;

    const report = this.observability.getComprehensiveReport();
    const perf = report.performanceProfile;
    const metrics = report.metrics;

    const html = `
      <div class="analytics-dashboard">
        <div class="dashboard-header">
          <h2>📊 Advanced Analytics Dashboard</h2>
          <div class="dashboard-timestamp">${new Date().toLocaleTimeString()}</div>
        </div>

        <div class="alerts-section" id="alerts-section">
          ${this._renderAlerts(report.activeAlerts)}
        </div>

        <div class="metrics-grid">
          <div class="metric-card">
            <h4>CPU Usage</h4>
            <div class="metric-display">
              <div class="metric-value">${metrics.cpu.current.toFixed(1)}%</div>
              <div class="metric-trend ${metrics.cpu.trend}">${this._getTrendIcon(metrics.cpu.trend)}</div>
            </div>
            <div class="metric-stats">
              <span>Avg: ${metrics.cpu.avg}%</span>
              <span>Max: ${metrics.cpu.max}%</span>
            </div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${metrics.cpu.current}%"></div>
            </div>
          </div>

          <div class="metric-card">
            <h4>Memory Usage</h4>
            <div class="metric-display">
              <div class="metric-value">${metrics.memory.current.toFixed(1)}%</div>
              <div class="metric-trend ${metrics.memory.trend}">${this._getTrendIcon(metrics.memory.trend)}</div>
            </div>
            <div class="metric-stats">
              <span>Avg: ${metrics.memory.avg}%</span>
              <span>Max: ${metrics.memory.max}%</span>
            </div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${metrics.memory.current}%"></div>
            </div>
          </div>

          <div class="metric-card">
            <h4>API Latency</h4>
            <div class="metric-display">
              <div class="metric-value">${metrics.apiLatency.current.toFixed(0)}ms</div>
              <div class="metric-trend ${metrics.apiLatency.trend}">${this._getTrendIcon(metrics.apiLatency.trend)}</div>
            </div>
            <div class="metric-stats">
              <span>Avg: ${metrics.apiLatency.avg}ms</span>
              <span>Max: ${metrics.apiLatency.max}ms</span>
            </div>
            <div class="metric-bar">
              <div class="metric-fill" style="width: ${Math.min(100, (metrics.apiLatency.current / 5000) * 100)}%"></div>
            </div>
          </div>

          <div class="metric-card">
            <h4>Throughput</h4>
            <div class="metric-display">
              <div class="metric-value">${metrics.throughput.avg}</div>
              <div class="metric-label">tasks/sec</div>
              <div class="metric-trend ${metrics.throughput.trend}">${this._getTrendIcon(metrics.throughput.trend)}</div>
            </div>
          </div>

          <div class="metric-card">
            <h4>Cost Per Hour</h4>
            <div class="metric-display">
              <div class="metric-value">$${metrics.costPerHour}</div>
            </div>
          </div>

          <div class="metric-card">
            <h4>System Health</h4>
            <div class="metric-display">
              <div class="health-indicator">${report.health.healthIndicator}</div>
              <div class="health-status">${report.health.swarmHealth.toUpperCase()}</div>
            </div>
          </div>
        </div>

        <div class="performance-profile">
          <h3>⚙️ Performance Profile</h3>
          <div class="profile-grid">
            <div class="profile-item">
              <span class="label">Error Rate:</span>
              <span class="value">${report.health.errorRate}%</span>
            </div>
            <div class="profile-item">
              <span class="label">Avg Latency:</span>
              <span class="value">${report.health.averageLatency}ms</span>
            </div>
            <div class="profile-item">
              <span class="label">CPU Trend:</span>
              <span class="value trend">${perf.cpuTrend}</span>
            </div>
            <div class="profile-item">
              <span class="label">Memory Trend:</span>
              <span class="value trend">${perf.memoryTrend}</span>
            </div>
            <div class="profile-item">
              <span class="label">API Trend:</span>
              <span class="value trend">${perf.latencyTrend}</span>
            </div>
            <div class="profile-item">
              <span class="label">Throughput Trend:</span>
              <span class="value trend">${perf.throughputTrend}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }

  _renderAlerts(alerts) {
    if (alerts.length === 0) {
      return '<div class="no-alerts">✅ All systems operational</div>';
    }

    const severityIcons = {
      'info': 'ℹ️',
      'warning': '⚠️',
      'critical': '🚨'
    };

    return `
      <div class="alerts-list">
        ${alerts.map(alert => `
          <div class="alert alert-${alert.severity}">
            <span class="alert-icon">${severityIcons[alert.severity] || '⚠️'}</span>
            <span class="alert-message">${alert.message}</span>
            <span class="alert-time">${alert.timestamp.split('T')[1].split('.')[0]}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  _getTrendIcon(trend) {
    const icons = {
      'increasing': '📈',
      'decreasing': '📉',
      'stable': '➡️'
    };
    return icons[trend] || '➡️';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AnalyticsDashboard };
}