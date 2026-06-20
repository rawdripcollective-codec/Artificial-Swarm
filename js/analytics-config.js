/**
 * Artificial Swarm v3 - Comprehensive Analytics Configuration
 * Integration guide for Phase 4-5 analytics and persistence
 */

const ANALYTICS_STYLES = `
  .analytics-dashboard {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background: var(--card-bg);
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border);
  }

  .dashboard-header h2 {
    margin: 0;
    color: var(--accent-primary);
    font-size: 1.4rem;
  }

  .dashboard-timestamp {
    font-size: 0.8rem;
    color: var(--text-dim);
  }

  .alerts-section {
    margin-bottom: 20px;
  }

  .alerts-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .alert {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    border-left: 4px solid;
    font-size: 0.85rem;
  }

  .alert-info {
    background: rgba(0, 242, 255, 0.1);
    border-left-color: var(--accent-primary);
  }

  .alert-warning {
    background: rgba(255, 170, 0, 0.1);
    border-left-color: var(--warning);
  }

  .alert-critical {
    background: rgba(255, 68, 68, 0.1);
    border-left-color: var(--danger);
  }

  .alert-icon {
    font-size: 1.2rem;
  }

  .alert-message {
    flex: 1;
    color: var(--text-main);
  }

  .alert-time {
    color: var(--text-dim);
    font-size: 0.75rem;
  }

  .no-alerts {
    text-align: center;
    padding: 20px;
    color: var(--success);
    font-weight: bold;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }

  .metric-card {
    background: var(--glass);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .metric-card h4 {
    margin: 0;
    color: var(--accent-primary);
    font-size: 0.9rem;
  }

  .metric-display {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .metric-value {
    font-size: 1.8rem;
    font-weight: bold;
    color: var(--accent-primary);
  }

  .metric-label {
    font-size: 0.75rem;
    color: var(--text-dim);
  }

  .metric-trend {
    font-size: 1.2rem;
  }

  .metric-trend.increasing {
    color: var(--warning);
  }

  .metric-trend.decreasing {
    color: var(--success);
  }

  .metric-trend.stable {
    color: var(--text-dim);
  }

  .metric-stats {
    display: flex;
    gap: 10px;
    font-size: 0.75rem;
    color: var(--text-dim);
  }

  .metric-bar {
    height: 4px;
    background: var(--border);
    border-radius: 2px;
    overflow: hidden;
  }

  .metric-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
    border-radius: 2px;
  }

  .health-indicator {
    font-size: 2.5rem;
    text-align: center;
  }

  .health-status {
    text-align: center;
    font-size: 0.8rem;
    color: var(--accent-primary);
    font-weight: bold;
    margin-top: 5px;
  }

  .performance-profile {
    background: var(--glass);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 15px;
  }

  .performance-profile h3 {
    margin-top: 0;
    color: var(--accent-primary);
  }

  .profile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }

  .profile-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 0.85rem;
  }

  .profile-item .label {
    color: var(--text-dim);
    text-transform: uppercase;
    font-size: 0.7rem;
  }

  .profile-item .value {
    color: var(--accent-primary);
    font-weight: bold;
    font-size: 1rem;
  }

  .profile-item .value.trend {
    background: var(--glass);
    padding: 4px 8px;
    border-radius: 4px;
    text-transform: capitalize;
  }

  @media (max-width: 768px) {
    .metrics-grid {
      grid-template-columns: 1fr;
    }
    .profile-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const ANALYTICS_SCRIPTS = `
<script src="js/persistence.js"><\/script>
<script src="js/advanced-observability.js"><\/script>
<script src="js/analytics-dashboard.js"><\/script>
<script src="js/system-intelligence.js"><\/script>
`;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ANALYTICS_STYLES,
    ANALYTICS_SCRIPTS
  };
}