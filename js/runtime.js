/**
 * Artificial Swarm v3 - Integrated Swarm Runtime
 * Orchestrates all components: Ventures, Agents, Workflows, Memory, Scheduler
 */

class SwarmRuntime {
  constructor() {
    this.ventures = new Map();
    this.agents = {};
    this.scheduler = null;
    this.memory = null;
    this.observability = null;
    this.toolRegistry = null;
    this.isRunning = false;
  }

  initialize(config = {}) {
    // Initialize components
    this.scheduler = config.scheduler || new TaskScheduler();
    this.memory = config.memory || new MemoryStore();
    this.observability = config.observability || new ObservabilitySystem();
    this.toolRegistry = config.toolRegistry || new ToolRegistry();
    
    // Initialize default agents
    this.agents = createSwarmAgents();
  }

  createVenture(config) {
    const venture = new Venture(config);
    
    // Initialize venture with agents
    Object.values(this.agents).forEach(agent => {
      venture.addAgent(agent);
    });
    
    // Setup workflow
    const workflow = createWorkflow('STANDARD_MISSION');
    venture.setWorkflowGraph(workflow.nodes);
    
    this.ventures.set(venture.id, venture);
    this.memory.addLongTermMemory(`Created venture: ${venture.metadata.name}`, 'venture-lifecycle');
    
    return venture;
  }

  getVenture(ventureId) {
    return this.ventures.get(ventureId);
  }

  async executeMission(ventureId) {
    const venture = this.getVenture(ventureId);
    if (!venture) throw new Error(`Venture ${ventureId} not found`);
    
    venture.status.phase = 'execution';
    this.observability.recordActivity('runtime', 'mission_started', { ventureId, name: venture.metadata.name });
    
    try {
      // Create and execute workflow
      const workflow = createWorkflow('STANDARD_MISSION');
      const result = await workflow.execute(this.agents);
      
      venture.updateTaskStatus(null, 'completed');
      venture.moveToNextPhase();
      
      this.memory.addLongTermMemory(
        `Mission completed for ${venture.metadata.name}. Result: ${JSON.stringify(result)}`,
        'mission-results'
      );
      
      this.observability.recordActivity('runtime', 'mission_completed', { ventureId, result });
      
      return result;
    } catch (error) {
      venture.status.phase = 'failed';
      this.observability.recordActivity('runtime', 'mission_failed', { ventureId, error: error.message });
      throw error;
    }
  }

  async startScheduler() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    // Add sample tasks for demonstration
    this.ventures.forEach(venture => {
      const task = {
        description: `Execute mission for ${venture.metadata.name}`,
        priority: 8,
        ventureId: venture.id
      };
      this.scheduler.enqueue(task);
    });
    
    // Start scheduler
    await this.scheduler.start(this.agents);
  }

  stopScheduler() {
    this.isRunning = false;
    this.scheduler.pause();
  }

  getSystemMetrics() {
    return {
      ventures: this.ventures.size,
      agents: Object.keys(this.agents).length,
      schedulerStats: this.scheduler.getStats(),
      health: this.observability.export(),
      tools: this.toolRegistry.export()
    };
  }

  export() {
    return {
      ventures: Array.from(this.ventures.values()).map(v => v.export()),
      metrics: this.getSystemMetrics(),
      memory: this.memory.export()
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SwarmRuntime };
}