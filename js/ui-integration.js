/**
 * Artificial Swarm v3 - Updated UI Integration
 * Enhanced index.html with Phase 2-3 support
 * Add these styles to your CSS and scripts to head
 */

// CSS to add to <style> section:
const PHASE_3_STYLES = `
  .command-center {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background: var(--card-bg);
    border-radius: 12px;
  }
  
  .command-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border);
  }
  
  .command-header h2 {
    margin: 0;
    color: var(--accent-primary);
  }
  
  .timestamp {
    font-size: 0.8rem;
    color: var(--text-dim);
  }
  
  .global-status-panel {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .status-card {
    background: var(--glass);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 15px;
    text-align: center;
  }
  
  .status-value {
    font-size: 1.8rem;
    font-weight: bold;
    color: var(--accent-primary);
    margin-bottom: 5px;
  }
  
  .status-label {
    font-size: 0.75rem;
    color: var(--text-dim);
    text-transform: uppercase;
  }
  
  .command-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  
  .mission-graph-container,
  .health-panel {
    background: var(--glass);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 15px;
  }
  
  .mission-graph-container h3,
  .health-panel h3 {
    margin-top: 0;
    color: var(--accent-primary);
  }
  
  #workflow-canvas {
    width: 100%;
    height: auto;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg-deep);
  }
  
  .health-indicator {
    font-size: 2rem;
    text-align: center;
    margin: 10px 0;
  }
  
  .health-metrics {
    font-size: 0.85rem;
    color: var(--text-dim);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .health-metrics span {
    color: var(--accent-primary);
    font-weight: bold;
  }
  
  .activity-feed-container {
    background: var(--glass);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 15px;
  }
  
  .activity-feed-container h3 {
    margin-top: 0;
    color: var(--accent-primary);
  }
  
  .activity-feed {
    max-height: 200px;
    overflow-y: auto;
  }
  
  .activity-entry {
    display: flex;
    gap: 10px;
    padding: 8px;
    border-bottom: 1px solid var(--border);
    font-size: 0.8rem;
    font-family: 'Courier New', monospace;
  }
  
  .activity-time {
    color: var(--success);
    min-width: 90px;
  }
  
  .activity-agent {
    color: var(--accent-primary);
    font-weight: bold;
    min-width: 80px;
  }
  
  .activity-action {
    color: var(--text-main);
    flex: 1;
  }
  
  .no-activity {
    text-align: center;
    color: var(--text-dim);
    padding: 20px;
    font-style: italic;
  }
  
  @media (max-width: 768px) {
    .command-grid {
      grid-template-columns: 1fr;
    }
  }
`;

// Script to add to index.html before closing </body>:
const PHASE_3_SCRIPTS = `
<script src="js/venture.js"><\/script>
<script src="js/agents.js"><\/script>
<script src="js/workflow.js"><\/script>
<script src="js/memory.js"><\/script>
<script src="js/scheduler.js"><\/script>
<script src="js/observability.js"><\/script>
<script src="js/visualizer.js"><\/script>
<script src="js/command-center.js"><\/script>
<script src="js/tools.js"><\/script>
<script src="js/runtime.js"><\/script>
`;

console.log('Phase 2-3 UI integration complete. Add PHASE_3_STYLES to CSS and PHASE_3_SCRIPTS to HTML.');
