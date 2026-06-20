/**
 * Artificial Swarm v3 - Mission Command Center UI
 * Advanced dashboard for swarm operations monitoring and control
 */

class MissionCommandCenter {
  constructor() {
    this.container = null;
    this.stats = {
      activeVentures: 0,
      agentsRunning: 0,
      tasksRunning: 0,
      monthlyRevenue: 0
    };
  }

  initialize(containerElement) {
    this.container = containerElement;
    this.render();
  }

  updateStats(stats) {
    this.stats = { ...this.stats, ...stats };
    this.render();
  }

  render() {
    if (!this.container) return;
    
    const html = `
      <div class="command-center">
        <div class="command-header">
          <h2>🎖️ MISSION COMMAND CENTER</h2>
          <div class="timestamp">${new Date().toLocaleTimeString()}</div>
        </div>
        
        <div class="global-status-panel">
          <div class="status-card">
            <div class="status-value">${this.stats.activeVentures}</div>
            <div class="status-label">Active Ventures</div>
          </div>
          <div class="status-card">
            <div class="status-value">${this.stats.agentsRunning}</div>
            <div class="status-label">Agents Running</div>
          </div>
          <div class="status-card">
            <div class="status-value">${this.stats.tasksRunning}</div>
            <div class="status-label">Tasks Running</div>
          </div>
          <div class="status-card">
            <div class="status-value">\$${this.stats.monthlyRevenue.toLocaleString()}</div>
            <div class="status-label">Monthly Revenue</div>
          </div>
        </div>
        
        <div class="command-grid">
          <div class="mission-graph-container">
            <h3>📊 Mission Graph</h3>
            <canvas id="workflow-canvas" width="400" height="300"></canvas>
          </div>
          
          <div class="health-panel">
            <h3>🏥 Swarm Health</h3>
            <div id="health-indicator" class="health-indicator">🟢</div>
            <div class="health-metrics">
              <div>Error Rate: <span id="error-rate">0%</span></div>
              <div>Avg Latency: <span id="avg-latency">0ms</span></div>
              <div>CPU Usage: <span id="cpu-usage">0%</span></div>
            </div>
          </div>
        </div>
        
        <div class="activity-feed-container">
          <h3>📡 Agent Activity Feed</h3>
          <div class="activity-feed" id="activity-feed">
            <div class="no-activity">Awaiting activity...</div>
          </div>
        </div>
      </div>
    `;
    
    this.container.innerHTML = html;
  }

  updateActivityFeed(activities) {
    const feedElement = document.getElementById('activity-feed');
    if (!feedElement) return;
    
    if (activities.length === 0) {
      feedElement.innerHTML = '<div class="no-activity">Awaiting activity...</div>';
      return;
    }
    
    const html = activities.map(activity => `
      <div class="activity-entry">
        <span class="activity-time">${activity.timestamp}</span>
        <span class="activity-agent">${activity.agentId}</span>
        <span class="activity-action">${activity.action}</span>
      </div>
    `).join('');
    
    feedElement.innerHTML = html;
  }

  updateHealth(observability) {
    const data = observability.export();
    const healthElement = document.getElementById('health-indicator');
    const errorRateElement = document.getElementById('error-rate');
    const latencyElement = document.getElementById('avg-latency');
    const cpuElement = document.getElementById('cpu-usage');
    
    if (healthElement) healthElement.textContent = data.healthIndicator;
    if (errorRateElement) errorRateElement.textContent = `${data.errorRate}%`;
    if (latencyElement) latencyElement.textContent = `${data.averageLatency}ms`;
    if (cpuElement) cpuElement.textContent = `${data.metrics.cpuUsage.toFixed(1)}%`;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MissionCommandCenter };
}